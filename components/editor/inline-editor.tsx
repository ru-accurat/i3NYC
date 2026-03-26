"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditor as useTiptap, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";
import { useEditor } from "./editor-provider";
import { EditorToolbar } from "./editor-toolbar";
import { ImageUpload } from "./image-upload";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export function InlineEditor() {
  const { isEditing, rawContent, save } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert markdown to simple HTML for TipTap
  // We do a basic conversion since TipTap works with HTML
  const markdownToHtml = (md: string) => {
    // Strip frontmatter
    const body = md.replace(/^---[\s\S]*?---\n*/m, "");
    // Basic markdown to HTML
    let html = body
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^---$/gm, "<hr>")
      .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

    // Wrap plain text in <p>
    html = html
      .split("\n\n")
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("<")) return trimmed;
        return `<p>${trimmed}</p>`;
      })
      .join("\n");

    return html;
  };

  const editor = useTiptap({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: markdownToHtml(rawContent),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-1 py-4",
      },
    },
  });

  // Update content when rawContent changes
  useEffect(() => {
    if (editor && rawContent) {
      editor.commands.setContent(markdownToHtml(rawContent));
    }
  }, [rawContent, editor]);

  // Listen for save events from EditButton
  const handleSave = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const markdown = turndown.turndown(html);
    // Preserve original frontmatter
    const frontmatterMatch = rawContent.match(/^---[\s\S]*?---\n*/m);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : "";
    save(frontmatter + markdown);
  }, [editor, rawContent, save]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const listener = () => handleSave();
    el.addEventListener("editor-save", listener);
    return () => el.removeEventListener("editor-save", listener);
  }, [handleSave]);

  if (!isEditing || !editor) return null;

  return (
    <div
      ref={containerRef}
      data-editor-content
      className="mx-auto max-w-3xl rounded-lg border border-primary/20 bg-card p-6"
    >
      <div className="mb-4 flex items-center gap-1">
        <EditorToolbar editor={editor} />
        <ImageUpload editor={editor} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
