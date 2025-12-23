"use client";

import { useMemo, useRef, useState } from "react";
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

  const progressLabel = useMemo(() => {
    if (!evaluation) return null;
    return `${evaluation.passed}/${evaluation.total} complete`;
  }, [evaluation]);

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
      <section className="rounded-lg border border-zinc-200 bg-white p-4">
        <div className="text-sm font-semibold">{scenario.title}</div>
        {scenario.description ? (
          <div className="mt-2 text-sm text-zinc-600">{scenario.description}</div>
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
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:border-zinc-300"
          >
            Reset
          </button>
          <div className="ml-auto text-sm text-zinc-600">
            {progressLabel ? <span>Progress: {progressLabel}</span> : <span>Progress: —</span>}
          </div>
        </div>

        {evaluation ? (
          <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <div className="text-sm font-semibold">
              {evaluation.ok ? "All set" : "Keep going"}
            </div>
            <ul className="mt-2 space-y-2 text-sm">
              {evaluation.results.map((r) => (
                <li key={r.checkId} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-block h-4 w-4 rounded-full ${
                      r.ok ? "bg-emerald-500" : "bg-zinc-300"
                    }`}
                    aria-hidden="true"
                  />
                  <span className={r.ok ? "text-zinc-900" : "text-zinc-700"}>{r.message}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-3">
        <div className="mb-3 rounded-md bg-sky-50 p-3 text-sm text-sky-950">
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
            className="w-full rounded-lg bg-red-700 px-6 py-4 text-center text-xl font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {isChecking ? "Checking…" : "Save System Settings"}
          </button>
        </div>
      </section>

      {showSuccess ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="text-lg font-semibold">Success</div>
            <div className="mt-2 text-sm text-zinc-600">
              Nice work. You can keep experimenting—nothing here affects a real customer.
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:border-zinc-300"
              >
                Keep practicing
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm hover:border-zinc-300"
              >
                Reset scenario
              </button>
              <a
                href="/"
                className="ml-auto rounded-md bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-zinc-800"
              >
                Back to scenarios
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
