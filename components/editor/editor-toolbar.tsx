"use client";

import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const btn = (
    label: string,
    action: () => void,
    isActive?: boolean
  ) => (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className="h-8 px-2 text-xs"
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
    >
      {label}
    </Button>
  );

  return (
    <div className="sticky top-20 z-40 flex flex-wrap items-center gap-0.5 rounded-lg border border-border bg-card p-1.5">
      {btn("B", () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
      {btn("I", () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
      {btn("S", () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
      {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
      {btn("H3", () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      {btn("UL", () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
      {btn("OL", () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
      {btn("Quote", () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
      <Separator orientation="vertical" className="mx-1 h-5" />
      {btn("Link", () => {
        const url = window.prompt("URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }, editor.isActive("link"))}
      {btn("Code", () => editor.chain().focus().toggleCode().run(), editor.isActive("code"))}
      {btn("HR", () => editor.chain().focus().setHorizontalRule().run())}
    </div>
  );
}
