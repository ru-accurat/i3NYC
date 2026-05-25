"use client";

import { EditableText } from "@/components/editor/editable-text";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";

interface KnowledgeTile {
  type: string;
  title: string;
  description: string;
  href?: string;
}

interface KnowledgeHubProps {
  label?: string;
  title: string;
  items: KnowledgeTile[];
  fieldPrefix?: string;
}

const TYPE_LABELS: Record<string, string> = {
  "white-paper": "White Paper",
  "dashboard": "Dashboard",
  "intelligence": "Intelligence",
  "newsletter": "Newsletter",
  "social": "Social",
  "spotlight": "Spotlight",
};

function typeLabel(t: string) {
  return TYPE_LABELS[t] ?? t;
}

export function KnowledgeHub({ label, title, items, fieldPrefix }: KnowledgeHubProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-sm tracking-wide text-primary" />
          ) : (
            <p className="text-sm tracking-wide text-primary">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((tile, idx) => {
            const TileWrapper: React.ElementType = tile.href && !fieldPrefix ? "a" : "div";
            const wrapperProps = tile.href && !fieldPrefix
              ? { href: tile.href, target: tile.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" }
              : {};
            return (
              <TileWrapper
                key={idx}
                {...wrapperProps}
                className="group relative block rounded-2xl border border-border p-8 transition-colors hover:border-primary/40"
              >
                {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.type`} value={tile.type} as="p" className="text-xs tracking-wide uppercase text-primary" />
                ) : (
                  <p className="text-xs tracking-wide uppercase text-primary">{typeLabel(tile.type)}</p>
                )}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.title`} value={tile.title} as="h3" className="mt-3 text-xl font-light tracking-tight md:text-2xl" />
                ) : (
                  <h3 className="mt-3 text-xl font-light tracking-tight md:text-2xl">{tile.title}</h3>
                )}
                {fieldPrefix ? (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.description`} value={tile.description} as="p" className="mt-3 text-sm leading-relaxed text-muted-foreground" multiline />
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{tile.description}</p>
                )}
                {fieldPrefix && (
                  <EditableText fieldKey={`${fieldPrefix}.items.${idx}.href`} value={tile.href || ""} as="p" className="mt-3 text-xs tracking-wide text-muted-foreground/70" />
                )}
              </TileWrapper>
            );
          })}
          {fieldPrefix && <ArrayAddButton sectionId={fieldPrefix} arrayPath="items" label="Add tile" />}
        </div>
      </div>
    </section>
  );
}
