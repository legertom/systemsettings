import type { RefObject } from "react";
import type { JsonValue } from "@/lib/types";
import { JsonEditor, type JsonEditorHandle } from "@/components/json/JsonEditor";

type Props = {
  initialJson: JsonValue;
  editorRef: RefObject<JsonEditorHandle | null>;
  isChecking: boolean;
  onCheckWork: () => void;
};

export function ScenarioEditorPanel({ initialJson, editorRef, isChecking, onCheckWork }: Props) {
  return (
    <section data-tutorial="editor-panel" className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <div className="mb-3 rounded-md bg-sky-50 p-3 text-sm text-sky-950 dark:bg-sky-950/40 dark:text-sky-50">
        Start in <span className="font-semibold">View</span> mode to explore safely. Switch to{" "}
        <span className="font-semibold">Tree</span> to edit.{" "}
        <span className="font-semibold">Text</span> is for viewing formatted or compact JSON.
      </div>

      <JsonEditor ref={editorRef} initialValue={initialJson} readOnlyTextMode />

      <div className="mt-4">
        <button
          type="button"
          onClick={onCheckWork}
          data-tutorial="save-button"
          disabled={isChecking}
          className="w-full rounded-xl bg-red-700 px-6 py-4 text-center text-xl font-semibold text-white shadow-sm hover:bg-red-800 disabled:opacity-60"
        >
          {isChecking ? "Checking…" : "Save System Settings"}
        </button>
      </div>
    </section>
  );
}
