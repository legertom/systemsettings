"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { JsonValue, Scenario, ScenarioEvaluation } from "@/lib/types";

import { JsonEditor, type JsonEditorHandle } from "@/components/json/JsonEditor";

type Props = {
  scenario: Scenario;
};

export function ScenarioRunner({ scenario }: Props) {
  const [evaluation, setEvaluation] = useState<ScenarioEvaluation | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const editorHandleRef = useRef<JsonEditorHandle | null>(null);
  const keepPracticingButtonRef = useRef<HTMLButtonElement | null>(null);

  const progressLabel = useMemo(() => {
    if (!evaluation) return null;
    return `${evaluation.passed}/${evaluation.total} complete`;
  }, [evaluation]);

  useEffect(() => {
    if (!showSuccess) return;

    keepPracticingButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSuccess(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showSuccess]);

  async function checkWork() {
    setIsChecking(true);
    try {
      let currentJson: JsonValue = scenario.initialJson;
      try {
        currentJson = editorHandleRef.current?.getJson() ?? scenario.initialJson;
      } catch {
        setEvaluation({
          ok: false,
          passed: 0,
          total: scenario.checks.length,
          results: [
            {
              checkId: "invalid-json",
              ok: false,
              message: "The JSON is invalid. Switch back to Tree mode and fix it.",
            },
          ],
        });
        return;
      }

      const res = await fetch(`/api/scenarios/${encodeURIComponent(scenario.id)}/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: currentJson }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.evaluation) {
        setEvaluation({
          ok: false,
          passed: 0,
          total: scenario.checks.length,
          results: [
            {
              checkId: "request",
              ok: false,
              message: "Couldn’t check your work. Try again.",
            },
          ],
        });
        return;
      }
      setEvaluation(body.evaluation as ScenarioEvaluation);
      if ((body.evaluation as ScenarioEvaluation).ok) setShowSuccess(true);
    } finally {
      setIsChecking(false);
    }
  }

  function reset() {
    editorHandleRef.current?.setJson(scenario.initialJson);
    setEvaluation(null);
    setShowSuccess(false);
  }

  return (
    <div className="relative grid gap-4 lg:grid-cols-[340px_1fr]">
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
            onClick={reset}
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
            <div className="text-sm font-semibold">
              {evaluation.ok ? "All set" : "Keep going"}
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {evaluation.results.map((r) => (
                <li key={r.checkId} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-block h-4 w-4 rounded-full ${
                      r.ok ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      r.ok
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {r.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="mb-3 rounded-md bg-sky-50 p-3 text-sm text-sky-950 dark:bg-sky-950/40 dark:text-sky-50">
          Start in <span className="font-semibold">View</span> mode to explore safely. Switch to{" "}
          <span className="font-semibold">Tree</span> to edit.{" "}
          <span className="font-semibold">Text</span> is for viewing formatted or compact JSON.
        </div>

        <JsonEditor ref={editorHandleRef} initialValue={scenario.initialJson} readOnlyTextMode />

        <div className="mt-4">
          <button
            type="button"
            onClick={checkWork}
            disabled={isChecking}
            className="w-full rounded-xl bg-red-700 px-6 py-4 text-center text-xl font-semibold text-white shadow-sm hover:bg-red-800 disabled:opacity-60"
          >
            {isChecking ? "Checking…" : "Save System Settings"}
          </button>
        </div>
      </section>

      {showSuccess ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuccess(false);
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
                  onClick={() => setShowSuccess(false)}
                  ref={keepPracticingButtonRef}
                  className="rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-muted"
                >
                  Keep practicing
                </button>
                <button
                  type="button"
                  onClick={reset}
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
      ) : null}
    </div>
  );
}
