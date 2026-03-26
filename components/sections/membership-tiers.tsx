import { Button } from "@/components/ui/button";

interface Tier {
  name: string;
  price: string;
  note: string;
}

interface MembershipTiersProps {
  label?: string;
  title: string;
  tiers: Tier[];
}

export function MembershipTiers({
  label,
  title,
  tiers,
}: MembershipTiersProps) {
  return (
    <section className="border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h2 className="mt-4 max-w-xl text-3xl font-light tracking-tight md:text-4xl">
          {title}
        </h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name}>
              <h3 className="text-lg font-medium">{t.name}</h3>
              <p className="mt-2 font-mono text-3xl font-light text-primary">
                {t.price}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.note}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <Button
            size="lg"
            className="rounded-full px-10 text-sm font-medium tracking-wide"
          >
            Become a Member
          </Button>
        </div>
      </div>
    </section>
  );
}
