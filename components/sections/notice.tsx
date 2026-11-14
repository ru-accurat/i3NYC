"use client";

import Link from "next/link";
import { EditableText } from "@/components/editor/editable-text";

interface NoticeProps {
  label?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  fieldPrefix?: string;
}

const externalProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

/** A short bordered band for one piece of news, e.g. the next event. */
export function Notice({ label, title, description, ctaLabel, ctaHref, fieldPrefix }: NoticeProps) {
  return (
    <section className="pb-8">
      <div className="mx-auto max-w-6xl px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-border p-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {label &&
              (fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text" />
              ) : (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text">{label}</p>
              ))}
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-3 text-2xl font-light tracking-tight" />
            ) : (
              <h2 className="mt-3 text-2xl font-light tracking-tight">{title}</h2>
            )}
            {description &&
              (fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.description`} value={description} as="p" className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground" multiline />
              ) : (
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
              ))}
          </div>
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              {...externalProps(ctaHref)}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-border px-6 text-sm font-medium tracking-wide text-foreground/85 transition-colors hover:border-foreground hover:text-foreground"
            >
              {fieldPrefix ? <EditableText fieldKey={`${fieldPrefix}.ctaLabel`} value={ctaLabel} as="span" /> : ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
