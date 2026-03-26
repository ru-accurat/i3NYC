"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { setByPath } from "@/lib/path-utils";

interface EditorContextValue {
  isEditing: boolean;
  isSaving: boolean;
  updateField: (fieldKey: string, value: string) => void;
  startEditing: (slug: string, data: Record<string, unknown>) => void;
  save: () => Promise<void>;
  cancel: () => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const slugRef = useRef("");
  const originalRef = useRef<Record<string, unknown>>({});
  const changesRef = useRef<Map<string, string>>(new Map());

  const startEditing = useCallback((slug: string, data: Record<string, unknown>) => {
    slugRef.current = slug;
    originalRef.current = data;
    changesRef.current = new Map();
    setIsEditing(true);
  }, []);

  const updateField = useCallback((fieldKey: string, value: string) => {
    changesRef.current.set(fieldKey, value);
  }, []);

  const save = useCallback(async () => {
    if (changesRef.current.size === 0) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      // Deep clone original and apply changes
      const merged = JSON.parse(JSON.stringify(originalRef.current));
      for (const [key, value] of changesRef.current) {
        setByPath(merged, key, value);
      }
      const res = await fetch(`/api/content/${slugRef.current}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      if (!res.ok) throw new Error("Save failed");
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const cancel = useCallback(() => {
    changesRef.current = new Map();
    setIsEditing(false);
    // Reload to reset any contentEditable DOM changes
    window.location.reload();
  }, []);

  return (
    <EditorContext value={{ isEditing, isSaving, updateField, startEditing, save, cancel }}>
      {children}
    </EditorContext>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
