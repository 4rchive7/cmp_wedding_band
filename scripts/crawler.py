#!/usr/bin/env python3
"""
Wedding Band Price Crawler with Soft 404 Detection & Fallback Validation
- Detects soft 404 error phrases ('없습니다', '죄송합니다', 'お探しのページは見つかりません', etc.)
- Validates page content integrity before extracting prices
- Tries fallback official search queries if initial product URL is moved/removed
- Outputs structured logs for UI consumption
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen, build_opener, HTTPCookieProcessor, HTTPRedirectHandler
from urllib.error import URLError, HTTPError

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RINGS_PATH = os.path.join(DATA_DIR, "rings.json")
LOG_PATH = os.path.join(DATA_DIR, "crawl_log.json")

# Install global opener with cookies & redirects
cookie_jar = HTTPCookieProcessor()
opener = build_opener(cookie_jar, HTTPRedirectHandler())
urllib.request.install_opener(opener)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,ja;q=0.7",
    "Sec-Ch-Ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
}

# Soft 404 & Page Not Found detection keywords
SOFT_404_KEYWORDS = {
    "KO": [
        "페이지를 찾을 수 없습니다",
        "찾으시는 상품이 없습니다",
        "존재하지 않는 페이지",
        "죄송합니다. 요청하신",
        "죄송합니다, 요청하신",
        "죄송합니다. 찾으시는",
        "죄송합니다, 찾으시는",
        "요청하신 페이지가 없습니다",
        "상품을 찾을 수 없습니다",
        "판매가 중단된 상품",
        "삭제된 페이지",
        "일치하는 검색 결과가 없습니다",
        "현재 판매하지 않는",
        "서비스 이용에 불편을 드려 죄송합니다"
    ],
    "JA": [
        "お探しのページは見つかりませんでした",
        "お探しのページは見つかりません",
        "ページが見つかりません",
        "ページを見つけることができませんでした",
        "申し訳ございません",
        "該当する商品がございません",
        "該当する商品は見つかりませんでした",
        "該当するページが見つかりません",
        "存在しません",
        "販売終了いたしました",
        "掲載終了",
        "削除された可能性",
        "一致する情報は見つかりませんでした"
    ],
    "EN": [
        "page not found",
        "product not found",
        "sorry, we couldn't find",
        "we can't find the page",
        "404 not found",
        "item is unavailable",
        "no longer available",
        "page does not exist",
        "sorry, something went wrong"
    ]
}


def get_kst_now():
    """Get current time in KST (UTC+9)."""
    kst = timezone(timedelta(hours=9))
    return datetime.now(kst)


def fetch_html_with_status(url: str, timeout: int = 5) -> tuple[str, int, str]:
    """Safely fetch HTML, returning (html_content, status_code, message)."""
    if not url:
        return "", 0, "No URL provided"
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=timeout) as response:
            code = response.getcode() or 200
            content = response.read().decode("utf-8", errors="ignore")
            return content, code, "OK"
    except HTTPError as e:
        return "", e.code, f"HTTP {e.code}"
    except URLError as e:
        return "", 0, f"Connection error: {e.reason}"
    except Exception as e:
        return "", 0, f"Error: {str(e)[:40]}"


def validate_page_content(html: str, lang: str = "KO") -> tuple[bool, str]:
    """
    Validate if the fetched HTML represents a valid product page
    and doesn't contain soft-404 error keywords ('없습니다', '죄송합니다', etc.).
    """
    if not html or len(html.strip()) < 300:
        return False, "빈 페이지 또는 내용 부족 (<300자)"

    html_lower = html.lower()

    # Check lang-specific keywords
    keywords_to_check = SOFT_404_KEYWORDS.get(lang, []) + SOFT_404_KEYWORDS["EN"]
    for kw in keywords_to_check:
        if kw.lower() in html_lower:
            return False, f"소프트 404 감지 ('{kw}')"

    return True, "정상 페이지"


def extract_price_from_html(html: str, currency_code: str) -> int | None:
    """Extract price from OpenGraph meta tags, JSON-LD schema, or regex."""
    if not html:
        return None

    # 1. OpenGraph meta tags
    og_match = re.search(
        r'<meta\s+(?:property|name)=["\'](?:product:price:amount|price)["\']\s+content=["\']([\d,.]+)["\']',
        html,
        re.IGNORECASE,
    )
    if og_match:
        val = og_match.group(1).replace(",", "").split(".")[0]
        if val.isdigit() and int(val) > 1000:
            return int(val)

    # 2. JSON-LD schema price
    ld_match = re.search(
        r'["\']price["\']\s*:\s*["\']?([\d,.]+)["\']?', html, re.IGNORECASE
    )
    if ld_match:
        val = ld_match.group(1).replace(",", "").split(".")[0]
        if val.isdigit() and int(val) > 1000:
            return int(val)

    # 3. Currency Symbol Regex fallback
    if currency_code == "KRW":
        krw_match = re.search(r"[₩\\]\s*([\d,]{6,12})", html)
        if krw_match:
            val = krw_match.group(1).replace(",", "")
            if val.isdigit():
                return int(val)
    elif currency_code == "JPY":
        jpy_match = re.search(r"[¥\\]\s*([\d,]{5,10})", html)
        if jpy_match:
            val = jpy_match.group(1).replace(",", "")
            if val.isdigit():
                return int(val)

    return None


def extract_image_from_html(html: str) -> str | None:
    """Extract product image URL from OpenGraph or Twitter meta tags."""
    if not html:
        return None
    match = re.search(
        r'<meta\s+(?:property|name)=["\'](?:og:image|twitter:image)["\']\s+content=["\']([^"\']+)["\']',
        html,
        re.IGNORECASE,
    )
    if match and match.group(1).startswith("http"):
        return match.group(1)
    return None


def generate_search_fallback_url(brand: str, ring_name: str, country: str) -> str:
    """Generate brand official search fallback URL for re-discovery."""
    clean_query = urllib.parse.quote(ring_name.split("(")[0].strip())
    brand_lower = brand.lower()

    if "cartier" in brand_lower:
        locale = "ko-kr" if country == "KR" else "ja-jp"
        return f"https://www.cartier.com/{locale}/search?q={clean_query}"
    elif "tiffany" in brand_lower:
        tld = "kr" if country == "KR" else "co.jp"
        return f"https://www.tiffany.{tld}/search?q={clean_query}"
    elif "chanel" in brand_lower:
        locale = "ko_KR" if country == "KR" else "ja_JP"
        return f"https://www.chanel.com/{locale}/fine-jewellery/search/?q={clean_query}"
    elif "bvlgari" in brand_lower:
        locale = "ko-kr" if country == "KR" else "ja-jp"
        return f"https://www.bulgari.com/{locale}/search?q={clean_query}"
    elif "tasaki" in brand_lower:
        tld = "kr" if country == "KR" else "co.jp"
        return f"https://www.tasaki.{tld}/bridal/search/?q={clean_query}"
    elif "boucheron" in brand_lower:
        locale = "ko-kr" if country == "KR" else "ja-jp"
        return f"https://www.boucheron.com/{locale}/catalogsearch/result/?q={clean_query}"
    elif "chaumet" in brand_lower:
        locale = "kor_ko" if country == "KR" else "jpn_ja"
        return f"https://www.chaumet.com/{locale}/search?q={clean_query}"
    elif "graff" in brand_lower:
        locale = "kr-ko" if country == "KR" else "jp-ja"
        return f"https://www.graff.com/{locale}/search?q={clean_query}"
    else:
        return f"https://www.google.com/search?q={urllib.parse.quote(f'{brand} {ring_name}')}"


def verify_and_crawl_ring_url(url: str, lang: str, currency: str, brand: str, name: str, current_price: int):
    """
    Core verification pipeline:
    1. Fetch HTML
    2. Validate against Soft 404 keywords
    3. If invalid, try fallback search URL
    4. Extract price & image
    5. Return status report
    """
    if not url:
        return {
            "status": "URL 미제공",
            "code": 0,
            "price": current_price,
            "image": None,
            "url": "",
            "isSoft404": False,
            "isValid": False
        }

    html, code, msg = fetch_html_with_status(url)
    is_valid_page, reason = validate_page_content(html, lang=lang)
    
    is_soft_404 = False
    status_desc = "정상 확인"
    extracted_price = None
    extracted_image = None
    final_url = url

    if code == 200 and not is_valid_page:
        # Detected Soft 404 error keyword inside page!
        is_soft_404 = True
        status_desc = f"⚠️ {reason}"
        print(f"  [{lang} Soft-404 Alert] {reason} at {url}", flush=True)

        # Attempt search fallback discovery
        fallback_url = generate_search_fallback_url(brand, name, lang)
        print(f"  [{lang} Retrying Fallback Search] {fallback_url}", flush=True)
        fb_html, fb_code, _ = fetch_html_with_status(fallback_url)
        fb_valid, _ = validate_page_content(fb_html, lang=lang)

        if fb_code == 200 and fb_valid:
            status_desc = "🔄 대체 검색 URL 확인"
            final_url = fallback_url
            extracted_price = extract_price_from_html(fb_html, currency)
            extracted_image = extract_image_from_html(fb_html)
    elif code == 200 and is_valid_page:
        extracted_price = extract_price_from_html(html, currency)
        extracted_image = extract_image_from_html(html)
        if extracted_price and extracted_price != current_price:
            status_desc = f"✨ 신규 가격 반영 ({current_price:,} -> {extracted_price:,})"
        else:
            status_desc = "정상 확인"
    else:
        status_desc = f"❌ 접속 오류 ({msg})"

    return {
        "status": status_desc,
        "code": code,
        "price": extracted_price or current_price,
        "image": extracted_image,
        "url": final_url,
        "isSoft404": is_soft_404,
        "isValid": is_valid_page and code == 200
    }


def update_prices():
    """Main crawler pipeline with Soft 404 detection & logging."""
    if not os.path.exists(RINGS_PATH):
        print(f"Data file not found at {RINGS_PATH}", flush=True)
        sys.exit(1)

    with open(RINGS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    now_kst = get_kst_now()
    timestamp_str = now_kst.strftime("%Y-%m-%d %H:%M:%S KST")
    today_str = now_kst.strftime("%Y-%m-%d")

    print(f"=== Starting Wedding Band Price Crawler with Soft-404 Validation [{timestamp_str}] ===", flush=True)

    updated_count = 0
    soft_404_count = 0
    rings = data.get("rings", [])
    total_rings = len(rings)
    log_items = []

    for idx, ring in enumerate(rings, start=1):
        brand = ring.get("brand")
        name = ring.get("name")
        print(f"\n[{idx}/{total_rings}] Checking {brand} - {name}...", flush=True)

        # 1. Korea URL Check
        kr_res = verify_and_crawl_ring_url(
            url=ring.get("krUrl"),
            lang="KO",
            currency="KRW",
            brand=brand,
            name=name,
            current_price=ring.get("krPrice", 0)
        )
        if kr_res["price"] != ring.get("krPrice") and kr_res["price"] > 0:
            print(f"  [KRW Price Updated] ₩{ring.get('krPrice'):,} -> ₩{kr_res['price']:,}", flush=True)
            ring["krPrice"] = kr_res["price"]
            updated_count += 1
        if kr_res["image"] and not ring.get("imageUrl"):
            ring["imageUrl"] = kr_res["image"]
        if kr_res["isSoft404"]:
            soft_404_count += 1
        print(f"  [KRW Status: {kr_res['code']}] {kr_res['status']} (₩{ring.get('krPrice'):,})", flush=True)

        # 2. Japan URL Check
        jp_res = verify_and_crawl_ring_url(
            url=ring.get("jpUrl"),
            lang="JA",
            currency="JPY",
            brand=brand,
            name=name,
            current_price=ring.get("jpPrice", 0)
        )
        if jp_res["price"] != ring.get("jpPrice") and jp_res["price"] > 0:
            print(f"  [JPY Price Updated] ¥{ring.get('jpPrice'):,} -> ¥{jp_res['price']:,}", flush=True)
            ring["jpPrice"] = jp_res["price"]
            updated_count += 1
        if jp_res["image"] and not ring.get("imageUrl"):
            ring["imageUrl"] = jp_res["image"]
        if jp_res["isSoft404"]:
            soft_404_count += 1
        print(f"  [JPY Status: {jp_res['code']}] {jp_res['status']} (¥{ring.get('jpPrice'):,})", flush=True)

        log_items.append({
            "id": ring.get("id"),
            "brand": brand,
            "brandKr": ring.get("brandKr", brand),
            "name": name,
            "krPrice": ring.get("krPrice"),
            "jpPrice": ring.get("jpPrice"),
            "krStatus": kr_res["status"],
            "jpStatus": jp_res["status"],
            "krCode": kr_res["code"],
            "jpCode": jp_res["code"],
            "imageUrl": ring.get("imageUrl"),
            "krUrl": ring.get("krUrl"),
            "jpUrl": ring.get("jpUrl"),
            "isSoft404": kr_res["isSoft404"] or jp_res["isSoft404"]
        })

    data["lastUpdated"] = today_str

    # Save rings.json
    with open(RINGS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Save crawl_log.json
    crawl_log = {
        "timestamp": timestamp_str,
        "date": today_str,
        "status": "COMPLETED",
        "totalRings": total_rings,
        "updatedCount": updated_count,
        "soft404Count": soft_404_count,
        "verifiedCount": total_rings - (updated_count + soft_404_count),
        "logs": log_items
    }

    with open(LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(crawl_log, f, ensure_ascii=False, indent=2)

    print(f"\n==========================================", flush=True)
    print(f"[Done] Crawling finished.", flush=True)
    print(f" - Total Rings Checked: {total_rings}", flush=True)
    print(f" - Price Updates: {updated_count}", flush=True)
    print(f" - Soft 404 Alerts: {soft_404_count}", flush=True)
    print(f" - Log File Saved: {LOG_PATH}", flush=True)
    print(f"==========================================", flush=True)


if __name__ == "__main__":
    update_prices()
