"use client";

import { useEditor } from "./editor-provider";
import type { PageSections } from "@/lib/sections";

interface EditButtonProps {
  slug: string;
  pageData: PageSections;
}

export function EditButton({ slug, pageData }: EditButtonProps) {
  const { isEditing, isSaving, startEditing, save, cancel } = useEditor();

  if (!isEditing) {
    return (
      <button
        onClick={() => startEditing(slug, pageData)}
        className="fixed bottom-6 right-6 z-50 flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/80"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2">
      <button
        onClick={cancel}
        disabled={isSaving}
        className="flex h-10 items-center rounded-full border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={save}
        disabled={isSaving}
        className="flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/80 disabled:opacity-50"
      >
        {isSaving ? "Saving\u2026" : "Save"}
      </button>
    </div>
  );
}
