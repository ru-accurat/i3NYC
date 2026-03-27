import Link from "next/link";

const REPORTS = [
  {
    title: "Innovation & Tech Report",
    date: "March 2026",
    description: "A data-driven analysis of 1,473 Italian and Italian-American innovation and technology professionals across the TriState area.",
    href: "/reports/innovation-tech-march-2026",
  },
];

export default function ReportsPage() {
  return (
    <main>
      <section className="flex min-h-[50vh] flex-col items-start justify-center px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm tracking-wide text-primary">Research</p>
          <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Reports &{" "}
            <span className="text-primary">Insights.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            Data-driven analysis from the I3/NYC community — mapping the Italian innovation ecosystem in the United States.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-8">
          <div className="flex flex-col gap-0">
            {REPORTS.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex flex-col gap-2 border-b border-border py-10 transition-colors first:pt-0 hover:border-primary/30"
              >
                <p className="text-xs tracking-wide text-muted-foreground">{r.date}</p>
                <h2 className="text-2xl font-light tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                  {r.title}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {r.description}
                </p>
                <span className="mt-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Read report →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
