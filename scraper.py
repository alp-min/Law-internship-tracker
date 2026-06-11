"""
Law Internship Tracker - Daily Scraper
Scrapes law firm careers pages, extracts dates using Claude API,
and updates Supabase database. Flags uncertain results for manual review.
"""

import os
import json
import asyncio
from datetime import date
from typing import Optional
import httpx
from bs4 import BeautifulSoup
from supabase import create_client, Client
import anthropic

# ── Config ────────────────────────────────────────────────────────────────────
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
ANTHROPIC_KEY = os.environ["ANTHROPIC_API_KEY"]
CONFIDENCE_THRESHOLD = 75  # auto-update if confidence >= this, else flag

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
claude = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# ── Scraper ───────────────────────────────────────────────────────────────────
async def scrape_page(url: str) -> Optional[str]:
    """Fetch and clean a careers page, returning plain text."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            r = await client.get(url, headers=headers)
            r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        # Remove nav, footer, scripts, styles — keep content
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        # Truncate to ~4000 chars to keep token cost low
        return text[:4000]
    except Exception as e:
        print(f"  Scrape error for {url}: {e}")
        return None


# ── Claude extraction ─────────────────────────────────────────────────────────
def extract_dates(firm_name: str, page_text: str) -> dict:
    """Ask Claude to extract application dates from scraped text."""
    prompt = f"""You are extracting internship/vacation scheme application dates from a law firm careers page.

Firm: {firm_name}

Page content:
{page_text}

Extract the following and respond ONLY with valid JSON, no other text:
{{
  "status": "open" | "closed" | "not_yet_open" | "unknown",
  "opening_date": "YYYY-MM-DD or null",
  "closing_date": "YYYY-MM-DD or null",
  "programme_name": "name of the scheme or null",
  "confidence": 0-100,
  "notes": "any relevant context in one sentence or null"
}}

Rules:
- If you cannot find clear dates, set them to null and lower confidence accordingly
- confidence should reflect how certain you are the dates are correct
- Focus on summer vacation schemes and training contract applications
- Today's date is {date.today().isoformat()}
"""
    try:
        message = claude.messages.create(
            model="claude-haiku-4-5-20251001",  # cheapest model, sufficient for extraction
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        raw = message.content[0].text.strip()
        return json.loads(raw)
    except Exception as e:
        print(f"  Claude extraction error: {e}")
        return {"status": "unknown", "opening_date": None, "closing_date": None,
                "confidence": 0, "notes": f"Extraction failed: {e}"}


# ── Database helpers ──────────────────────────────────────────────────────────
def get_all_firms() -> list[dict]:
    """Fetch all firms with a careers_url from the database."""
    result = supabase.table("firms").select("*").not_.is_("careers_url", "null").execute()
    return result.data or []


def update_firm(firm_id: int, extracted: dict, flagged: bool):
    """Write extracted data back to the firms table."""
    payload = {
        "status": extracted.get("status"),
        "opening_date": extracted.get("opening_date"),
        "closing_date": extracted.get("closing_date"),
        "last_checked": date.today().isoformat(),
        "needs_review": flagged,
        "scrape_notes": extracted.get("notes"),
    }
    supabase.table("firms").update(payload).eq("id", firm_id).execute()


def log_change(firm_id: int, old: dict, new: dict):
    """Insert a row into scrape_log for audit trail."""
    supabase.table("scrape_log").insert({
        "firm_id": firm_id,
        "old_status": old.get("status"),
        "new_status": new.get("status"),
        "old_closing_date": old.get("closing_date"),
        "new_closing_date": new.get("closing_date"),
        "confidence": new.get("confidence"),
        "checked_at": date.today().isoformat(),
    }).execute()


# ── Main loop ─────────────────────────────────────────────────────────────────
async def run():
    firms = get_all_firms()
    print(f"Checking {len(firms)} firms...\n")

    auto_updated = 0
    flagged = 0
    errors = 0

    for firm in firms:
        firm_id = firm["id"]
        firm_name = firm["name"]
        url = firm["careers_url"]

        print(f"[{firm_name}] Scraping {url}")
        page_text = await scrape_page(url)

        if not page_text:
            errors += 1
            print(f"  ✗ Could not scrape\n")
            continue

        extracted = extract_dates(firm_name, page_text)
        confidence = extracted.get("confidence", 0)
        needs_flag = confidence < CONFIDENCE_THRESHOLD

        # Check if anything actually changed
        changed = (
            extracted.get("status") != firm.get("status") or
            extracted.get("closing_date") != firm.get("closing_date") or
            extracted.get("opening_date") != firm.get("opening_date")
        )

        if changed:
            log_change(firm_id, firm, extracted)

        update_firm(firm_id, extracted, needs_flag)

        if needs_flag:
            flagged += 1
            print(f"  ⚠ Flagged for review (confidence: {confidence}%)")
        else:
            auto_updated += 1
            print(f"  ✓ Updated (confidence: {confidence}%, status: {extracted.get('status')})")

        print()

    print("─" * 50)
    print(f"Done. Auto-updated: {auto_updated} | Flagged: {flagged} | Errors: {errors}")


if __name__ == "__main__":
    asyncio.run(run())
