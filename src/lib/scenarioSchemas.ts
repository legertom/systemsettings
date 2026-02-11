import { z } from "zod";
import type { JsonValue, Scenario } from "@/lib/types";

export const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ])
);

export const scenarioCheckSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  hint: z.string().optional(),
  path: z.string().min(1),
  op: z.enum(["equals", "includes", "exists", "typeIs"]),
  expected: jsonValueSchema.optional(),
});

export const scenarioSchema: z.ZodType<Scenario> = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  instructions: z.array(z.string()),
  initialJson: jsonValueSchema,
  checks: z.array(scenarioCheckSchema),
});

