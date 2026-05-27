"use client";

import { EditableText } from "@/components/editor/editable-text";
import {
  NetworkBackground,
  type NetworkBackgroundConfig,
} from "@/components/sections/network-background";

interface HomeHeroProps {
  hero: {
    label: string;
    title: string;
    titleAccent: string;
    titleSuffix: string;
    description: string;
    /** Optional animated network background config. Omit / set enabled=false to disable. */
    bg?: NetworkBackgroundConfig;
  };
  fieldPrefix?: string;
}

export function HomeHero({ hero, fieldPrefix }: HomeHeroProps) {
  const bgEnabled = hero.bg?.enabled ?? true;
  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center overflow-hidden px-8">
      {bgEnabled && (
        <NetworkBackground
          opacity={hero.bg?.opacity ?? 0.28}
          nodeCount={hero.bg?.nodeCount}
          edgeProximity={hero.bg?.edgeProximity}
          cursorInfluenceRadius={hero.bg?.cursorInfluenceRadius}
          seed={hero.bg?.seed}
        />
      )}
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
