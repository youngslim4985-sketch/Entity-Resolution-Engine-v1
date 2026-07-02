import json
from pathlib import Path
from typing import Any

AUDIT_LOG_PATH = Path("logs/audit.jsonl")


def write_audit_event(event: dict[str, Any], path: Path = AUDIT_LOG_PATH) -> dict[str, Any]:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")
    return event


def load_audit_events(path: Path = AUDIT_LOG_PATH) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]
