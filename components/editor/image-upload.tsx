"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface ImageUploadProps {
  editor: Editor;
}

export function ImageUpload({ editor }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return;
    const { url } = await res.json();
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs"
        onClick={() => inputRef.current?.click()}
      >
        Image
      </Button>
    </>
  );
}
