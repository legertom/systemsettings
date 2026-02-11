import type { Scenario, ScenarioEvaluation } from "@/lib/types";

type Props = {
  scenario: Scenario;
  evaluation: ScenarioEvaluation | null;
  progressLabel: string | null;
  onReset: () => void;
};

export function ScenarioSidebar({ scenario, evaluation, progressLabel, onReset }: Props) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">{scenario.title}</div>
      {scenario.description ? (
        <div className="mt-2 text-sm text-muted-foreground">{scenario.description}</div>
      ) : null}

      <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-600">
        Instructions
      </div>
      <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm">
        {scenario.instructions.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          Reset
        </button>
        <div className="ml-auto text-sm text-muted-foreground">
          {progressLabel ? <span>Progress: {progressLabel}</span> : <span>Progress: —</span>}
        </div>
      </div>

      {evaluation ? (
        <div className="mt-4 rounded-md border border-border bg-muted p-3">
          <div className="text-sm font-semibold">{evaluation.ok ? "All set" : "Keep going"}</div>
          <ul className="mt-2 space-y-2 text-sm">
            {evaluation.results.map((result) => (
              <li key={result.checkId} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 inline-block h-4 w-4 rounded-full ${
                    result.ok ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  aria-hidden="true"
                />
                <span className={result.ok ? "text-foreground" : "text-muted-foreground"}>
                  {result.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

