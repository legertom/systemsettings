import { notFound } from "next/navigation";
import { getScenario } from "@/lib/scenarioStore";
import { ScenarioRunner } from "@/components/ScenarioRunner";

export default async function ScenarioPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const scenario = await getScenario(id);
  if (!scenario) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <ScenarioRunner scenario={scenario} />
    </main>
  );
}

