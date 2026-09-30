"use client";

import { EditableText } from "@/components/editor/editable-text";
import { MEMBERSHIP_SIGNUP_URL } from "@/lib/nav-links";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Tier {
  name: string;
  price: string;
  note: string;
}

interface MembershipTiersProps {
  label?: string;
  title: string;
  tiers: Tier[];
  fieldPrefix?: string;
}

export function MembershipTiers({ label, title, tiers, fieldPrefix }: MembershipTiersProps) {
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
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, idx) => (
            <div key={idx} className="group relative">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.name`} value={t.name} as="h3" className="text-lg font-medium" />
              ) : (
                <h3 className="text-lg font-medium">{t.name}</h3>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.price`} value={t.price} as="p" className="mt-2 text-3xl font-light tracking-tight text-foreground tabular-nums" />
              ) : (
                <p className="mt-2 text-3xl font-light tracking-tight text-foreground tabular-nums">{t.price}</p>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.note`} value={t.note} as="p" className="mt-3 text-sm leading-relaxed text-muted-foreground" multiline />
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
              )}
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add tier" />}
        </div>
        <div className="mt-14">
          <a
            href={MEMBERSHIP_SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Become Member
          </a>
        </div>
      </div>
    </section>
  );
}
