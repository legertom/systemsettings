"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { TutorialStep } from "@/components/scenario-runner/tutorialSteps";
import { resolveTutorialTarget } from "@/components/scenario-runner/tutorialTargeting";

type Params = {
  open: boolean;
  step: TutorialStep;
  stepIndex: number;
};

export function useTutorialStepCompletion({ open, step, stepIndex }: Params) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const isStepComplete = useMemo(() => Boolean(completedSteps[stepIndex]), [completedSteps, stepIndex]);

  useEffect(() => {
    if (!open || isStepComplete) return;

    function onClick(event: MouseEvent) {
      if (step.requirement !== "click-target") return;
      if (!isWithinTarget(event.target, step.target)) return;
      markStepComplete(stepIndex, setCompletedSteps);
    }

    function onFocusIn(event: FocusEvent) {
      if (step.requirement !== "focus-target") return;
      if (!isWithinTarget(event.target, step.target)) return;
      markStepComplete(stepIndex, setCompletedSteps);
    }

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn, true);
    };
  }, [open, step, stepIndex, isStepComplete]);

  return {
    isStepComplete,
  };
}

function isWithinTarget(eventTarget: EventTarget | null, targetId: TutorialStep["target"]) {
  const targetElement = resolveTutorialTarget(targetId);
  const node = eventTarget as Node | null;
  if (!targetElement || !node) return false;
  return targetElement === node || targetElement.contains(node);
}

function markStepComplete(
  stepIndex: number,
  setCompletedSteps: Dispatch<SetStateAction<Record<number, boolean>>>
) {
  setCompletedSteps((current) => {
    if (current[stepIndex]) return current;
    return { ...current, [stepIndex]: true };
  });
}
