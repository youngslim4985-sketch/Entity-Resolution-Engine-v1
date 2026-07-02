from pathlib import Path
from app.audit import write_audit_event, load_audit_events


def test_write_audit_event_persists_jsonl(tmp_path, monkeypatch):
    log_path = tmp_path / "logs" / "audit.jsonl"
    event = {"action": "score_computed", "entity_id": "abc123"}

    result = write_audit_event(event, path=log_path)

    assert result == event
    assert log_path.exists()
    contents = log_path.read_text().strip().splitlines()
    assert len(contents) == 1


def test_write_audit_event_appends(tmp_path):
    log_path = tmp_path / "audit.jsonl"
    write_audit_event({"a": 1}, path=log_path)
    write_audit_event({"a": 2}, path=log_path)

    lines = log_path.read_text().strip().splitlines()
    assert len(lines) == 2


def test_load_audit_events_reads_jsonl(tmp_path):
    log_path = tmp_path / "audit.jsonl"
    write_audit_event({"action": "one"}, path=log_path)
    write_audit_event({"action": "two"}, path=log_path)

    events = load_audit_events(path=log_path)

    assert events == [{"action": "one"}, {"action": "two"}]


def test_load_audit_events_missing_file_returns_empty(tmp_path):
    log_path = tmp_path / "nonexistent.jsonl"
    assert load_audit_events(path=log_path) == []
