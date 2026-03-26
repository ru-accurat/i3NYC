"use client";

import { Separator } from "@/components/ui/separator";
import { EditableText } from "@/components/editor/editable-text";

interface Event {
  title: string;
  venue: string;
  date: string;
  detail: string;
}

interface EventListProps {
  label?: string;
  title: string;
  events: Event[];
  fieldPrefix?: string;
}

export function EventList({ label, title, events, fieldPrefix }: EventListProps) {
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
        <div className="mt-16 space-y-0">
          {events.map((e, idx) => (
            <div key={idx}>
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-2 py-7 md:grid-cols-[200px_1fr_1fr]">
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.date`} value={e.date} as="span" className="text-sm text-muted-foreground" />
                ) : (
                  <span className="text-sm text-muted-foreground">{e.date}</span>
                )}
                <div>
                  {fieldPrefix ? (
                    <EditableText fieldKey={`${fieldPrefix}.items.${idx}.title`} value={e.title} as="h3" className="text-base font-medium" />
                  ) : (
                    <h3 className="text-base font-medium">{e.title}</h3>
                  )}
                  {fieldPrefix ? (
                    <EditableText fieldKey={`${fieldPrefix}.items.${idx}.venue`} value={e.venue} as="p" className="mt-0.5 text-sm text-muted-foreground" />
                  ) : (
                    <p className="mt-0.5 text-sm text-muted-foreground">{e.venue}</p>
                  )}
                </div>
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.detail`} value={e.detail} as="p" className="text-sm leading-relaxed text-muted-foreground md:text-right" />
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-right">{e.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
