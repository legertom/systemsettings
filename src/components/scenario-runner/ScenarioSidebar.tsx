import type { Scenario, ScenarioEvaluation } from "@/lib/types";

type Props = {
  scenario: Scenario;
  evaluation: ScenarioEvaluation | null;
  progressLabel: string | null;
  onReset: () => void;
  onStartTutorial: () => void;
};

export function ScenarioSidebar({
  scenario,
  evaluation,
  progressLabel,
  onReset,
  onStartTutorial,
}: Props) {
  return (
    <section data-tutorial="sidebar" className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">{scenario.title}</div>
      {scenario.description ? (
        <div className="mt-2 text-sm text-muted-foreground">{scenario.description}</div>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
          Instructions
        </div>
        <button
          type="button"
          onClick={onStartTutorial}
          className="ml-auto rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium hover:bg-muted"
        >
          Start Tutorial
        </button>
      </div>
      <div data-tutorial="instructions">
        <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm">
          {scenario.instructions.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>

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

      <div data-tutorial="feedback" className="mt-4 rounded-md border border-border bg-muted p-3">
        <div className="text-sm font-semibold">
          {evaluation ? (evaluation.ok ? "All set" : "Keep going") : "Feedback and hints"}
        </div>
        {evaluation ? (
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
        ) : (
          <div className="mt-2 text-sm text-muted-foreground">
            Click <span className="font-medium text-foreground">Save System Settings</span> to see
            progress updates and hints.
          </div>
        )}
      </div>
    </section>
  );
}
