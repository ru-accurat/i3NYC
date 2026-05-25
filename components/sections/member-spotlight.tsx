"use client";

import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface SpotlightMember {
  name: string;
  role: string;
  initials: string;
  quote?: string;
}

interface MemberSpotlightProps {
  label?: string;
  title: string;
  description?: string;
  items: SpotlightMember[];
  fieldPrefix?: string;
}

export function MemberSpotlight({ label, title, description, items, fieldPrefix }: MemberSpotlightProps) {
  const hasItems = items && items.length > 0;

  return (
    <section className="border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-sm tracking-wide text-primary" />
          ) : (
            <p className="text-sm tracking-wide text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        {description && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.description`} value={description} as="p" className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground" multiline />
          ) : (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
          )
        )}

        {hasItems ? (
          <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m, idx) => (
              <div key={idx} className="group relative">
                {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-xl font-light text-primary">
                  {m.initials}
                </div>
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.name`} value={m.name} as="h3" className="mt-5 text-base font-medium" />
                ) : (
                  <h3 className="mt-5 text-base font-medium">{m.name}</h3>
                )}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.role`} value={m.role} as="p" className="mt-1 text-sm text-muted-foreground" />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
                )}
                {m.quote !== undefined && (
                  fieldPrefix ? (
                    <EditableText fieldKey={`${fieldPrefix}.items.${idx}.quote`} value={m.quote || ""} as="p" className="mt-4 text-sm italic leading-relaxed text-muted-foreground" multiline />
                  ) : (
                    m.quote && <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">&ldquo;{m.quote}&rdquo;</p>
                  )
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl border border-dashed border-border px-8 py-16 text-center">
            <p className="text-sm tracking-wide text-muted-foreground">
              Member spotlights coming soon.
            </p>
          </div>
        )}

        {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add member" />}
      </div>
    </section>
  );
}
