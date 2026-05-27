"use client";

import { EditableText } from "@/components/editor/editable-text";
import { NetworkBackground } from "@/components/sections/network-background";

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
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center overflow-hidden px-8">
      <NetworkBackground opacity={0.28} />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.label`} value={hero.label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary" />
        ) : (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{hero.label}</p>
        )}
        <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={hero.title} as="span" />
          ) : (
            hero.title
          )}{" "}
          <span className="text-primary">
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.titleAccent`} value={hero.titleAccent} as="span" />
            ) : (
              hero.titleAccent
            )}
          </span>{" "}
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.titleSuffix`} value={hero.titleSuffix} as="span" />
          ) : (
            hero.titleSuffix
          )}
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
