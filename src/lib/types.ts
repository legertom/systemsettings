export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ScenarioCheckOp = "equals" | "includes" | "exists" | "typeIs";

export type ScenarioCheck = {
  id: string;
  label: string;
  hint?: string;
  path: string;
  op: ScenarioCheckOp;
  expected?: JsonValue;
};

export type Scenario = {
  id: string;
  title: string;
  description?: string;
  instructions: string[];
  initialJson: JsonValue;
  checks: ScenarioCheck[];
};

export type CheckResult = {
  checkId: string;
  ok: boolean;
  message: string;
  path?: string;
};

export type ScenarioEvaluation = {
  ok: boolean;
  passed: number;
  total: number;
  results: CheckResult[];
};
