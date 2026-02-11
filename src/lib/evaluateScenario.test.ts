import { describe, expect, it } from "vitest";
import { evaluateScenario } from "@/lib/evaluateScenario";
import type { Scenario } from "@/lib/types";

const baseScenario: Scenario = {
  id: "scenario-1",
  title: "Evaluator test",
  instructions: [],
  initialJson: {},
  checks: [],
};

describe("evaluateScenario", () => {
  it("passes equals, includes, exists, and typeIs checks", () => {
    const scenario: Scenario = {
      ...baseScenario,
      checks: [
        {
          id: "equals",
          label: "name is demo",
          path: "settings.name",
          op: "equals",
          expected: "demo",
        },
        {
          id: "includes",
          label: "roles include admin",
          path: "settings.roles",
          op: "includes",
          expected: "admin",
        },
        {
          id: "exists",
          label: "flags exists",
          path: "settings.flags",
          op: "exists",
        },
        {
          id: "type",
          label: "roles is array",
          path: "settings.roles",
          op: "typeIs",
          expected: "array",
        },
      ],
    };

    const result = evaluateScenario(scenario, {
      settings: {
        name: "demo",
        roles: ["user", "admin"],
        flags: { beta: true },
      },
    });

    expect(result.ok).toBe(true);
    expect(result.passed).toBe(4);
    expect(result.total).toBe(4);
  });

  it("supports indexed path checks", () => {
    const scenario: Scenario = {
      ...baseScenario,
      checks: [
        {
          id: "index",
          label: "first role is user",
          path: "settings.roles[0]",
          op: "equals",
          expected: "user",
        },
      ],
    };

    const result = evaluateScenario(scenario, {
      settings: { roles: ["user", "admin"] },
    });

    expect(result.ok).toBe(true);
    expect(result.results[0]).toMatchObject({ checkId: "index", ok: true });
  });

  it("returns hint message when a check fails", () => {
    const scenario: Scenario = {
      ...baseScenario,
      checks: [
        {
          id: "missing",
          label: "name exists",
          hint: "Add settings.name",
          path: "settings.name",
          op: "exists",
        },
      ],
    };

    const result = evaluateScenario(scenario, { settings: {} });

    expect(result.ok).toBe(false);
    expect(result.results[0]).toMatchObject({
      checkId: "missing",
      ok: false,
      message: "Add settings.name",
    });
  });
});

