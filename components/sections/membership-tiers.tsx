"use client";

import Link from "next/link";
import { EditableText } from "@/components/editor/editable-text";
import { useEditor } from "@/components/editor/editor-provider";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface Tier {
  name: string;
  price: string;
  note: string;
  /** The tier's own action. A tier without both fields shows no button. */
  ctaLabel?: string;
  ctaHref?: string;
}

interface MembershipTiersProps {
  label?: string;
  title: string;
  tiers: Tier[];
  fieldPrefix?: string;
}

const BUTTON = "inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-medium tracking-wide whitespace-nowrap transition-colors";
/** Signup links (external) get the filled button; enquiries get the outline one. */
const buttonClass = (href: string) =>
  href.startsWith("http")
    ? `${BUTTON} bg-primary text-primary-foreground hover:bg-primary/80`
    : `${BUTTON} border border-border text-foreground/85 hover:border-foreground hover:text-foreground`;
const externalProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function MembershipTiers({ label, title, tiers, fieldPrefix }: MembershipTiersProps) {
  const { isEditing } = useEditor();
  return (
    <section className="border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t, idx) => (
            <div key={idx} className="group relative flex flex-col rounded-2xl border border-border p-8">
              {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.name`} value={t.name} as="h3" className="text-lg font-medium leading-snug" />
              ) : (
                <h3 className="text-lg font-medium leading-snug">{t.name}</h3>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.price`} value={t.price} as="p" className="mt-3 text-3xl font-light tracking-tight text-foreground tabular-nums" />
              ) : (
                <p className="mt-3 text-3xl font-light tracking-tight text-foreground tabular-nums">{t.price}</p>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.items.${idx}.note`} value={t.note} as="p" className="mt-4 text-sm leading-relaxed text-muted-foreground" multiline />
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
              )}
              {t.ctaLabel && t.ctaHref && (
                <div className="mt-auto pt-8">
                  <Link href={t.ctaHref} {...externalProps(t.ctaHref)} className={buttonClass(t.ctaHref)}>
                    {fieldPrefix ? (
                      <EditableText fieldKey={`${fieldPrefix}.items.${idx}.ctaLabel`} value={t.ctaLabel} as="span" />
                    ) : (
                      t.ctaLabel
                    )}
                  </Link>
                  {/* Destination is editable only while editing, never shown to visitors. */}
                  {fieldPrefix && isEditing && (
                    <EditableText
                      fieldKey={`${fieldPrefix}.items.${idx}.ctaHref`}
                      value={t.ctaHref}
                      as="p"
                      className="mt-2 truncate text-xs tracking-wide text-muted-foreground/70"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add tier" />}
        </div>
      </div>
    </section>
  );
}
