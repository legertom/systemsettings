import { NextResponse } from "next/server";
import { z } from "zod";
import { getScenario } from "@/lib/scenarioStore";
import { evaluateScenario } from "@/lib/evaluateScenario";

const bodySchema = z.object({
  json: z.unknown(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const scenario = await getScenario(id);
  if (!scenario) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsedBody = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const evaluation = evaluateScenario(scenario, parsedBody.data.json as any);
  return NextResponse.json({ evaluation });
}

