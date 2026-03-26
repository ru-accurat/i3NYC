import { Separator } from "@/components/ui/separator";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsGridProps {
  label?: string;
  title: string;
  benefits: Benefit[];
}

export function BenefitsGrid({ label, title, benefits }: BenefitsGridProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">
          {title}
        </h2>
        <Separator className="mt-12 opacity-40" />
        <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div key={b.title}>
              <h3 className="text-base font-medium">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
