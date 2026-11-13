import { fmtUsdM, pct } from "@/lib/research/format";
import {
  Caveats,
  CardGrid,
  ChartNote,
  FindingsGrid,
  ResearchDisclaimer,
  ResearchHero,
  ResearchSection,
} from "../research-layout";
import { LINK, Rich, brand, type ProseContent, type ProseSection, type Segment } from "../rich";
import { BarList, DataTip, LensToggle } from "../explorer/charts";
import { DataTable } from "../explorer/data-table";
import { SERIES } from "../theme";
import {
  BriefDatabase,
  BriefExits,
  BriefKpis,
  BriefPrograms,
  BriefTopRounds,
  InlineLinks,
  type BriefExit,
} from "./brief-engine";

// Server-rendered pieces of the ecosystem briefs: the static tables, cards and
// lists, plus the sections that are laid out the same way on both pages. The
// lens-driven parts come from brief-engine.tsx.

/* ── Small building blocks ───────────────────────────────────────────────── */

export function SubHeading({ title, sub }: { title: string; sub?: Segment[] }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-light tracking-tight">{title}</h3>
      {sub && (
        <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
          <Rich segments={sub} />
        </p>
      )}
    </div>
  );
}

/** Two charts side by side on wide screens. */
export function Split({ children }: { children: React.ReactNode }) {
  return <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">{children}</div>;
}

export function Notes({ section }: { section: ProseSection }) {
  return (
    <>
      {section.notes?.map((note, i) => (
        <ChartNote key={i}>
          <Rich segments={note} />
        </ChartNote>
      ))}
    </>
  );
}

export function Tiles({ tiles }: { tiles?: { value: string; body: Segment[] }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {(tiles ?? []).map((t) => (
        <div
          key={t.value}
          className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-background/50 px-4 py-5 sm:px-6"
        >
          <span className="font-mono text-2xl font-light tracking-tight text-primary sm:text-3xl">{t.value}</span>
          <span className="text-sm leading-relaxed text-foreground/80">
            <Rich segments={t.body} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Dated or labelled points, one per line. */
export function Timeline({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_b]:font-medium [&_b]:text-foreground">
      {items.map((item, i) => (
        <li key={i} className="border-l border-border pl-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Small({ children }: { children: React.ReactNode }) {
  return <span className="mt-1 block text-xs leading-relaxed font-normal text-muted-foreground">{children}</span>;
}

function SourceLink({ href }: { href?: string | null }) {
  if (!href) return null;
  return (
    <>
      {" "}
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
        Source
      </a>
    </>
  );
}

/** Cards from [title, body, source url] rows: policy, trends, risks. */
export function SourceCards({ items }: { items: [string, string, (string | null)?][] }) {
  return (
    <CardGrid
      items={items.map(([title, body, url]) => ({
        title,
        body: (
          <>
            {body}
            <SourceLink href={url} />
          </>
        ),
      }))}
    />
  );
}

/** Static horizontal bars from pre-computed rows. */
export function StaticBars({
  rows,
  unit,
}: {
  rows: { label: string; value: number; display: string; tip: string }[];
  unit?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <BarList
      rows={rows.map((r) => ({
        key: r.label,
        label: r.label,
        fraction: r.value / max,
        display: r.display,
        unit,
        tip: r.tip,
      }))}
    />
  );
}

/** One metric compared across places; the first row is the subject, the rest are context. */
export function CompareBars({
  blocks,
}: {
  blocks: { title: string; rows: { label: string; value: number; display: string }[] }[];
}) {
  return (
    <DataTip className="space-y-8">
      {blocks.map((block) => {
        const max = Math.max(...block.rows.map((r) => r.value));
        return (
          <div key={block.title}>
            <h4 className="mb-2 text-xs tracking-wide text-muted-foreground">{block.title}</h4>
            {block.rows.map((r, i) => (
              <div
                key={r.label}
                className="grid grid-cols-[minmax(72px,120px)_minmax(0,1fr)_auto] items-center gap-x-4 py-1.5 text-sm"
              >
                <span className={i === 0 ? "text-foreground" : "text-foreground/70"}>{r.label}</span>
                <span className="block h-2.5 bg-foreground/[0.06]" data-tip={`${r.label}: ${r.display}`}>
                  <span
                    className={`block h-full rounded-r-[4px] ${i === 0 ? "" : "bg-foreground/30"}`}
                    style={{ width: pct(r.value / max), ...(i === 0 ? { backgroundColor: SERIES.primary } : {}) }}
                  />
                </span>
                <span className="min-w-[5.5rem] text-right tabular-nums text-foreground/90">{r.display}</span>
              </div>
            ))}
          </div>
        );
      })}
    </DataTip>
  );
}

/* ── Sections laid out the same way on both briefs ───────────────────────── */

const AUTHOR = {
  name: "Andrea Calcagno",
  role: "Vice Chair, Board Member & Co-Founder, I3/NYC",
  href: "https://www.linkedin.com/in/andreacalcagno/",
};

export function BriefHero({
  content,
  title,
  titleAccent,
}: {
  content: ProseContent;
  title: string;
  titleAccent: string;
}) {
  return (
    <ResearchHero
      kicker="I3/NYC Research · Ecosystem brief"
      title={title}
      titleAccent={titleAccent}
      lede={<Rich segments={content.lede} />}
      asOf={brand(content.eyebrow).split(" · ").pop() ?? ""}
      author={AUTHOR}
    >
      <div className="mt-12">
        <LensToggle />
      </div>
      <BriefKpis />
    </ResearchHero>
  );
}

export function FindingsSection({ section }: { section: ProseSection }) {
  return (
    <ResearchSection id="findings" kicker="Findings" title={section.title} intro={<Rich segments={section.sub} />}>
      <FindingsGrid
        items={(section.findings ?? []).map((f) => ({ title: f.title, body: <Rich segments={f.body} /> }))}
      />
    </ResearchSection>
  );
}

export function CapitalSection({ section, exits }: { section: ProseSection; exits: BriefExit[] }) {
  return (
    <ResearchSection id="capital" kicker="Capital" title={section.title} intro={<Rich segments={section.sub} />}>
      <BriefTopRounds />
      <Notes section={section} />
      <div className="mt-16">
        <SubHeading title={section.blocks?.[0]?.title ?? ""} />
        <BriefExits rows={exits} />
      </div>
    </ResearchSection>
  );
}

export interface BriefAnchor {
  name: string;
  hq: string | null;
  /** Life sciences rows carry `segment`, fashion rows `type`. */
  segment?: string | null;
  type?: string | null;
  rev: number | null;
  fy: string | null;
  bar?: boolean | null;
  moves: string | null;
  sources?: string[] | null;
}

interface AnchorsSectionProps {
  id: string;
  kicker: string;
  section: ProseSection;
  anchors: BriefAnchor[];
  /** Column headings for base and recent moves, which differ between the briefs. */
  baseHeading: string;
  movesHeading: string;
  /** Cap on the revenue chart and how its labels are shortened. */
  barLimit?: number;
  barLabel?: (name: string) => string;
}

export function AnchorsSection({
  id,
  kicker,
  section,
  anchors,
  baseHeading,
  movesHeading,
  barLimit,
  barLabel = (name) => name,
}: AnchorsSectionProps) {
  const bars = anchors
    .filter((a) => a.rev && a.bar)
    .sort((a, b) => (b.rev as number) - (a.rev as number))
    .slice(0, barLimit);
  return (
    <ResearchSection id={id} kicker={kicker} title={section.title} intro={<Rich segments={section.sub} />}>
      <SubHeading title={section.blocks?.[0]?.title ?? ""} />
      <StaticBars
        rows={bars.map((a) => ({
          label: barLabel(a.name),
          value: a.rev as number,
          display: fmtUsdM(a.rev),
          tip: `${a.name}: ${fmtUsdM(a.rev)} ${a.fy || ""}`,
        }))}
      />
      <Notes section={section} />
      <div className="mt-12">
        <DataTable
          head={["Company", baseHeading, "Type", "Revenue", movesHeading]}
          minWidth="min-w-[980px]"
          rows={anchors.map((a) => [
            a.name,
            a.hq,
            a.segment ?? a.type,
            a.rev ? (
              <span key="r" className="whitespace-nowrap tabular-nums">
                {fmtUsdM(a.rev)}
                <Small>{a.fy || ""}</Small>
              </span>
            ) : (
              "n/d"
            ),
            <span key="m">
              {a.moves} <InlineLinks sources={a.sources} />
            </span>,
          ])}
        />
      </div>
    </ResearchSection>
  );
}

export function ProgramsSection({
  section,
  statusKey,
}: {
  section: ProseSection;
  statusKey: Record<string, string>;
}) {
  return (
    <ResearchSection id="programs" kicker="Programs" title={section.title} intro={<Rich segments={section.sub} />}>
      <BriefPrograms statusKey={statusKey} />
    </ResearchSection>
  );
}

type CardRow = [string, string, (string | null)?];

export function PolicySection({
  section,
  policy,
  trends,
  risks,
}: {
  section: ProseSection;
  policy: CardRow[];
  trends: CardRow[];
  risks: CardRow[];
}) {
  return (
    <ResearchSection id="policy" kicker="Policy" title={section.title}>
      <SubHeading title={section.blocks?.[0]?.title ?? ""} />
      <SourceCards items={policy} />
      <div className="mt-16">
        <SubHeading title={section.blocks?.[1]?.title ?? ""} />
        <SourceCards items={trends} />
      </div>
      <div className="mt-16">
        <SubHeading title={section.blocks?.[2]?.title ?? ""} />
        <SourceCards items={risks} />
      </div>
    </ResearchSection>
  );
}

export function DatabaseSection({ section }: { section: ProseSection }) {
  return (
    <ResearchSection id="database" kicker="Database" title={section.title} intro={<Rich segments={section.sub} />}>
      <BriefDatabase />
    </ResearchSection>
  );
}

export function MethodSection({
  section,
  excluded,
  footer,
}: {
  section: ProseSection;
  excluded: { name: string; reason: string }[];
  footer: Segment[];
}) {
  // The byline already credits the author; keep only the statement that follows it.
  const disclaimer = brand(footer.map((s) => ("t" in s ? s.t : "")).join(""))
    .replace(/^.*?Co-Founder, I3\/NYC\.\s*/, "")
    .trim();
  return (
    <>
      <ResearchSection id="method" kicker="Method" title={section.title}>
        <Caveats items={(section.caveats ?? []).map((c, i) => <Rich key={i} segments={c} />)} />
        <details className="group mt-10 max-w-5xl rounded-2xl border border-border">
          <summary className="cursor-pointer list-none px-6 py-4 text-sm text-foreground/85 transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
            Companies reviewed and left out ({excluded.length})
            <span className="ml-2 text-muted-foreground group-open:hidden">Show</span>
            <span className="ml-2 hidden text-muted-foreground group-open:inline">Hide</span>
          </summary>
          <ul className="columns-1 gap-x-12 px-6 pb-6 text-xs leading-relaxed text-muted-foreground md:columns-2">
            {excluded.map((x) => (
              <li key={x.name + x.reason} className="mb-2 break-inside-avoid">
                <b className="font-medium text-foreground/85">{x.name}</b> · {x.reason}
              </li>
            ))}
          </ul>
        </details>
      </ResearchSection>
      <ResearchDisclaimer>{disclaimer}</ResearchDisclaimer>
    </>
  );
}
