"use client";

import { useState } from "react";
import { EditableText } from "@/components/editor/editable-text";
import { useEditor } from "@/components/editor/editor-provider";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

export interface PastEventImage {
  src: string;
  alt: string;
}

export interface PastEvent {
  title: string;
  venue?: string;
  /** Free text ending in a four-digit year, e.g. "Jun 4, 2026" or "Sep 2025". */
  date: string;
  /** Full description; blank lines separate paragraphs. */
  detail: string;
  images?: PastEventImage[];
  links?: { label: string; href: string }[];
}

interface PastEventsProps {
  label?: string;
  title: string;
  description?: string;
  events: PastEvent[];
  fieldPrefix?: string;
}

const KICKER = "text-xs font-medium uppercase tracking-[0.2em] text-primary-text";
/** Descriptions longer than this are clamped behind a "Read more" toggle. */
const LONG = 320;

function yearOf(date: string): string {
  return date.match(/(20\d\d)/)?.[1] ?? "";
}

export function PastEvents({ label, title, description, events, fieldPrefix }: PastEventsProps) {
  // Group consecutive events by year, keeping each event's index for the editor's field keys.
  const groups: { year: string; items: { event: PastEvent; idx: number }[] }[] = [];
  events.forEach((event, idx) => {
    const year = yearOf(event.date);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.items.push({ event, idx });
    else groups.push({ year, items: [{ event, idx }] });
  });

  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label &&
          (fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className={KICKER} />
          ) : (
            <p className={KICKER}>{label}</p>
          ))}
        {fieldPrefix ? (
          <EditableText
            fieldKey={`${fieldPrefix}.title`}
            value={title}
            as="h2"
            className="mt-4 text-3xl font-light tracking-tight md:text-4xl"
          />
        ) : (
          <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        {description &&
          (fieldPrefix ? (
            <EditableText
              fieldKey={`${fieldPrefix}.description`}
              value={description}
              as="p"
              className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
              multiline
            />
          ) : (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
          ))}

        {groups.length > 1 && (
          <nav aria-label="Jump to a year" className="mt-10 flex flex-wrap gap-2">
            {groups.map((group) => (
              <a
                key={group.year || "undated"}
                href={`#events-${group.year || "earlier"}`}
                className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
              >
                {group.year || "Earlier"}
                <span className="ml-2 text-xs tabular-nums text-muted-foreground">{group.items.length}</span>
              </a>
            ))}
          </nav>
        )}

        <div className="mt-12 space-y-16">
          {groups.map((group) => (
            <div key={group.year || "undated"} id={`events-${group.year || "earlier"}`} className="scroll-mt-28">
              <div className="flex items-baseline gap-4 border-b border-border pb-4">
                <h3 className="text-2xl font-light tracking-tight">{group.year || "Earlier"}</h3>
                <span className="text-xs tracking-wide text-muted-foreground">
                  {group.items.length} {group.items.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div>
                {group.items.map(({ event, idx }) => (
                  <PastEventRow key={idx} event={event} idx={idx} fieldPrefix={fieldPrefix} />
                ))}
              </div>
            </div>
          ))}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add event" />}
        </div>
      </div>
    </section>
  );
}

function PastEventRow({ event: e, idx, fieldPrefix }: { event: PastEvent; idx: number; fieldPrefix?: string }) {
  const { isEditing } = useEditor();
  const [open, setOpen] = useState(false);
  const images = e.images ?? [];
  const links = e.links ?? [];
  const long = e.detail.length > LONG;
  const clamp = long && !open && !isEditing;
  const key = (field: string) => `${fieldPrefix}.items.${idx}.${field}`;
  const [lead, ...rest] = images;

  return (
    <div className="group relative border-b border-border/60 py-8">
      {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
      <div className="grid gap-x-10 gap-y-4 md:grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[140px_minmax(0,1fr)_300px]">
        {fieldPrefix ? (
          <EditableText fieldKey={key("date")} value={e.date} as="span" className="text-sm text-muted-foreground" />
        ) : (
          <span className="text-sm text-muted-foreground">{e.date}</span>
        )}

        <div className="min-w-0">
          {fieldPrefix ? (
            <EditableText fieldKey={key("title")} value={e.title} as="h3" className="text-lg font-medium leading-snug" />
          ) : (
            <h3 className="text-lg font-medium leading-snug">{e.title}</h3>
          )}
          {(e.venue || isEditing) &&
            (fieldPrefix ? (
              <EditableText
                fieldKey={key("venue")}
                value={e.venue ?? ""}
                as="p"
                className="mt-1 text-sm text-muted-foreground"
              />
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{e.venue}</p>
            ))}
          {fieldPrefix ? (
            <EditableText
              fieldKey={key("detail")}
              value={e.detail}
              as="p"
              className={`mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-foreground/75 ${clamp ? "line-clamp-3" : ""}`}
              multiline
            />
          ) : (
            <p
              className={`mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-foreground/75 ${clamp ? "line-clamp-3" : ""}`}
            >
              {e.detail}
            </p>
          )}
          {links.length > 0 && (!long || open || isEditing) && (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/85 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
            </p>
          )}
          {long && !isEditing && (
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="mt-3 text-xs tracking-wide text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              {open ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {lead && (
          <div className="md:col-start-2 lg:col-start-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lead.src}
              alt={lead.alt}
              loading="lazy"
              className="aspect-[3/2] w-full max-w-md rounded-xl border border-border object-cover lg:max-w-none"
            />
            {rest.length > 0 && (
              <div className="mt-2 grid max-w-md grid-cols-2 gap-2 lg:max-w-none">
                {rest.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-[3/2] w-full rounded-lg border border-border object-cover"
                  />
                ))}
              </div>
            )}
            {fieldPrefix && isEditing && (
              <div className="mt-2 space-y-1">
                {images.map((img, i) => (
                  <EditableText
                    key={i}
                    fieldKey={key(`images.${i}.src`)}
                    value={img.src}
                    as="p"
                    className="text-xs tracking-wide text-muted-foreground/70"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
