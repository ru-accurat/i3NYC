"use client";

import Link from "next/link";
import { EditableText } from "@/components/editor/editable-text";
import {
  NetworkBackground,
  type NetworkBackgroundConfig,
} from "@/components/sections/network-background";
import { MEMBERSHIP_SIGNUP_URL } from "@/lib/nav-links";

interface HomeHeroProps {
  hero: {
    label: string;
    title: string;
    titleAccent: string;
    titleSuffix: string;
    description: string;
    /** Main action under the description. Defaults to the membership signup. */
    primaryLabel?: string;
    primaryHref?: string;
    /** Optional second action, shown as a text link. */
    secondaryLabel?: string;
    secondaryHref?: string;
    /** Optional animated network background config. Omit / set enabled=false to disable. */
    bg?: NetworkBackgroundConfig;
  };
  fieldPrefix?: string;
}

const externalProps = (href: string) =>
  href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function HomeHero({ hero, fieldPrefix }: HomeHeroProps) {
  const bgEnabled = hero.bg?.enabled ?? true;
  const primaryLabel = hero.primaryLabel ?? "Become Member";
  const primaryHref = hero.primaryHref ?? MEMBERSHIP_SIGNUP_URL;
  return (
    <section className="relative flex min-h-[70svh] flex-col items-start justify-center overflow-hidden px-8 py-20">
      {bgEnabled && (
        <NetworkBackground
          opacity={hero.bg?.opacity ?? 0.5}
          nodeCount={hero.bg?.nodeCount}
          edgeProximity={hero.bg?.edgeProximity}
          cursorInfluenceRadius={hero.bg?.cursorInfluenceRadius}
          seed={hero.bg?.seed}
        />
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.label`} value={hero.label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text" />
        ) : (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text">{hero.label}</p>
        )}
        <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={hero.title} as="span" />
          ) : (
            hero.title
          )}{" "}
          <span className="text-primary-text">
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
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={primaryHref}
            {...externalProps(primaryHref)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
          >
            {fieldPrefix ? (
              <EditableText fieldKey={`${fieldPrefix}.primaryLabel`} value={primaryLabel} as="span" />
            ) : (
              primaryLabel
            )}
          </Link>
          {hero.secondaryLabel && hero.secondaryHref && (
            <Link
              href={hero.secondaryHref}
              {...externalProps(hero.secondaryHref)}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {fieldPrefix ? (
                <EditableText fieldKey={`${fieldPrefix}.secondaryLabel`} value={hero.secondaryLabel} as="span" />
              ) : (
                hero.secondaryLabel
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
