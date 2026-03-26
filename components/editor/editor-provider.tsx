"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface EditorState {
  isEditing: boolean;
  isSaving: boolean;
  slug: string;
  rawContent: string;
  startEditing: (slug: string, raw: string) => void;
  save: (raw: string) => Promise<void>;
  cancel: () => void;
}

const EditorContext = createContext<EditorState | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [rawContent, setRawContent] = useState("");

  const startEditing = useCallback((slug: string, raw: string) => {
    setSlug(slug);
    setRawContent(raw);
    setIsEditing(true);
  }, []);

  const save = useCallback(
    async (raw: string) => {
      setIsSaving(true);
      try {
        const res = await fetch(`/api/content/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ raw }),
        });
        if (!res.ok) throw new Error("Failed to save");
        setIsEditing(false);
        window.location.reload();
      } finally {
        setIsSaving(false);
      }
    },
    [slug]
  );

  const cancel = useCallback(() => {
    setIsEditing(false);
    setRawContent("");
    setSlug("");
  }, []);

  return (
    <EditorContext.Provider
      value={{ isEditing, isSaving, slug, rawContent, startEditing, save, cancel }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
