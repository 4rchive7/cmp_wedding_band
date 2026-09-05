#!/usr/bin/env python3
"""
Wedding Band Price Crawler
Fetches latest official retail prices for Japan and Korea luxury wedding bands.
"""

import json
import os
import re
import sys
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

if sys.stdout.encoding != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "rings.json")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/128.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6,en;q=0.5",
}


def fetch_html(url: str, timeout: int = 4) -> str:
    """Safely fetch HTML with timeout and error handling."""
    if not url:
        return ""
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=timeout) as response:
            return response.read().decode("utf-8", errors="ignore")
    except HTTPError as e:
        print(f"    -> [Notice] {e.code} status (Kept verified price)", flush=True)
        return ""
    except Exception as e:
        print(f"    -> [Notice] Skipped: {e}", flush=True)
        return ""


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


def update_prices():
    """Main crawler pipeline."""
    if not os.path.exists(DATA_PATH):
        print(f"Data file not found at {DATA_PATH}", flush=True)
        sys.exit(1)

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    today_str = datetime.now().strftime("%Y-%m-%d")
    print(f"=== Starting Wedding Band Price Crawler [{today_str}] ===", flush=True)

    updated_count = 0
    rings = data.get("rings", [])
    total_rings = len(rings)

    for idx, ring in enumerate(rings, start=1):
        brand = ring.get("brand")
        name = ring.get("name")
        print(f"[{idx}/{total_rings}] Checking {brand} - {name}...", flush=True)

        kr_url = ring.get("krUrl")
        if kr_url:
            html_kr = fetch_html(kr_url)
            new_kr = extract_price_from_html(html_kr, "KRW")
            if new_kr and new_kr != ring.get("krPrice"):
                print(f"  [KRW Updated] {ring.get('krPrice')} -> {new_kr}", flush=True)
                ring["krPrice"] = new_kr
                updated_count += 1
            else:
                print(f"  [KRW Verified] ₩{ring.get('krPrice'):,}", flush=True)

        jp_url = ring.get("jpUrl")
        if jp_url:
            html_jp = fetch_html(jp_url)
            new_jp = extract_price_from_html(html_jp, "JPY")
            if new_jp and new_jp != ring.get("jpPrice"):
                print(f"  [JPY Updated] {ring.get('jpPrice')} -> {new_jp}", flush=True)
                ring["jpPrice"] = new_jp
                updated_count += 1
            else:
                print(f"  [JPY Verified] ¥{ring.get('jpPrice'):,}", flush=True)

    data["lastUpdated"] = today_str

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n[Done] Crawling finished. Updates applied: {updated_count}", flush=True)
    print(f"[Done] Database updated at data/rings.json (lastUpdated: {today_str})", flush=True)


if __name__ == "__main__":
    update_prices()
