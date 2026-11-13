import Link from "next/link";
import { KPICard } from "@/components/report/kpi-card";

const KICKER = "text-xs font-medium uppercase tracking-[0.2em] text-primary";

interface ResearchHeroProps {
  /** Small label above the title, e.g. "Ecosystem brief" */
  kicker: string;
  title: string;
  /** The one accented phrase, rendered after `title` */
  titleAccent: string;
  lede: React.ReactNode;
  /** Date line, e.g. "Status checked October 10, 2026" */
  asOf: string;
  author?: { name: string; role: string; href: string };
  /** Static headline figures. Pages whose figures react to a lens pass `children` instead. */
  kpis?: { value: string; label: string }[];
  /** Rendered under the byline, in place of or after the static figures. */
  children?: React.ReactNode;
}

export function ResearchHero({ kicker, title, titleAccent, lede, asOf, author, kpis, children }: ResearchHeroProps) {
  return (
    <section className="px-8 pt-16 pb-20">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/reports-insights-media"
          className="text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Reports, Insights &amp; Media
        </Link>
        <p className={`mt-10 ${KICKER}`}>{kicker}</p>
        <h1 className="mt-6 max-w-4xl text-4xl font-light leading-[1.1] tracking-tight text-balance md:text-5xl lg:text-6xl">
          {title} <span className="text-primary">{titleAccent}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground [&_a]:text-foreground/90 [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 [&_a:hover]:text-foreground">
          {lede}
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground/70">
          {asOf}
          {author && (
            <>
              {" · Designed by "}
              <a
                href={author.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
              >
                {author.name}
              </a>
              {`, ${author.role}`}
            </>
          )}
        </p>
        {kpis && <KpiGrid items={kpis} />}
        {children}
      </div>
    </section>
  );
}

/** Headline figures; five or six cards on one row at desktop width. */
export function KpiGrid({ items }: { items: { value: string; label: string }[] }) {
  const cols = items.length >= 6 ? "lg:grid-cols-6" : "lg:grid-cols-5";
  return (
    <div className={`mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 ${cols}`}>
      {items.map((k) => (
        <KPICard key={k.label} value={k.value} label={k.label} />
      ))}
    </div>
  );
}

interface ResearchSectionProps {
  id: string;
  kicker: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}

export function ResearchSection({ id, kicker, title, intro, children }: ResearchSectionProps) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-8">
        <p className={KICKER}>{kicker}</p>
        <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-tight text-balance md:text-4xl">{title}</h2>
        {intro && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Small explanatory line under a chart. */
export function ChartNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

/** Numbered findings, each a headline and a short paragraph. */
export function FindingsGrid({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="border-t border-primary/60 pt-5">
          <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-2 text-lg font-light leading-snug tracking-tight">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground [&_b]:font-medium [&_b]:text-foreground">
            {item.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

/** Cards for "what each program is good for". */
export function CardGrid({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-border p-8">
          <h3 className="text-lg font-light leading-snug tracking-tight">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground [&_b]:font-medium [&_b]:text-foreground">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Caveats({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="max-w-5xl columns-1 gap-x-12 text-sm leading-relaxed text-muted-foreground md:columns-2">
      {items.map((item, i) => (
        <li key={i} className="mb-4 break-inside-avoid border-l border-border pl-4 [&_b]:font-medium [&_b]:text-foreground">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ResearchDisclaimer({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-10">
      <p className="mx-auto max-w-6xl px-8 text-xs leading-relaxed text-muted-foreground/70">{children}</p>
    </div>
  );
}
