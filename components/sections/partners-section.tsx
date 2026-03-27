"use client";

import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface PartnersSectionProps {
  partners: string[];
  fieldPrefix?: string;
}

export function PartnersSection({ partners, fieldPrefix }: PartnersSectionProps) {
  // fieldPrefix is "sectionId.items" — extract sectionId for array mutations
  const sectionId = fieldPrefix?.split(".")[0];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-8">
        <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
          Partners &amp; Sponsors
        </p>
        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
          {partners.map((p, idx) => (
            <span key={idx} className="group relative">
              {sectionId && <ArrayItemRemove sectionId={sectionId} arrayPath="items" index={idx} />}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.${idx}`} value={p} as="span" className="text-sm text-muted-foreground/50 transition-colors hover:text-foreground" />
              ) : (
                <span className="text-sm text-muted-foreground/50 transition-colors hover:text-foreground">{p}</span>
              )}
            </span>
          ))}
          {sectionId && <ArrayAddButton sectionId={sectionId} arrayPath="items" label="Add partner" />}
        </div>
      </div>
    </section>
  );
}
