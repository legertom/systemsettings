"use client";

import type { Scenario } from "@/lib/types";
import { ScenarioSidebar } from "@/components/scenario-runner/ScenarioSidebar";
import { ScenarioEditorPanel } from "@/components/scenario-runner/ScenarioEditorPanel";
import { SuccessModal } from "@/components/scenario-runner/SuccessModal";
import { useScenarioRunner } from "@/components/scenario-runner/useScenarioRunner";

type Props = {
  scenario: Scenario;
};

export function ScenarioRunner({ scenario }: Props) {
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

  return (
    <div className="relative grid gap-4 lg:grid-cols-[340px_1fr]">
      <ScenarioSidebar
        scenario={scenario}
        evaluation={evaluation}
        progressLabel={progressLabel}
        onReset={reset}
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
    </div>
  );
}
