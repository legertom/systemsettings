import { NextResponse } from "next/server";
import { getScenario } from "@/lib/scenarioStore";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const scenario = await getScenario(id);
  if (!scenario) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ scenario });
}

