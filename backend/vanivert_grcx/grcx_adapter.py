"""
Vanivert grcx adapter
Runs grcx regulatory radar with French sources and pushes alerts
to Supabase + n8n webhook for client notifications.

Usage:
    python grcx_adapter.py --config vanivert_grcx.yaml

Environment variables:
    ANTHROPIC_API_KEY     — Claude Haiku for analysis (or use OLLAMA for sovereign)
    OLLAMA_HOST           — http://localhost:11434 (EU-sovereign Mistral fallback)
    SUPABASE_URL          — Vanivert Supabase project URL
    SUPABASE_KEY          — Supabase service role key
    VANIVERT_WEBHOOK_URL  — n8n webhook URL for client alerts
"""

from __future__ import annotations

import json
import logging
import os
import sys
import time
from pathlib import Path

import httpx
import yaml

# ── Add grcx to path (assumes grcx repo is a sibling directory) ──────────
GRCX_PATH = Path(__file__).parent.parent.parent / "grcx-main"
if GRCX_PATH.exists():
    sys.path.insert(0, str(GRCX_PATH))

from grcx.audit.log import AuditLog  # noqa: E402
from grcx.resolver.resolver import Resolver  # noqa: E402
from grcx.sentinel.runner import _build_log_state  # noqa: E402
from grcx.sentinel.regulatory.rss import RssSentinel  # noqa: E402

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vanivert.grcx")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
WEBHOOK_URL  = os.environ.get("VANIVERT_WEBHOOK_URL", "")


def push_to_supabase(entry: dict) -> None:
    """Write regulatory alert to Supabase for the Vanivert dashboard."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("SUPABASE_URL or SUPABASE_KEY not set — skipping Supabase push")
        return
    try:
        httpx.post(
            f"{SUPABASE_URL}/rest/v1/regulatory_alerts",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
            json={
                "jurisdiction": entry.get("jurisdiction"),
                "severity": entry.get("severity"),
                "summary": entry.get("summary"),
                "source_url": entry.get("source"),
                "event_type": entry.get("event_type"),
                "detail": json.dumps(entry.get("detail", {})),
                "entry_hash": entry.get("entry_hash"),
            },
            timeout=10.0,
        )
        logger.info(f"Pushed to Supabase: {entry.get('summary', '')[:60]}")
    except Exception as e:
        logger.error(f"Supabase push failed: {e}")


def notify_webhook(entry: dict) -> None:
    """Trigger n8n webhook for critical/warning alerts → email clients."""
    if not WEBHOOK_URL:
        return
    if entry.get("severity") not in ("critical", "warning"):
        return
    try:
        httpx.post(
            WEBHOOK_URL,
            json={
                "source": "grcx",
                "jurisdiction": entry.get("jurisdiction"),
                "severity": entry.get("severity"),
                "summary": entry.get("summary"),
                "url": entry.get("source"),
                "affected_controls": entry.get("detail", {}).get("affected_controls", []),
                "recommended_action": entry.get("detail", {}).get("recommended_action", ""),
                "framework": entry.get("detail", {}).get("framework", ""),
            },
            timeout=10.0,
        )
        logger.info(f"Webhook triggered for: {entry.get('summary', '')[:60]}")
    except Exception as e:
        logger.error(f"Webhook failed: {e}")


class VanivertAuditLog(AuditLog):
    """Extended AuditLog that mirrors entries to Supabase and n8n."""

    def write(self, event_type, summary, detail=None, severity="info",
              jurisdiction=None, source=None) -> dict:
        entry = super().write(
            event_type=event_type,
            summary=summary,
            detail=detail,
            severity=severity,
            jurisdiction=jurisdiction,
            source=source,
        )
        # Mirror to Supabase dashboard
        if event_type in ("resolver.assessment", "regulatory.new_publication"):
            push_to_supabase(entry)
        # Trigger n8n webhook for urgent items
        notify_webhook(entry)
        return entry


def run(config_path: str = "vanivert_grcx.yaml", poll_interval: int = 3600) -> None:
    """Main loop — polls all French regulatory feeds every hour."""
    with open(config_path) as f:
        config = yaml.safe_load(f)

    audit_dir = config.get("audit", {}).get("output", "vanivert-audit")
    log_path  = Path(audit_dir) / "grcx.log.jsonl"

    audit    = VanivertAuditLog(log_dir=audit_dir)
    resolver = Resolver(config=config, audit=audit)

    ingested_urls, unresolved = _build_log_state(log_path)
    logger.info(f"State: {len(ingested_urls)} ingested, {len(unresolved)} queued")

    sentinels = []
    for feed in config.get("sentinels", {}).get("regulatory", []):
        if feed.get("type") == "rss":
            sentinels.append(RssSentinel(
                url=feed["url"],
                jurisdiction=feed.get("jurisdiction", "UNKNOWN"),
            ))

    logger.info(f"Watching {len(sentinels)} French regulatory feeds")

    while True:
        for sentinel in sentinels:
            try:
                items = sentinel.fetch(ingested_urls)
                for item in items:
                    audit.write(
                        event_type="regulatory.new_publication",
                        summary=item.title,
                        severity="warning",
                        jurisdiction=item.jurisdiction,
                        source=item.url,
                        detail={
                            "fingerprint": item.fingerprint,
                            "published": item.published,
                            "summary": item.summary,
                            "feed_url": item.feed_url,
                        },
                    )
                    ingested_urls.add(item.url)
                    resolver.analyse(item)
            except Exception as e:
                logger.error(f"Sentinel error ({sentinel.jurisdiction}): {e}")

        logger.info(f"Sleeping {poll_interval}s until next poll...")
        time.sleep(poll_interval)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Vanivert regulatory radar")
    parser.add_argument("--config", default="vanivert_grcx.yaml")
    parser.add_argument("--interval", type=int, default=3600, help="Poll interval in seconds")
    args = parser.parse_args()
    run(config_path=args.config, poll_interval=args.interval)
