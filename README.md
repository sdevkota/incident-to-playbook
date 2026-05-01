# Incident To Playbook

Turn AI incident reports into concrete mitigation playbooks.

> Version: 1.0.0 | License: MIT | Status: production-oriented v1 foundation

## Problem

AI incident writeups often stop at narrative, leaving teams without reusable controls, tests, owners, and deadlines.

## What this project solves

A playbook generator that validates incident facts, affected systems, root causes, mitigations, owners, and verification tasks.

Incident To Playbook ships as a small, dependency-free CLI and library. It validates a domain-specific JSON packet, emits actionable findings, and gives contributors a concrete surface for adding adapters, richer checks, schemas, and integrations.

## Who it is for

AI safety teams, SREs, security teams, governance leads.

## Quick start

```bash
npm test
npm start -- sample
```

Analyze your own packet:

```bash
incident-to-playbook ./packet.json
```

Or pipe JSON:

```bash
cat packet.json | node src/cli.js
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

```js
const { analyze } = require("./src/index.js");

const report = analyze({
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
});
console.log(report.summary);
```

## v1 behavior

- Validates required fields for the domain packet.
- Scores readiness from 0 to 100.
- Reports missing or weak governance evidence.
- Suggests next actions and contributor extension points.
- Runs fully offline with no API keys and no network access.

## Contribution map

Good first contributions:

- Add control libraries.
- Add ticket exports.
- Add postmortem templates.
- Add verification runners.

Larger contributions:

- Add a JSON Schema and compatibility tests.
- Build import/export adapters for popular AI frameworks.
- Add real-world fixtures from public, non-sensitive examples.
- Improve scoring with transparent, documented heuristics.

## Project principles

- Human agency over blind automation.
- Open standards over vendor lock-in.
- Auditable decisions over hidden magic.
- Privacy and safety as design constraints, not release notes.

## GitHub Pages

The marketing site lives in `site/index.html`. Enable GitHub Pages from the `site` folder or use the included Pages workflow after publishing.

## Security

This project does not process secrets by default. If you build adapters that touch production systems, keep least privilege, explicit consent, and auditable logs in the design.
