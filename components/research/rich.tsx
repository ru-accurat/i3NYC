// Renders the inline prose extracted by scripts/extract-research-prose.py:
// a list of plain, bold and link segments. Nothing is injected as HTML.

export type Segment = { t: string } | { b: string } | { a: string; href?: string };

export interface ProseSection {
  id: string;
  title: string;
  sub?: Segment[];
  notes?: Segment[][];
  findings?: { title: string; body: Segment[] }[];
  tiles?: { value: string; body: Segment[] }[];
  cards?: { title: string; body: Segment[] }[];
  caveats?: Segment[][];
  blocks?: { title: string; sub?: Segment[]; target?: string }[];
  summary?: string;
}

export interface ProseContent {
  eyebrow: string;
  title: string;
  lede: Segment[];
  lenses: { key: string; label: string }[];
  sections: ProseSection[];
  footer: Segment[];
}

export const LINK =
  "text-foreground/85 underline decoration-border underline-offset-4 transition-colors hover:text-foreground";

/** The site writes the name without the superscript. */
export const brand = (text: string) => text.replaceAll("I³/NYC", "I3/NYC");

export function Rich({ segments }: { segments?: Segment[] }) {
  if (!segments) return null;
  return (
    <>
      {segments.map((s, i) => {
        if ("b" in s) return <b key={i}>{brand(s.b)}</b>;
        if ("a" in s) {
          const internal = s.href?.startsWith("/") || s.href?.startsWith("#");
          return (
            <a
              key={i}
              href={s.href}
              className={LINK}
              {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {brand(s.a)}
            </a>
          );
        }
        return <span key={i}>{brand(s.t)}</span>;
      })}
    </>
  );
}

/** Looks a section up by its exact heading; throws so a renamed heading in a new export is noticed at build time. */
export function sectionOf(content: ProseContent, title: string): ProseSection {
  const found = content.sections.find((s) => s.title === title);
  if (!found) throw new Error(`Research prose: no section titled "${title}"`);
  return found;
}

/** The block (sub-heading) that introduces the element with the given id in the source. */
export function blockOf(section: ProseSection, target: string) {
  const found = section.blocks?.find((b) => b.target === target);
  if (!found) throw new Error(`Research prose: no block for "${target}" in "${section.title}"`);
  return found;
}
