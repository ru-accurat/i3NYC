"use client";

import { EditableText } from "@/components/editor/editable-text";

interface HomeHeroProps {
  hero: {
    label: string;
    title: string;
    titleAccent: string;
    titleSuffix: string;
    description: string;
  };
  fieldPrefix?: string;
}

export function HomeHero({ hero, fieldPrefix }: HomeHeroProps) {
  return (
    <section className="flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center px-8">
      <div className="mx-auto w-full max-w-6xl">
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.label`} value={hero.label} as="p" className="text-sm tracking-wide text-primary" />
        ) : (
          <p className="text-sm tracking-wide text-primary">{hero.label}</p>
        )}
        <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={hero.title} as="span" />
          ) : (
            hero.title
          )}{" "}
          <span className="whitespace-nowrap text-primary">
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.titleAccent`} value={hero.titleAccent} as="span" />
            ) : (
              hero.titleAccent
            )}
          </span>{" "}
          <span className="whitespace-nowrap">
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.titleSuffix`} value={hero.titleSuffix} as="span" />
            ) : (
              hero.titleSuffix
            )}
          </span>
        </h1>
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.description`} value={hero.description} as="p" className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground" multiline />
        ) : (
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">{hero.description}</p>
        )}
      </div>
    </section>
  );
}
