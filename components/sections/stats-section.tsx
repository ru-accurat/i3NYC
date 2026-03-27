"use client";

import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
  fieldPrefix?: string;
}

export function StatsSection({ stats, fieldPrefix }: StatsSectionProps) {
  // fieldPrefix is "sectionId.items" — extract sectionId for array mutations
  const sectionId = fieldPrefix?.split(".")[0];

  return (
    <section className="border-y border-border py-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-y-10 px-8">
        {stats.map((s, idx) => (
          <div key={idx} className="group relative min-w-[120px]">
            {sectionId && <ArrayItemRemove sectionId={sectionId} arrayPath="items" index={idx} />}
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.${idx}.value`} value={s.value} as="p" className="font-mono text-4xl font-light tracking-tight text-primary md:text-5xl" />
            ) : (
              <p className="font-mono text-4xl font-light tracking-tight text-primary md:text-5xl">{s.value}</p>
            )}
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.${idx}.label`} value={s.label} as="p" className="mt-2 text-xs tracking-wide text-muted-foreground" />
            ) : (
              <p className="mt-2 text-xs tracking-wide text-muted-foreground">{s.label}</p>
            )}
          </div>
        ))}
        {sectionId && <ArrayAddButton sectionId={sectionId} arrayPath="items" label="Add stat" />}
      </div>
    </section>
  );
}
