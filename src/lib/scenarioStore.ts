import type { Scenario } from "@/lib/types";
import { seedScenarios } from "@/lib/seedScenarios";
import { connectToDb } from "@/lib/db";
import { ScenarioModel } from "@/lib/models/ScenarioModel";
import { scenarioSchema } from "@/lib/scenarioSchemas";

export type ScenarioSummary = Pick<Scenario, "id" | "title" | "description">;

export async function listScenarios(): Promise<ScenarioSummary[]> {
  const seedSummaries = seedScenarios.map(toSummary);
  if (!process.env.MONGODB_URI) return seedSummaries;

  const dbScenarios = await getDbScenarios();
  const byId = new Map<string, ScenarioSummary>();
  for (const scenario of seedSummaries) byId.set(scenario.id, scenario);
  for (const scenario of dbScenarios.map(toSummary)) byId.set(scenario.id, scenario);
  return Array.from(byId.values());
}

export async function getScenario(id: string): Promise<Scenario | null> {
  const seedScenario = seedScenarios.find((scenario) => scenario.id === id) ?? null;
  if (!process.env.MONGODB_URI) return seedScenario;

  await connectToDb();
  const doc: unknown = await ScenarioModel.findOne({ id }).lean().exec();
  if (!doc) return seedScenario;

  const parsed = scenarioSchema.safeParse(doc);
  if (!parsed.success) {
    console.warn(
      `[scenarioStore] Ignoring invalid DB scenario "${id}": ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    );
    return seedScenario;
  }

  return parsed.data;
}

async function getDbScenarios(): Promise<Scenario[]> {
  await connectToDb();
  const docs: unknown[] = await ScenarioModel.find({}).lean().exec();

  const scenarios: Scenario[] = [];
  for (const doc of docs) {
    const parsed = scenarioSchema.safeParse(doc);
    if (parsed.success) {
      scenarios.push(parsed.data);
      continue;
    }
    const id =
      doc && typeof doc === "object" && "id" in doc ? String((doc as { id?: unknown }).id) : "unknown";
    console.warn(
      `[scenarioStore] Ignoring invalid DB scenario "${id}": ${parsed.error.issues
        .map((issue) => issue.path.join("."))
        .join(", ")}`
    );
  }

  return scenarios;
}

function toSummary(scenario: Scenario): ScenarioSummary {
  return {
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
  };
}
