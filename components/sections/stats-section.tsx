interface Stat {
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="border-y border-border py-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-y-10 px-8">
        {stats.map((s) => (
          <div key={s.label} className="min-w-[120px]">
            <p className="font-mono text-4xl font-light tracking-tight text-primary md:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-xs tracking-wide text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
