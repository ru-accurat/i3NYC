"use client";

import { useEditor } from "./editor-provider";

interface ArrayItemControlsProps {
  sectionId: string;
  arrayPath: string;
  index: number;
}

/** Delete button shown on each array item when editing */
export function ArrayItemRemove({ sectionId, arrayPath, index }: ArrayItemControlsProps) {
  const { isEditing, removeArrayItem } = useEditor();
  if (!isEditing) return null;

  return (
    <button
      onClick={() => removeArrayItem(sectionId, arrayPath, index)}
      className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 transition-opacity group-hover:opacity-100"
      title="Remove item"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 2l6 6M8 2l-6 6" />
      </svg>
    </button>
  );
}

interface ArrayAddButtonProps {
  sectionId: string;
  arrayPath: string;
  label?: string;
}

/** "Add" button shown at the end of an array when editing */
export function ArrayAddButton({ sectionId, arrayPath, label = "Add item" }: ArrayAddButtonProps) {
  const { isEditing, addArrayItem } = useEditor();
  if (!isEditing) return null;

  return (
    <button
      onClick={() => addArrayItem(sectionId, arrayPath)}
      className="flex items-center gap-1.5 rounded-md border border-dashed border-primary/30 px-3 py-2 text-xs text-primary/60 transition-colors hover:border-primary hover:text-primary"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 1v8M1 5h8" />
      </svg>
      {label}
    </button>
  );
}
