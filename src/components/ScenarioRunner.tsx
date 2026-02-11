"use client";

import { useState } from "react";
import type { Scenario } from "@/lib/types";
import { ScenarioSidebar } from "@/components/scenario-runner/ScenarioSidebar";
import { ScenarioEditorPanel } from "@/components/scenario-runner/ScenarioEditorPanel";
import { SuccessModal } from "@/components/scenario-runner/SuccessModal";
import { ScenarioTutorial } from "@/components/scenario-runner/ScenarioTutorial";
import { useScenarioRunner } from "@/components/scenario-runner/useScenarioRunner";

type Props = {
  scenario: Scenario;
};

export function ScenarioRunner({ scenario }: Props) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [tutorialSession, setTutorialSession] = useState(0);
  const {
    evaluation,
    isChecking,
    showSuccess,
    progressLabel,
    editorHandleRef,
    keepPracticingButtonRef,
    setShowSuccess,
    checkWork,
    reset,
  } = useScenarioRunner(scenario);

  function startTutorial() {
    setShowSuccess(false);
    setTutorialSession((current) => current + 1);
    setIsTutorialOpen(true);
  }

  return (
    <div className="relative grid gap-4 lg:grid-cols-[340px_1fr]">
      <ScenarioSidebar
        scenario={scenario}
        evaluation={evaluation}
        progressLabel={progressLabel}
        onReset={reset}
        onStartTutorial={startTutorial}
      />
      <ScenarioEditorPanel
        initialJson={scenario.initialJson}
        editorRef={editorHandleRef}
        isChecking={isChecking}
        onCheckWork={checkWork}
      />
      <SuccessModal
        show={showSuccess}
        evaluation={evaluation}
        onClose={() => setShowSuccess(false)}
        onReset={reset}
        keepPracticingButtonRef={keepPracticingButtonRef}
      />
      <ScenarioTutorial
        key={tutorialSession}
        open={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
