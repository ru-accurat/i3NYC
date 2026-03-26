"use client";

import { useEditor } from "./editor-provider";
import { Button } from "@/components/ui/button";

interface EditButtonProps {
  slug: string;
  rawContent: string;
}

export function EditButton({ slug, rawContent }: EditButtonProps) {
  const { isEditing, isSaving, startEditing, save, cancel } = useEditor();

  if (isEditing) {
    return (
      <div className="fixed bottom-8 right-8 z-50 flex gap-3">
        <Button variant="outline" size="sm" onClick={cancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          size="sm"
          disabled={isSaving}
          onClick={() => {
            const editorEl = document.querySelector("[data-editor-content]");
            if (editorEl) {
              const event = new CustomEvent("editor-save");
              editorEl.dispatchEvent(event);
            }
          }}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        size="sm"
        variant="outline"
        onClick={() => startEditing(slug, rawContent)}
        className="gap-2"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
        Edit
      </Button>
    </div>
  );
}
