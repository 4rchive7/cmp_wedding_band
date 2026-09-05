#!/usr/bin/env python3
"""
Wedding Band Price Crawler with Detailed Logging
Fetches latest official retail prices for Japan and Korea luxury wedding bands
and outputs structured crawl logs for the frontend UI.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RINGS_PATH = os.path.join(DATA_DIR, "rings.json")
LOG_PATH = os.path.join(DATA_DIR, "crawl_log.json")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5",
}


def get_kst_now():
    """Get current time in KST (UTC+9)."""
    kst = timezone(timedelta(hours=9))
    return datetime.now(kst)


def fetch_html_with_status(url: str, timeout: int = 4) -> tuple[str, int, str]:
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


def extract_price_from_html(html: str, currency_code: str) -> int | None:
    """Extract price from OpenGraph meta tags, JSON-LD schema, or regex."""
    if not html:
        return None

    og_match = re.search(
        r'<meta\s+(?:property|name)=["\'](?:product:price:amount|price)["\']\s+content=["\']([\d,.]+)["\']',
        html,
        re.IGNORECASE,
    )
    if og_match:
        val = og_match.group(1).replace(",", "").split(".")[0]
        if val.isdigit() and int(val) > 1000:
            return int(val)

    ld_match = re.search(
        r'["\']price["\']\s*:\s*["\']?([\d,.]+)["\']?', html, re.IGNORECASE
    )
    if ld_match:
        val = ld_match.group(1).replace(",", "").split(".")[0]
        if val.isdigit() and int(val) > 1000:
            return int(val)

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


def update_prices():
    """Main crawler pipeline with JSON log generation."""
    if not os.path.exists(RINGS_PATH):
        print(f"Data file not found at {RINGS_PATH}", flush=True)
        sys.exit(1)

    with open(RINGS_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    now_kst = get_kst_now()
    timestamp_str = now_kst.strftime("%Y-%m-%d %H:%M:%S KST")
    today_str = now_kst.strftime("%Y-%m-%d")

    print(f"=== Starting Wedding Band Price Crawler [{timestamp_str}] ===", flush=True)

    updated_count = 0
    rings = data.get("rings", [])
    total_rings = len(rings)
    log_items = []

    for idx, ring in enumerate(rings, start=1):
        brand = ring.get("brand")
        name = ring.get("name")
        print(f"\n[{idx}/{total_rings}] Checking {brand} - {name}...", flush=True)

        kr_status_desc = "Verified"
        jp_status_desc = "Verified"
        kr_code = 200
        jp_code = 200

        # 1. Korea Price Check
        kr_url = ring.get("krUrl")
        if kr_url:
            html_kr, kr_code, kr_msg = fetch_html_with_status(kr_url)
            new_kr = extract_price_from_html(html_kr, "KRW")
            img_kr = extract_image_from_html(html_kr)
            if img_kr and not ring.get("imageUrl"):
                ring["imageUrl"] = img_kr
            if new_kr and new_kr != ring.get("krPrice"):
                print(f"  [KRW Updated] {ring.get('krPrice')} -> {new_kr}", flush=True)
                ring["krPrice"] = new_kr
                kr_status_desc = "Updated"
                updated_count += 1
            else:
                kr_status_desc = f"{kr_msg} (정가 유지)" if kr_code != 200 else "정상 확인"
                print(f"  [KRW Status: {kr_code}] ₩{ring.get('krPrice'):,}", flush=True)

        # 2. Japan Price Check
        jp_url = ring.get("jpUrl")
        if jp_url:
            html_jp, jp_code, jp_msg = fetch_html_with_status(jp_url)
            new_jp = extract_price_from_html(html_jp, "JPY")
            img_jp = extract_image_from_html(html_jp)
            if img_jp and not ring.get("imageUrl"):
                ring["imageUrl"] = img_jp
            if new_jp and new_jp != ring.get("jpPrice"):
                print(f"  [JPY Updated] {ring.get('jpPrice')} -> {new_jp}", flush=True)
                ring["jpPrice"] = new_jp
                jp_status_desc = "Updated"
                updated_count += 1
            else:
                jp_status_desc = f"{jp_msg} (정가 유지)" if jp_code != 200 else "정상 확인"
                print(f"  [JPY Status: {jp_code}] ¥{ring.get('jpPrice'):,}", flush=True)

        log_items.append({
            "id": ring.get("id"),
            "brand": brand,
            "brandKr": ring.get("brandKr", brand),
            "name": name,
            "krPrice": ring.get("krPrice"),
            "jpPrice": ring.get("jpPrice"),
            "krStatus": kr_status_desc,
            "jpStatus": jp_status_desc,
            "krCode": kr_code,
            "jpCode": jp_code,
            "imageUrl": ring.get("imageUrl"),
            "krUrl": kr_url,
            "jpUrl": jp_url,
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
        "verifiedCount": total_rings - updated_count,
        "logs": log_items
    }

    with open(LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(crawl_log, f, ensure_ascii=False, indent=2)

    print(f"\n[Done] Crawling finished. Updates applied: {updated_count}", flush=True)
    print(f"[Done] Log saved to {LOG_PATH}", flush=True)


if __name__ == "__main__":
    update_prices()
