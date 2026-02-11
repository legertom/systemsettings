import type { RefObject } from "react";
import Link from "next/link";
import type { ScenarioEvaluation } from "@/lib/types";

type Props = {
  show: boolean;
  evaluation: ScenarioEvaluation | null;
  onClose: () => void;
  onReset: () => void;
  keepPracticingButtonRef: RefObject<HTMLButtonElement | null>;
};

export function SuccessModal({
  show,
  evaluation,
  onClose,
  onReset,
  keepPracticingButtonRef,
}: Props) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        <div
          className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-fuchsia-500 via-amber-400 to-emerald-500"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-emerald-500/20 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-2xl"
          aria-hidden="true"
        />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-600/15 motion-safe:animate-[bounce_0.9s_ease-in-out_1]">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <div>
              <div className="text-xl font-semibold">Woohoo! All checks passed.</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Nice work—your settings look great. This is a sandbox, so feel free to keep
                experimenting.
              </div>
              {evaluation ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-200">
                  <span aria-hidden="true">✅</span>
                  <span>
                    {evaluation.passed}/{evaluation.total} checks passed
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClose}
              ref={keepPracticingButtonRef}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
            >
              Keep practicing
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
            >
              Reset scenario
            </button>
            <Link
              href="/"
              className="ml-auto rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Back to scenarios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
