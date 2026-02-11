export type TutorialTarget =
  | "sidebar"
  | "instructions"
  | "save-button"
  | "feedback"
  | "mode-tree"
  | "mode-text"
  | "mode-view"
  | "expand-all"
  | "collapse-all"
  | "search-input"
  | "settings-node"
  | "array-value";

export type TutorialRequirement = "click-target" | "focus-target";

export type TutorialStep = {
  title: string;
  description: string;
  target: TutorialTarget;
  requirement: TutorialRequirement;
  actionText: string;
};

export const tutorialSteps: TutorialStep[] = [
  {
    title: "Start in the sidebar",
    description:
      "This trainer lets students safely practice district sync settings. The sidebar is where scenario context and progress live.",
    target: "sidebar",
    requirement: "click-target",
    actionText: "Click anywhere in the sidebar panel.",
  },
  {
    title: "Instructions live here",
    description:
      "Each scenario lists the exact task steps in this panel. Keep an eye on these instructions while editing the JSON.",
    target: "instructions",
    requirement: "click-target",
    actionText: "Click the instructions list.",
  },
  {
    title: "Check work with Save System Settings",
    description:
      "Use this button any time to run checks. Students can save repeatedly while they practice.",
    target: "save-button",
    requirement: "click-target",
    actionText: "Click the Save System Settings button once.",
  },
  {
    title: "Feedback and hints",
    description:
      "After a save, this panel shows progress plus hints for failed checks, so students know what to fix next.",
    target: "feedback",
    requirement: "click-target",
    actionText: "Click the feedback and hints panel.",
  },
  {
    title: "Switch to Tree mode",
    description:
      "Tree mode is where students make most edits using JSONEditor controls instead of raw text.",
    target: "mode-tree",
    requirement: "click-target",
    actionText: "Click the Tree mode button.",
  },
  {
    title: "Switch to Text mode",
    description:
      "Text mode helps students read the raw JSON structure. In this trainer it is read-only.",
    target: "mode-text",
    requirement: "click-target",
    actionText: "Click the Text mode button.",
  },
  {
    title: "Switch back to View mode",
    description:
      "View mode is safe for inspection when students should not edit values directly.",
    target: "mode-view",
    requirement: "click-target",
    actionText: "Click the View mode button.",
  },
  {
    title: "Expand the JSON",
    description:
      "Expand all makes it easy to inspect nested structures quickly in large settings documents.",
    target: "expand-all",
    requirement: "click-target",
    actionText: "Click the Expand all control.",
  },
  {
    title: "Collapse the JSON",
    description:
      "Collapse all helps reset navigation so students can start exploring from the top again.",
    target: "collapse-all",
    requirement: "click-target",
    actionText: "Click the Collapse all control.",
  },
  {
    title: "Use search",
    description:
      "Search helps jump to exact keys and values such as exports or Student_number.",
    target: "search-input",
    requirement: "focus-target",
    actionText: "Click into the search input.",
  },
  {
    title: "Start with the settings object",
    description:
      "Most exercises live under settings. An object is a set of named key/value pairs and can contain nested objects.",
    target: "settings-node",
    requirement: "click-target",
    actionText: "Click the settings row in the JSON tree.",
  },
  {
    title: "Objects vs arrays",
    description:
      "Objects use braces with named keys. Arrays use brackets and ordered items, like fields lists students edit in export configs.",
    target: "array-value",
    requirement: "click-target",
    actionText: "Click a JSON array value (shown with square brackets).",
  },
];
