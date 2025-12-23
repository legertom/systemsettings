import { NextResponse } from "next/server";
import { listScenarios } from "@/lib/scenarioStore";

export async function GET() {
  const scenarios = await listScenarios();
  return NextResponse.json({ scenarios });
}

