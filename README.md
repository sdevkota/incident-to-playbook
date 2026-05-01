# Incident To Playbook

Turn AI incident reports into concrete mitigation playbooks.

> Version: 2.0.0 | Runtime: Python | License: MIT | Status: production-oriented v2 foundation

## Problem

AI incident writeups often stop at narrative, leaving teams without reusable controls, tests, owners, and deadlines.

## What this project solves

A playbook generator that validates incident facts, affected systems, root causes, mitigations, owners, and verification tasks.

Incident To Playbook is now Python-first. It ships as a dependency-free Python package and CLI that validates a domain-specific JSON packet, emits actionable findings, and gives contributors a practical foundation for adapters, datasets, evals, and workflow integrations.

## Quick start

```bash
python3 -m unittest discover -s tests
python3 -m incident_to_playbook.cli sample
```

Analyze your own packet:

```bash
python3 -m incident_to_playbook.cli ./packet.json
```

Or pipe JSON:

```bash
cat packet.json | python3 -m incident_to_playbook.cli
```

## Example packet

```json
{
  "incident": {
    "id": "ai-42",
    "class": "data_exfiltration",
    "severity": "critical"
  },
  "rootCauses": [
    "excessive_tool_scope",
    "missing_output_filter"
  ],
  "actions": [
    {
      "owner": "platform",
      "mitigation": "downscope token",
      "due": "2026-05-10"
    }
  ]
}
```

## Library usage

```python
from incident_to_playbook import analyze

report = analyze({
  "incident": {
    "id": "ai-42",
    "class": "data_exfiltration",
    "severity": "critical"
  },
  "rootCauses": [
    "excessive_tool_scope",
    "missing_output_filter"
  ],
  "actions": [
    {
      "owner": "platform",
      "mitigation": "downscope token",
      "due": "2026-05-10"
    }
  ]
})
print(report["summary"])
```

## v2 behavior

- Python-first CLI and importable library.
- Validates required fields for the domain packet.
- Scores readiness from 0 to 100.
- Reports missing or weak governance evidence.
- Runs fully offline with no API keys and no network access.

## Contribution map

- Add control libraries.
- Add ticket exports.
- Add postmortem templates.
- Add verification runners.

## Project principles

- Human agency over blind automation.
- Open standards over vendor lock-in.
- Auditable decisions over hidden magic.
- Privacy and safety as design constraints, not release notes.
