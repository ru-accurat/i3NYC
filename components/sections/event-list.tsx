import { Separator } from "@/components/ui/separator";

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
}

export function EventList({ label, title, events }: EventListProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
          {title}
        </h2>
        <div className="mt-16 space-y-0">
          {events.map((e, idx) => (
            <div key={e.title}>
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-2 py-7 md:grid-cols-[200px_1fr_1fr]">
                <span className="text-sm text-muted-foreground">{e.date}</span>
                <div>
                  <h3 className="text-base font-medium">{e.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {e.venue}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-right">
                  {e.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
