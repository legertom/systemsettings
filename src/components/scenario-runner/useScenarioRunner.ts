"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { JsonValue, Scenario, ScenarioEvaluation } from "@/lib/types";
import type { JsonEditorHandle } from "@/components/json/JsonEditor";

export function useScenarioRunner(scenario: Scenario) {
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
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setShowSuccess(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showSuccess]);

  function reset() {
    editorHandleRef.current?.setJson(scenario.initialJson);
    setEvaluation(null);
    setShowSuccess(false);
  }

  async function checkWork() {
    setIsChecking(true);
    try {
      const currentJson = getCurrentJson(scenario.initialJson, editorHandleRef.current);
      if (!currentJson) {
        setEvaluation(invalidJsonEvaluation(scenario.checks.length));
        return;
      }

      const response = await fetch(`/api/scenarios/${encodeURIComponent(scenario.id)}/check`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ json: currentJson }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !isScenarioEvaluation(body?.evaluation)) {
        setEvaluation(requestFailedEvaluation(scenario.checks.length));
        return;
      }

      setEvaluation(body.evaluation);
      if (body.evaluation.ok) setShowSuccess(true);
    } finally {
      setIsChecking(false);
    }
  }

  return {
    evaluation,
    isChecking,
    showSuccess,
    progressLabel,
    editorHandleRef,
    keepPracticingButtonRef,
    setShowSuccess,
    checkWork,
    reset,
  };
}

function getCurrentJson(initialJson: JsonValue, editor: JsonEditorHandle | null): JsonValue | null {
  try {
    return editor?.getJson() ?? initialJson;
  } catch {
    return null;
  }
}

function invalidJsonEvaluation(totalChecks: number): ScenarioEvaluation {
  return {
    ok: false,
    passed: 0,
    total: totalChecks,
    results: [
      {
        checkId: "invalid-json",
        ok: false,
        message: "The JSON is invalid. Switch back to Tree mode and fix it.",
      },
    ],
  };
}

function requestFailedEvaluation(totalChecks: number): ScenarioEvaluation {
  return {
    ok: false,
    passed: 0,
    total: totalChecks,
    results: [
      {
        checkId: "request",
        ok: false,
        message: "Couldn’t check your work. Try again.",
      },
    ],
  };
}

function isScenarioEvaluation(value: unknown): value is ScenarioEvaluation {
  if (!value || typeof value !== "object") return false;
  return "ok" in value && "passed" in value && "total" in value && "results" in value;
}

