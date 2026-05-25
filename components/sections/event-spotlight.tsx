"use client";

import { EditableText } from "@/components/editor/editable-text";

interface EventSpotlightProps {
  label?: string;
  title: string;
  eventTitle: string;
  date: string;
  venue: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  fieldPrefix?: string;
}

export function EventSpotlight({
  label,
  title,
  eventTitle,
  date,
  venue,
  description,
  ctaLabel,
  ctaHref,
  fieldPrefix,
}: EventSpotlightProps) {
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
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-12 rounded-2xl border border-primary/40 bg-primary/5 p-10 md:p-14">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-12">
            <div className="flex-1">
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.date`} value={date} as="p" className="text-sm tracking-wide text-primary" />
              ) : (
                <p className="text-sm tracking-wide text-primary">{date}</p>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.eventTitle`} value={eventTitle} as="h3" className="mt-3 text-2xl font-light leading-tight tracking-tight md:text-3xl" />
              ) : (
                <h3 className="mt-3 text-2xl font-light leading-tight tracking-tight md:text-3xl">{eventTitle}</h3>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.venue`} value={venue} as="p" className="mt-2 text-sm text-muted-foreground" />
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">{venue}</p>
              )}
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.description`} value={description} as="p" className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground" multiline />
              ) : (
                <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{description}</p>
              )}
            </div>
            <div className="flex shrink-0 items-end">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
              >
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.ctaLabel`} value={ctaLabel} as="span" />
                ) : (
                  ctaLabel
                )}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
