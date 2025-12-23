"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import JSONEditor from "jsoneditor";
import type { JsonValue } from "@/lib/types";

type Props = {
  initialValue: JsonValue;
  readOnlyTextMode?: boolean;
};

export type JsonEditorHandle = {
  getJson: () => JsonValue;
  setJson: (next: JsonValue) => void;
};

export const JsonEditor = forwardRef<JsonEditorHandle, Props>(function JsonEditor(
  { initialValue, readOnlyTextMode }: Props,
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<JSONEditor | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      getJson: () => {
        const editor = editorRef.current;
        if (!editor) return initialValue;
        return editor.get() as JsonValue;
      },
      setJson: (next: JsonValue) => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.set(next as any);
      },
    }),
    [initialValue]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (editorRef.current) return;

    const editor = new JSONEditor(containerRef.current, {
      mode: "view",
      modes: ["view", "tree", "text"],
      onModeChange: (newMode) => {
        if (!readOnlyTextMode) return;
        if (newMode !== "text") return;
        setTimeout(() => {
          const textarea = containerRef.current?.querySelector("textarea");
          if (textarea) textarea.readOnly = true;
        }, 0);
      },
    });

    editor.set(initialValue as any);
    editorRef.current = editor;

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, [initialValue, readOnlyTextMode]);

  return <div ref={containerRef} className="min-h-[560px]" />;
});
