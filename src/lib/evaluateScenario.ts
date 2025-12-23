import type { JsonValue, Scenario, ScenarioCheck, ScenarioEvaluation } from "@/lib/types";

type PathSegment = { type: "key"; key: string } | { type: "index"; index: number };

function parsePath(path: string): PathSegment[] {
  const trimmed = path.trim();
  if (!trimmed) return [];

  const segments: PathSegment[] = [];
  const dotParts = trimmed.split(".").filter(Boolean);

  for (const part of dotParts) {
    const re = /([^\[\]]+)|\[(\d+)\]/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(part))) {
      if (match[1]) segments.push({ type: "key", key: match[1] });
      else if (match[2]) segments.push({ type: "index", index: Number(match[2]) });
    }
  }
  return segments;
}

function getAtPath(value: JsonValue, path: string): JsonValue | undefined {
  let current: JsonValue | undefined = value;
  for (const segment of parsePath(path)) {
    if (segment.type === "key") {
      if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
      current = (current as Record<string, JsonValue>)[segment.key];
    } else {
      if (!Array.isArray(current)) return undefined;
      current = current[segment.index];
    }
  }
  return current;
}

function jsonType(value: JsonValue | undefined): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function deepEqual(a: JsonValue, b: JsonValue): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i] as JsonValue, b[i] as JsonValue)) return false;
    }
    return true;
  }
  if (typeof a === "object") {
    if (typeof b !== "object" || Array.isArray(b)) return false;
    const aObj = a as Record<string, JsonValue>;
    const bObj = b as Record<string, JsonValue>;
    const aKeys = Object.keys(aObj).sort();
    const bKeys = Object.keys(bObj).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i++) {
      if (aKeys[i] !== bKeys[i]) return false;
      if (!deepEqual(aObj[aKeys[i]] as JsonValue, bObj[bKeys[i]] as JsonValue)) return false;
    }
    return true;
  }
  return false;
}

function evaluateCheck(check: ScenarioCheck, json: JsonValue): { ok: boolean; message: string; path?: string } {
  const actual = getAtPath(json, check.path);
  const base = check.label;

  switch (check.op) {
    case "exists": {
      const ok = actual !== undefined;
      return { ok, message: ok ? base : check.hint ?? base, path: check.path };
    }
    case "typeIs": {
      const expectedType = String(check.expected);
      const ok = jsonType(actual) === expectedType;
      return {
        ok,
        message: ok ? base : check.hint ?? `${base} (expected type ${expectedType}, got ${jsonType(actual)})`,
        path: check.path,
      };
    }
    case "includes": {
      const ok = Array.isArray(actual) && actual.some((item) => deepEqual(item as JsonValue, check.expected as JsonValue));
      return { ok, message: ok ? base : check.hint ?? base, path: check.path };
    }
    case "equals": {
      const ok = actual !== undefined && check.expected !== undefined && deepEqual(actual as JsonValue, check.expected as JsonValue);
      return { ok, message: ok ? base : check.hint ?? base, path: check.path };
    }
    default: {
      return { ok: false, message: check.hint ?? base, path: check.path };
    }
  }
}

export function evaluateScenario(scenario: Scenario, json: JsonValue): ScenarioEvaluation {
  const results = scenario.checks.map((check) => {
    const { ok, message, path } = evaluateCheck(check, json);
    return { checkId: check.id, ok, message, path };
  });
  const passed = results.filter((r) => r.ok).length;
  return { ok: passed === results.length, passed, total: results.length, results };
}

