"use client";

import { useEditor } from "@/components/editor/editor-provider";
import { EditButton } from "@/components/editor/edit-button";
import { InlineEditor } from "@/components/editor/inline-editor";
import { ContentRenderer } from "@/components/content-renderer";

interface EditableContentProps {
  slug: string;
  rawContent: string;
  body: string;
  isAdmin: boolean;
}

export function EditableContent({
  slug,
  rawContent,
  body,
  isAdmin,
}: EditableContentProps) {
  const { isEditing } = useEditor();

  return (
    <>
      {isEditing ? (
        <div className="py-20 px-8">
          <InlineEditor />
        </div>
      ) : (
        body.trim() && (
          <div className="py-20 px-8">
            <ContentRenderer content={body} />
          </div>
        )
      )}
      {isAdmin && <EditButton slug={slug} rawContent={rawContent} />}
    </>
  );
}
