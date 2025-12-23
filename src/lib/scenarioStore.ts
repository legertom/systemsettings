import type { Scenario } from "@/lib/types";
import { seedScenarios } from "@/lib/seedScenarios";
import { connectToDb } from "@/lib/db";
import { ScenarioModel } from "@/lib/models/ScenarioModel";

export type ScenarioSummary = Pick<Scenario, "id" | "title" | "description">;

export async function listScenarios(): Promise<ScenarioSummary[]> {
  const scenarios = await getAllScenarios();
  return scenarios.map(({ id, title, description }) => ({ id, title, description }));
}

export async function getScenario(id: string): Promise<Scenario | null> {
  const scenarios = await getAllScenarios();
  return scenarios.find((s) => s.id === id) ?? null;
}

async function getAllScenarios(): Promise<Scenario[]> {
  // Demo-first: seed scenarios committed in the repo.
  // If MONGODB_URI is set, also load scenarios from MongoDB (merged by id, DB wins).
  const scenarios: Scenario[] = [...seedScenarios];

  if (process.env.MONGODB_URI) {
    await connectToDb();
    const docs = await ScenarioModel.find({}).lean();
    const fromDb = docs.map((d: any) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      instructions: d.instructions,
      initialJson: d.initialJson,
      checks: d.checks,
    })) as Scenario[];

    const byId = new Map<string, Scenario>();
    for (const s of scenarios) byId.set(s.id, s);
    for (const s of fromDb) byId.set(s.id, s);
    return Array.from(byId.values());
  }

  return scenarios;
}
