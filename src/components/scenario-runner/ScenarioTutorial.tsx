"use client";

import { useEffect, useState } from "react";
import { tutorialSteps } from "@/components/scenario-runner/tutorialSteps";
import { useTutorialStepCompletion } from "@/components/scenario-runner/useTutorialStepCompletion";
import {
  TutorialDialog,
  TutorialSpotlight,
} from "@/components/scenario-runner/ScenarioTutorialOverlay";
import {
  resolveTutorialTarget,
  toSpotlightRect,
  type SpotlightRect,
} from "@/components/scenario-runner/tutorialTargeting";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ScenarioTutorial({ open, onClose }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const step = tutorialSteps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === tutorialSteps.length - 1;
  const { isStepComplete } = useTutorialStepCompletion({ open, step, stepIndex });

  useEffect(() => {
    if (!open) return;
    resolveTutorialTarget(step.target)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [open, step.target]);

  useEffect(() => {
    if (!open) return;

    const update = () => setSpotlightRect(toSpotlightRect(resolveTutorialTarget(step.target)));
    const rafId = window.requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, step.target]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") return onClose();
      if (isTyping(event.target)) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setStepIndex((current) => Math.max(0, current - 1));
      }
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        if (!isStepComplete) return;
        if (isLast) return onClose();
        setStepIndex((current) => Math.min(tutorialSteps.length - 1, current + 1));
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, isLast, isStepComplete, onClose]);

  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {spotlightRect ? <TutorialSpotlight rect={spotlightRect} /> : null}
      <TutorialDialog
        stepIndex={stepIndex}
        totalSteps={tutorialSteps.length}
        title={step.title}
        description={step.description}
        actionText={step.actionText}
        hasSpotlight={Boolean(spotlightRect)}
        isStepComplete={isStepComplete}
        isFirst={isFirst}
        isLast={isLast}
        onBack={() => setStepIndex((current) => Math.max(0, current - 1))}
        onNext={() =>
          !isStepComplete
            ? null
            : isLast
            ? onClose()
            : setStepIndex((current) => Math.min(tutorialSteps.length - 1, current + 1))
        }
        onClose={onClose}
      />
    </div>
  );
}

function isTyping(eventTarget: EventTarget | null): boolean {
  const node = eventTarget as HTMLElement | null;
  return (
    node?.tagName === "INPUT" || node?.tagName === "TEXTAREA" || Boolean(node?.isContentEditable)
  );
}
