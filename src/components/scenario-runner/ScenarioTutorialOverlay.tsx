import type { SpotlightRect } from "@/components/scenario-runner/tutorialTargeting";

type TutorialDialogProps = {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  actionText: string;
  hasSpotlight: boolean;
  isStepComplete: boolean;
  isFirst: boolean;
  isLast: boolean;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
};

export function TutorialDialog({
  stepIndex,
  totalSteps,
  title,
  description,
  actionText,
  hasSpotlight,
  isStepComplete,
  isFirst,
  isLast,
  onBack,
  onNext,
  onClose,
}: TutorialDialogProps) {
  return (
    <section
      role="region"
      aria-label="Scenario tutorial"
      className="pointer-events-auto absolute bottom-4 left-1/2 z-10 w-[min(640px,calc(100%-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-card p-5 shadow-2xl"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Tutorial {stepIndex + 1}/{totalSteps}
      </div>
      <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-3 rounded-md border border-border bg-muted p-2 text-xs">
        <span className="font-semibold">Try this:</span> {actionText}
      </div>
      {!hasSpotlight ? (
        <p className="mt-2 text-xs text-muted-foreground">
          This control may appear after the editor finishes loading.
        </p>
      ) : null}
      <div className="mt-2 text-xs">
        {isStepComplete ? (
          <span className="font-semibold text-emerald-600 dark:text-emerald-300">Completed</span>
        ) : (
          <span className="text-muted-foreground">Waiting for action</span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isStepComplete}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLast ? "Finish" : "Next"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          Close
        </button>
      </div>
    </section>
  );
}

export function TutorialSpotlight({ rect }: { rect: SpotlightRect }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-xl border-2 border-amber-400 bg-amber-300/10 ring-4 ring-amber-300/40 transition-all duration-300"
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    />
  );
}
