"use client";

import { useState } from "react";
import { useEditor } from "./editor-provider";
import { BLOCK_REGISTRY } from "@/lib/block-registry";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import type { Section } from "@/lib/sections";

interface SectionWrapperProps {
  section: Section;
  index: number;
  total: number;
  children: React.ReactNode;
}

// Hero blocks render full-bleed and are already on-screen at first paint —
// fading them in produces a jarring flash. Skip the reveal for these.
const REVEAL_SKIP_TYPES = new Set(["home-hero", "hero"]);

export function SectionWrapper({ section, index, total, children }: SectionWrapperProps) {
  const { isEditing, moveSection, removeSection } = useEditor();

  if (!isEditing) {
    if (REVEAL_SKIP_TYPES.has(section.type)) return <>{children}</>;
    return <RevealOnScroll>{children}</RevealOnScroll>;
  }

  const label = BLOCK_REGISTRY[section.type]?.label ?? section.type;

  return (
    <div className="group/section relative">
      {/* Section toolbar */}
      <div className="absolute -top-px left-0 right-0 z-20 flex items-center gap-1 border-t border-dashed border-primary/30 bg-primary/5 px-4 py-1 opacity-0 transition-opacity group-hover/section:opacity-100">
        <span className="mr-auto text-[10px] font-medium tracking-wide text-primary/70 uppercase">
          {label}
        </span>
        <button
          onClick={() => moveSection(section.id, "up")}
          disabled={index === 0}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-30"
          title="Move up"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
        <button
          onClick={() => moveSection(section.id, "down")}
          disabled={index === total - 1}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-30"
          title="Move down"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        <button
          onClick={() => {
            if (confirm(`Remove this ${label} section?`)) {
              removeSection(section.id);
            }
          }}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
          title="Delete section"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" /></svg>
        </button>
      </div>
      {children}
    </div>
  );
}

/** Button between sections to add a new block */
export function AddSectionButton({ afterIndex }: { afterIndex: number }) {
  const { isEditing, addSection } = useEditor();
  const [showPalette, setShowPalette] = useState(false);

  if (!isEditing) return null;

  return (
    <div className="relative flex justify-center py-1">
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-primary/40 text-primary/40 transition-all hover:border-primary hover:text-primary hover:shadow-lg"
        title="Add section"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 1v10M1 6h10" />
        </svg>
      </button>

      {showPalette && (
        <div className="absolute top-8 z-30 grid max-h-[300px] w-[320px] grid-cols-2 gap-1 overflow-y-auto rounded-lg border border-border bg-background/95 p-2 shadow-xl backdrop-blur-sm">
          {Object.entries(BLOCK_REGISTRY).map(([type, def]) => (
            <button
              key={type}
              onClick={() => {
                addSection(type, afterIndex);
                setShowPalette(false);
              }}
              className="rounded-md px-3 py-2 text-left text-xs text-foreground/70 transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {def.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
