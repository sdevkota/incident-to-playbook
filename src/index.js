const project = {
  "slug": "incident-to-playbook",
  "title": "Incident To Playbook",
  "version": "1.0.0",
  "tagline": "Turn AI incident reports into concrete mitigation playbooks.",
  "problem": "AI incident writeups often stop at narrative, leaving teams without reusable controls, tests, owners, and deadlines.",
  "solution": "A playbook generator that validates incident facts, affected systems, root causes, mitigations, owners, and verification tasks.",
  "required": [
    "incident.id",
    "incident.class",
    "incident.severity",
    "rootCauses",
    "actions"
  ],
  "opportunities": [
    "control libraries",
    "ticket exports",
    "postmortem templates",
    "verification runners"
  ]
};

const samplePacket = {
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
};

function getPath(input, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => {
    if (value === undefined || value === null) return undefined;
    return value[key];
  }, input);
}

function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return true;
  return false;
}

function looksRisky(value) {
  if (typeof value !== "string") return false;
  return /(ignore previous|system:|developer:|send secrets|full[-_ ]?access|all permissions|wildcard|unreviewed|unknown)/i.test(value);
}

function scanRiskSignals(input, prefix = "") {
  const findings = [];
  if (Array.isArray(input)) {
    input.forEach((item, index) => findings.push(...scanRiskSignals(item, `${prefix}[${index}]`)));
    return findings;
  }
  if (!input || typeof input !== "object") {
    if (looksRisky(input)) {
      findings.push({
        id: "risky-language",
        path: prefix || "value",
        severity: "medium",
        message: "Risky instruction-like or over-broad language detected.",
        recommendation: "Review this field as untrusted data and keep it separate from system instructions."
      });
    }
    return findings;
  }
  for (const [key, value] of Object.entries(input)) {
    const next = prefix ? `${prefix}.${key}` : key;
    findings.push(...scanRiskSignals(value, next));
  }
  return findings;
}

function analyze(packet = samplePacket) {
  const missing = project.required
    .filter((field) => isEmpty(getPath(packet, field)))
    .map((field) => ({
      id: "missing-required-field",
      path: field,
      severity: "high",
      message: `Missing required field: ${field}`,
      recommendation: "Provide this value so the packet can be audited and reused by other tools."
    }));

  const riskSignals = scanRiskSignals(packet);
  const findings = [...missing, ...riskSignals];
  const highCount = findings.filter((finding) => finding.severity === "high").length;
  const mediumCount = findings.filter((finding) => finding.severity === "medium").length;
  const score = Math.max(0, 100 - highCount * 18 - mediumCount * 7);
  const status = score >= 90 ? "ready" : score >= 70 ? "needs-review" : "blocked";

  return {
    project: {
      slug: project.slug,
      title: project.title,
      version: project.version
    },
    status,
    score,
    summary: `${project.title} found ${findings.length} issue(s); readiness score ${score}/100.`,
    findings,
    nextActions: findings.length
      ? findings.slice(0, 5).map((finding) => finding.recommendation)
      : ["Packet is complete for the v1 validator. Consider adding adapter-specific evidence."],
    contributionIdeas: project.opportunities
  };
}

module.exports = { project, samplePacket, analyze };
