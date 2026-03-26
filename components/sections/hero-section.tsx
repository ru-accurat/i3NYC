interface HeroSectionProps {
  label?: string;
  title: string;
  titleAccent?: string;
  description?: string;
}

export function HeroSection({
  label,
  title,
  titleAccent,
  description,
}: HeroSectionProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-start justify-center px-8">
      <div className="mx-auto w-full max-w-6xl">
        {label && (
          <p className="text-sm tracking-wide text-primary">{label}</p>
        )}
        <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-primary">{titleAccent}</span>
            </>
          )}
        </h1>
        {description && (
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
