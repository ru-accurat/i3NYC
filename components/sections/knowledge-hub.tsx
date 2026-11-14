"use client";

import { EditableText } from "@/components/editor/editable-text";
import { useEditor } from "@/components/editor/editor-provider";
import { ArrayItemRemove, ArrayAddButton } from "@/components/editor/array-controls";
import { CONTENT_TYPE_ICONS } from "@/components/ui/content-type-icon";

interface KnowledgeTile {
  type: string;
  title: string;
  description: string;
  href?: string;
  /** Release date as shown on the card, e.g. "November 17, 2026". Tiles without one show none. */
  date?: string;
}

interface KnowledgeHubProps {
  label?: string;
  title: string;
  items: KnowledgeTile[];
  fieldPrefix?: string;
}

const TYPE_LABELS: Record<string, string> = {
  "navigator": "Interactive Guide",
  "map": "Ecosystem Map",
  "census": "Company Census",
  "brief": "Ecosystem Brief",
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
  const { isEditing } = useEditor();
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        {label && (
          fieldPrefix ? (
            <EditableText fieldKey={`${fieldPrefix}.label`} value={label} as="p" className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text" />
          ) : (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-text">{label}</p>
          )
        )}
        {fieldPrefix ? (
          <EditableText fieldKey={`${fieldPrefix}.title`} value={title} as="h2" className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl" />
        ) : (
          <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
        )}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((tile, idx) => {
            // A tile is a link for visitors and a plain box while editing, so its text stays editable.
            // (`fieldPrefix` is always set, so it cannot tell the two apart; `isEditing` can.)
            const linked = Boolean(tile.href) && !isEditing;
            const external = linked && tile.href!.startsWith("http");
            const TileWrapper: React.ElementType = linked ? "a" : "div";
            const wrapperProps = linked
              ? { href: tile.href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
              : {};
            const Icon = CONTENT_TYPE_ICONS[tile.type];
            return (
              <TileWrapper
                key={idx}
                {...wrapperProps}
                className="group relative block rounded-2xl border border-border p-8 transition-colors hover:border-primary/40"
              >
                {fieldPrefix && <ArrayItemRemove sectionId={fieldPrefix} arrayPath="items" index={idx} />}
                {Icon && (
                  <span aria-hidden="true" className="mb-6 flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary-text">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                )}
                {/* Stacked on phones so every card reads the same; one row from `sm` up. */}
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4">
                  {fieldPrefix && isEditing ? (
                    <EditableText fieldKey={`${fieldPrefix}.items.${idx}.type`} value={tile.type} as="p" className="text-xs tracking-wide uppercase text-primary-text" />
                  ) : (
                    <p className="text-xs tracking-wide uppercase text-primary-text">{typeLabel(tile.type)}</p>
                  )}
                  {fieldPrefix && isEditing ? (
                    <EditableText
                      fieldKey={`${fieldPrefix}.items.${idx}.date`}
                      value={tile.date ?? ""}
                      as="p"
                      className="min-w-20 text-xs tracking-wide text-muted-foreground tabular-nums empty:before:content-['Add_date'] empty:before:text-muted-foreground/50"
                    />
                  ) : (
                    tile.date && <p className="text-xs tracking-wide text-muted-foreground tabular-nums">{tile.date}</p>
                  )}
                </div>
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
                {/* Show href row only while actively editing — not on the public site. */}
                {fieldPrefix && isEditing && (
                  <EditableText
                    fieldKey={`${fieldPrefix}.items.${idx}.href`}
                    value={tile.href || ""}
                    as="p"
                    className="mt-3 text-xs tracking-wide text-muted-foreground/70"
                  />
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
