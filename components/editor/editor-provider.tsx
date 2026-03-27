"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { setByPath } from "@/lib/path-utils";
import type { Section, PageSections } from "@/lib/sections";
import { generateBlockId, BLOCK_REGISTRY } from "@/lib/block-registry";

interface EditorContextValue {
  isEditing: boolean;
  isSaving: boolean;
  /** Update a text field. fieldKey is "sectionId.path.to.field" */
  updateField: (fieldKey: string, value: string) => void;
  startEditing: (slug: string, data: PageSections) => void;
  save: () => Promise<void>;
  cancel: () => void;
  /** Section management */
  addSection: (type: string, afterIndex: number) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  /** Array item management */
  addArrayItem: (sectionId: string, arrayPath: string) => void;
  removeArrayItem: (sectionId: string, arrayPath: string, index: number) => void;
  /** Live sections state (for re-rendering after structural changes) */
  sections: Section[];
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const slugRef = useRef("");
  const changesRef = useRef<Map<string, string>>(new Map());

  const startEditing = useCallback((slug: string, data: PageSections) => {
    slugRef.current = slug;
    setSections(JSON.parse(JSON.stringify(data.sections)));
    changesRef.current = new Map();
    setIsEditing(true);
  }, []);

  const updateField = useCallback((fieldKey: string, value: string) => {
    changesRef.current.set(fieldKey, value);
  }, []);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      // Apply text field changes to the live sections
      const merged: Section[] = JSON.parse(JSON.stringify(sections));
      for (const [key, value] of changesRef.current) {
        // key format: "sectionId.data.field.path"
        const dotIdx = key.indexOf(".");
        if (dotIdx === -1) continue;
        const sectionId = key.slice(0, dotIdx);
        const fieldPath = key.slice(dotIdx + 1);
        const section = merged.find((s) => s.id === sectionId);
        if (section) {
          setByPath(section.data as Record<string, unknown>, fieldPath, value);
        }
      }

      const payload: PageSections = { sections: merged };
      const res = await fetch(`/api/content/${slugRef.current}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
  }, [sections]);

  const cancel = useCallback(() => {
    changesRef.current = new Map();
    setIsEditing(false);
    window.location.reload();
  }, []);

  /* ─── Section management ─── */

  const addSection = useCallback((type: string, afterIndex: number) => {
    const def = BLOCK_REGISTRY[type];
    if (!def) return;
    const newSection: Section = {
      id: generateBlockId(),
      type,
      data: JSON.parse(JSON.stringify(def.defaults)),
    };
    setSections((prev) => {
      const next = [...prev];
      next.splice(afterIndex + 1, 0, newSection);
      return next;
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }, []);

  const moveSection = useCallback((sectionId: string, direction: "up" | "down") => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  /* ─── Array item management ─── */

  const addArrayItem = useCallback((sectionId: string, arrayPath: string) => {
    setSections((prev) => {
      const next: Section[] = JSON.parse(JSON.stringify(prev));
      const section = next.find((s) => s.id === sectionId);
      if (!section) return prev;

      const def = BLOCK_REGISTRY[section.type];
      const itemDefault = def?.itemDefaults?.[arrayPath];

      const arr = section.data[arrayPath];
      if (!Array.isArray(arr)) return prev;

      if (typeof arr[0] === "string") {
        // String array (partners)
        arr.push(itemDefault?._value ?? "New Item");
      } else {
        // Object array
        arr.push(itemDefault ? JSON.parse(JSON.stringify(itemDefault)) : {});
      }
      return next;
    });
  }, []);

  const removeArrayItem = useCallback((sectionId: string, arrayPath: string, index: number) => {
    setSections((prev) => {
      const next: Section[] = JSON.parse(JSON.stringify(prev));
      const section = next.find((s) => s.id === sectionId);
      if (!section) return prev;
      const arr = section.data[arrayPath];
      if (!Array.isArray(arr) || arr.length <= 1) return prev; // keep at least 1
      arr.splice(index, 1);
      return next;
    });
  }, []);

  return (
    <EditorContext
      value={{
        isEditing, isSaving, updateField, startEditing, save, cancel,
        addSection, removeSection, moveSection,
        addArrayItem, removeArrayItem,
        sections,
      }}
    >
      {children}
    </EditorContext>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
