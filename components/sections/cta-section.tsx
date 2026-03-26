"use client";

import Link from "next/link";
import { EditableText } from "@/components/editor/editable-text";

interface CTASectionProps {
  title: string;
  titleAccent?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  fieldPrefix?: string;
}

export function CTASection({ title, titleAccent, primaryLabel = "Join I3/NYC", primaryHref = "/contact-us", secondaryLabel, secondaryHref, fieldPrefix }: CTASectionProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="max-w-3xl text-4xl font-light leading-[1.15] tracking-tight md:text-6xl">
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="span" />
          ) : (
            title
          )}
          {titleAccent && (
            <>
              {" "}
              <span className="text-primary">
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.titleAccent`} value={titleAccent} as="span" />
                ) : (
                  titleAccent
                )}
              </span>
            </>
          )}
        </h2>
        <div className="mt-10 flex items-center gap-6">
          <Link href={primaryHref} className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80">
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.primaryLabel`} value={primaryLabel} as="span" />
            ) : (
              primaryLabel
            )}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.secondaryLabel`} value={secondaryLabel} as="span" />
              ) : (
                secondaryLabel
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
