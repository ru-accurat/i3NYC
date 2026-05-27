"use client";

import { EditableText } from "@/components/editor/editable-text";
import {
  NetworkBackground,
  type NetworkBackgroundConfig,
} from "@/components/sections/network-background";

interface HeroSectionProps {
  label?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  bg?: NetworkBackgroundConfig;
  fieldPrefix?: string;
}

export function HeroSection({ label, title, titleAccent, description, bg, fieldPrefix }: HeroSectionProps) {
  const bgEnabled = bg?.enabled === true; // opt-in: generic heroes default to NO background
  return (
    <section className="relative flex min-h-[60vh] flex-col items-start justify-center overflow-hidden px-8">
      {bgEnabled && (
        <NetworkBackground
          opacity={bg?.opacity ?? 0.20}
          nodeCount={bg?.nodeCount}
          edgeProximity={bg?.edgeProximity}
          cursorInfluenceRadius={bg?.cursorInfluenceRadius}
          seed={bg?.seed}
        />
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{label}</p>
          )
        )}
        <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          {fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="span" />
          ) : (
            title
          )}
          {titleAccent && (
            <>
              {" "}
              <span className="text-primary">
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.titleAccent`} value={titleAccent} as="span" />
                ) : (
                  titleAccent
                )}
              </span>
            </>
          )}
        </h1>
        {description && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.description`} value={description} as="p" className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground" multiline />
          ) : (
            <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">{description}</p>
          )
        )}
      </div>
    </section>
  );
}
