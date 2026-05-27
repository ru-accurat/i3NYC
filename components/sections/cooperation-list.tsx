"use client";

import { Separator } from "@/components/ui/separator";
import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Cooperation {
  name: string;
  description: string;
  contact?: string;
}

interface CooperationListProps {
  label?: string;
  title: string;
  items: Cooperation[];
  fieldPrefix?: string;
}

export function CooperationList({ label, title, items, fieldPrefix }: CooperationListProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 space-y-0">
          {items.map((item, idx) => (
            <div key={idx} className="group relative">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-4 py-10 md:grid-cols-[1fr_2fr] md:gap-12">
                <div>
                  {fieldPrefix ? (
                    <EditableText fieldKey={`${fieldPrefix}.items.${idx}.name`} value={item.name} as="h3" className="text-lg font-medium" />
                  ) : (
                    <h3 className="text-lg font-medium">{item.name}</h3>
                  )}
                  {item.contact !== undefined && (
                    fieldPrefix ? (
                      <EditableText fieldKey={`${fieldPrefix}.items.${idx}.contact`} value={item.contact || ""} as="p" className="mt-2 text-xs tracking-wide text-muted-foreground" />
                    ) : (
                      item.contact && <p className="mt-2 text-xs tracking-wide text-muted-foreground">{item.contact}</p>
                    )
                  )}
                </div>
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.description`} value={item.description} as="p" className="text-base leading-relaxed text-muted-foreground" multiline />
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add partner" />}
        </div>
      </div>
    </section>
  );
}
