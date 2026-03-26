interface PartnersSectionProps {
  partners: string[];
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-8">
        <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
          Partners &amp; Sponsors
        </p>
        <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
          {partners.map((p) => (
            <span
              key={p}
              className="text-sm text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
