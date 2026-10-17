#!/usr/bin/env node
/**
 * npm audit com ignores documentados em npm-audit-ignore.json.
 * Só falha em advisory high/critical que não esteja na lista de ignore.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignorePath = path.join(root, "npm-audit-ignore.json");
const ignore = JSON.parse(fs.readFileSync(ignorePath, "utf8"));
const ignoreIds = new Set(Object.keys(ignore));

let report;
try {
  report = JSON.parse(
    execSync("npm audit --json --audit-level=high", {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
} catch (e) {
  const out = `${e.stdout || ""}`;
  report = out ? JSON.parse(out) : { vulnerabilities: {} };
}

const blockers = [];
for (const [name, vuln] of Object.entries(report.vulnerabilities || {})) {
  for (const via of vuln.via || []) {
    if (typeof via === "string") continue;
    if (!["high", "critical"].includes(via.severity)) continue;
    const match = String(via.url || "").match(/GHSA-[\w-]+/);
    const id = match ? match[0] : null;
    if (id && ignoreIds.has(id)) continue;
    blockers.push({
      name,
      severity: via.severity,
      title: via.title,
      url: via.url,
    });
  }
}

if (blockers.length) {
  console.error(JSON.stringify(blockers, null, 2));
  process.exit(1);
}

console.log(
  "npm audit: sem vulnerabilidades high/critical (após ignores documentados).",
);
for (const [id, reason] of Object.entries(ignore)) {
  console.log(`ignore ${id}: ${reason}`);
}
