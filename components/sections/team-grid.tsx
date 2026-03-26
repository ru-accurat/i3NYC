interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

interface TeamGridProps {
  label?: string;
  title: string;
  members: TeamMember[];
}

export function TeamGrid({ label, title, members }: TeamGridProps) {
  return (
    <section className="border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
          {title}
        </h2>
        <div className="mt-16 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((t) => (
            <div key={t.name}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-xl font-light text-primary">
                {t.initials}
              </div>
              <h3 className="mt-5 text-base font-medium">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
