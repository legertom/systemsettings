import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Scenario, ScenarioEvaluation } from "@/lib/types";

const { mockGetScenario, mockEvaluateScenario } = vi.hoisted(() => ({
  mockGetScenario: vi.fn(),
  mockEvaluateScenario: vi.fn(),
}));

vi.mock("@/lib/scenarioStore", () => ({
  getScenario: mockGetScenario,
}));

vi.mock("@/lib/evaluateScenario", () => ({
  evaluateScenario: mockEvaluateScenario,
}));

import { POST } from "@/app/api/scenarios/[id]/check/route";

const scenario: Scenario = {
  id: "scenario-1",
  title: "Scenario",
  instructions: [],
  initialJson: {},
  checks: [],
};

const evaluation: ScenarioEvaluation = {
  ok: true,
  passed: 1,
  total: 1,
  results: [{ checkId: "c1", ok: true, message: "ok" }],
};

describe("POST /api/scenarios/[id]/check", () => {
  beforeEach(() => {
    mockGetScenario.mockReset();
    mockEvaluateScenario.mockReset();
  });

  it("returns 404 when scenario does not exist", async () => {
    mockGetScenario.mockResolvedValue(null);
    const request = new Request("http://localhost/api/scenarios/scenario-1/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ json: { value: true } }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "scenario-1" }) });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Not found" });
    expect(mockEvaluateScenario).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid request body", async () => {
    mockGetScenario.mockResolvedValue(scenario);
    const request = new Request("http://localhost/api/scenarios/scenario-1/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ missingJson: true }),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "scenario-1" }) });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid request body" });
    expect(mockEvaluateScenario).not.toHaveBeenCalled();
  });

  it("evaluates submitted json and returns evaluation payload", async () => {
    mockGetScenario.mockResolvedValue(scenario);
    mockEvaluateScenario.mockReturnValue(evaluation);
    const payload = { json: { settings: { enabled: true } } };
    const request = new Request("http://localhost/api/scenarios/scenario-1/check", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request, { params: Promise.resolve({ id: "scenario-1" }) });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mockEvaluateScenario).toHaveBeenCalledWith(scenario, payload.json);
    expect(body).toEqual({ evaluation });
  });
});
