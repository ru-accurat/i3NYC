"use client";

import { Separator } from "@/components/ui/separator";
import { EditableText } from "@/components/editor/editable-text";

interface Initiative {
  title: string;
  description: string;
}

interface InitiativeListProps {
  label?: string;
  title: string;
  initiatives: Initiative[];
  fieldPrefix?: string;
}

export function InitiativeList({ label, title, initiatives, fieldPrefix }: InitiativeListProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-sm tracking-wide text-primary" />
          ) : (
            <p className="text-sm tracking-wide text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 space-y-0">
          {initiatives.map((item, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-12">
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.title`} value={item.title} as="h3" className="text-lg font-medium" />
                ) : (
                  <h3 className="text-lg font-medium">{item.title}</h3>
                )}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.description`} value={item.description} as="p" className="text-base leading-relaxed text-muted-foreground" multiline />
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
