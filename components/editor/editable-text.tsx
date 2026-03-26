"use client";

import { useRef, useCallback, type KeyboardEvent } from "react";
import { useEditor } from "./editor-provider";

interface EditableTextProps {
  fieldKey: string;
  value: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
  multiline?: boolean;
}

export function EditableText({
  fieldKey,
  value,
  as: Tag = "span",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { isEditing, updateField } = useEditor();
  const ref = useRef<HTMLElement>(null);

  const handleInput = useCallback(() => {
    if (ref.current) {
      updateField(fieldKey, ref.current.textContent ?? "");
    }
  }, [fieldKey, updateField]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!multiline && e.key === "Enter") {
        e.preventDefault();
        ref.current?.blur();
      }
    },
    [multiline]
  );

  if (!isEditing) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.RefObject<never>}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`${className} outline-none ring-1 ring-transparent transition-shadow hover:ring-primary/30 focus:ring-primary/60 rounded-sm`}
    >
      {value}
    </Tag>
  );
}
