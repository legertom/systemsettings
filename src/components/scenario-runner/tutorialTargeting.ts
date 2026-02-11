import type { TutorialTarget } from "@/components/scenario-runner/tutorialSteps";

export type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const targetResolvers: Record<TutorialTarget, () => HTMLElement | null> = {
  sidebar: () => document.querySelector<HTMLElement>('[data-tutorial="sidebar"]'),
  instructions: () => document.querySelector<HTMLElement>('[data-tutorial="instructions"]'),
  "save-button": () => document.querySelector<HTMLElement>('[data-tutorial="save-button"]'),
  feedback: () => document.querySelector<HTMLElement>('[data-tutorial="feedback"]'),
  "mode-tree": () => findModeButton("tree") ?? queryJsonEditor(".jsoneditor-menu .jsoneditor-modes"),
  "mode-text": () => findModeButton("text") ?? queryJsonEditor(".jsoneditor-menu .jsoneditor-modes"),
  "mode-view": () => findModeButton("view") ?? queryJsonEditor(".jsoneditor-menu .jsoneditor-modes"),
  "expand-all": () =>
    queryJsonEditor(".jsoneditor-menu > button.jsoneditor-expand-all") ?? findJsonEditorRoot(),
  "collapse-all": () =>
    queryJsonEditor(".jsoneditor-menu > button.jsoneditor-collapse-all") ?? findJsonEditorRoot(),
  "search-input": () => queryJsonEditor(".jsoneditor-search input") ?? findJsonEditorRoot(),
  "settings-node": () => findJsonRowByField("settings") ?? findJsonEditorRoot(),
  "array-value": () => findJsonArrayRow() ?? findJsonEditorRoot(),
};

export function resolveTutorialTarget(target: TutorialTarget): HTMLElement | null {
  return targetResolvers[target]();
}

export function toSpotlightRect(target: HTMLElement | null): SpotlightRect | null {
  if (!target) return null;
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const padding = 8;
  const top = Math.max(8, rect.top - padding);
  const left = Math.max(8, rect.left - padding);
  const right = Math.min(window.innerWidth - 8, rect.right + padding);
  const bottom = Math.min(window.innerHeight - 8, rect.bottom + padding);

  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

function findJsonEditorRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-tutorial="json-editor"]');
}

function queryJsonEditor(selector: string): HTMLElement | null {
  return findJsonEditorRoot()?.querySelector<HTMLElement>(selector) ?? null;
}

function findModeButton(modeLabel: string): HTMLElement | null {
  const root = findJsonEditorRoot();
  if (!root) return null;

  const modeButtons = root.querySelectorAll<HTMLElement>(".jsoneditor-menu .jsoneditor-modes > button");
  for (const button of modeButtons) {
    if (button.textContent?.trim().toLowerCase() !== modeLabel) continue;
    return button;
  }
  return null;
}

function findJsonRowByField(fieldName: string): HTMLElement | null {
  const root = findJsonEditorRoot();
  if (!root) return null;

  const fields = root.querySelectorAll<HTMLElement>("div.jsoneditor-field");
  for (const field of fields) {
    if (field.textContent?.trim() !== fieldName) continue;
    return (field.closest("tr") as HTMLElement | null) ?? field;
  }
  return null;
}

function findJsonArrayRow(): HTMLElement | null {
  const arrayValue = queryJsonEditor("div.jsoneditor-value.jsoneditor-array");
  if (!arrayValue) return null;
  return (arrayValue.closest("tr") as HTMLElement | null) ?? arrayValue;
}
