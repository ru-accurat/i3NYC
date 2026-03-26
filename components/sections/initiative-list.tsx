import { Separator } from "@/components/ui/separator";

interface Initiative {
  title: string;
  description: string;
}

interface InitiativeListProps {
  label?: string;
  title: string;
  initiatives: Initiative[];
}

export function InitiativeList({
  label,
  title,
  initiatives,
}: InitiativeListProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">
          {title}
        </h2>
        <div className="mt-16 space-y-0">
          {initiatives.map((item, idx) => (
            <div key={item.title}>
              {idx > 0 && <Separator className="opacity-40" />}
              <div className="grid gap-4 py-8 md:grid-cols-[1fr_2fr] md:gap-12">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
