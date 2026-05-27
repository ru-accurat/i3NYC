"use client";

import { Separator } from "@/components/ui/separator";
import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Pillar {
  title: string;
  description: string;
}

interface StrategicPillarsProps {
  label?: string;
  title: string;
  pillars: Pillar[];
  fieldPrefix?: string;
}

export function StrategicPillars({ label, title, pillars, fieldPrefix }: StrategicPillarsProps) {
  return (
    <section className="border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-3xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 space-y-0">
          {pillars.map((p, idx) => (
            <div key={idx} className="group relative">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-6 py-8 md:grid-cols-[80px_1fr_2fr] md:gap-12">
                <span className="text-3xl font-light text-primary tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.title`} value={p.title} as="h3" className="text-lg font-medium" />
                ) : (
                  <h3 className="text-lg font-medium">{p.title}</h3>
                )}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.description`} value={p.description} as="p" className="text-base leading-relaxed text-muted-foreground" multiline />
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">{p.description}</p>
                )}
              </div>
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add pillar" />}
        </div>
      </div>
    </section>
  );
}
