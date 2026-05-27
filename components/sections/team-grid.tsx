"use client";

import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  portfolio?: string;
}

interface TeamGridProps {
  label?: string;
  title: string;
  members: TeamMember[];
  fieldPrefix?: string;
}

export function TeamGrid({ label, title, members, fieldPrefix }: TeamGridProps) {
  // Pick 3- or 4-column layout to avoid lone-orphan trailing rows.
  // 4-col produces an orphan only when (members.length % 4 === 1), i.e. 5, 9, 13…
  // In those cases, 3-col is better-balanced (9 → 3+3+3 vs 4+4+1).
  const gridCols =
    members.length > 4 && members.length % 4 === 1
      ? "lg:grid-cols-3"
      : "lg:grid-cols-4";

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
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className={`mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 ${gridCols}`}>
          {members.map((t, idx) => (
            <div key={idx} className="group relative">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="members" index={idx} />}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-xl font-light text-primary">
                {t.initials}
              </div>
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.members.${idx}.name`} value={t.name} as="h3" className="mt-5 text-base font-medium" />
              ) : (
                <h3 className="mt-5 text-base font-medium">{t.name}</h3>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.members.${idx}.role`} value={t.role} as="p" className="mt-1 text-sm text-muted-foreground" />
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
              )}
              {t.portfolio !== undefined && (
                fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.members.${idx}.portfolio`} value={t.portfolio || ""} as="p" className="mt-2 text-xs leading-relaxed tracking-wide text-muted-foreground/70" />
                ) : (
                  t.portfolio && <p className="mt-2 text-xs leading-relaxed tracking-wide text-muted-foreground/70">{t.portfolio}</p>
                )
              )}
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="members" label="Add member" />}
        </div>
      </div>
    </section>
  );
}
