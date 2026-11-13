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
import { SectionNav } from "../section-nav";
import { CohortExplorer, LensToggle } from "../explorer/charts";
import { DataTable } from "../explorer/data-table";
import {
  AgeScaleScatter,
  AiShare,
  CensusDatabase,
  CensusKpis,
  ExitsTable,
  ModelMatrix,
  NamedBars,
  StageMatrix,
  TopRounds,
  VentureByYear,
  type CensusVariant,
  type ExitRow,
} from "./ai-census";

// Page body shared by the NYC and Italy AI censuses. Words come from the prose
// extracted from each applet; the twelve sections are in the same order in
// both, so they are addressed by position.

export interface AiCensusLists {
  FY: { y: string; v: number; d: number }[];
  AIS: { y: string; v: number }[];
  PROV: [string, string[]][];
  UNI: [string, string[]][];
  EX: ExitRow[];
  /** [organization, home base, footprint, source urls] */
  AN: [string, string, string, string[]][];
  TR: { trend: string; evidence: string; source?: string }[];
  PO: { item: string; status: string; date: string; summary: string; source?: string }[];
  AC: { institution: string; program: string; facts: string; source?: string }[];
  RI: { risk: string; evidence: string; source?: string }[];
  /** [name, note] */
  NE: [string, string][];
  XC: { name: string; reason: string }[];
}

interface AiCensusPageProps {
  variant: CensusVariant;
  content: ProseContent;
  lists: AiCensusLists;
  /** Headline split around its one accented phrase. */
  title: string;
  titleAccent: string;
  /** The page's client provider, which carries that page's company data. */
  Provider: React.ComponentType<{ children: React.ReactNode }>;
  /** Optional sentence appended to the lede, e.g. a link to the companion census. */
  companion?: React.ReactNode;
}

const NAV = [
  { id: "findings", label: "Findings" },
  { id: "context", label: "Context" },
  { id: "explorer", label: "Cohort explorer" },
  { id: "stages", label: "Funding cycle" },
  { id: "scale", label: "Age and scale" },
  { id: "models", label: "Models" },
  { id: "capital", label: "Capital" },
  { id: "trends", label: "Trends" },
  { id: "database", label: "Database" },
  { id: "elsewhere", label: "Beyond the census" },
  { id: "policy", label: "Academia and policy" },
  { id: "method", label: "Method" },
];

function SourceLink({ href }: { href?: string }) {
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

function SubHeading({ title, sub }: { title: string; sub?: Segment[] }) {
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

function notes(section: ProseSection) {
  return section.notes?.map((n, i) => (
    <ChartNote key={i}>
      <Rich segments={n} />
    </ChartNote>
  ));
}

export function AiCensusPage({ variant, content, lists, title, titleAccent, Provider, companion }: AiCensusPageProps) {
  const [findings, context, explorer, stages, scale, models, capital, trends, database, elsewhere, policy, method] =
    content.sections;
  const asOf = brand(content.eyebrow).split(" · ").pop() ?? "";
  // The byline already credits the author; keep only the statement that follows it.
  const disclaimer = brand(content.footer.map((s) => ("t" in s ? s.t : "")).join(""))
    .replace(/^.*?Co-Founder, I3\/NYC\.\s*/, "")
    .trim();

  return (
    <Provider>
      <ResearchHero
        kicker="I3/NYC Research · Company census"
        title={title}
        titleAccent={titleAccent}
        lede={
          <>
            <Rich segments={content.lede} />
            {companion}
          </>
        }
        asOf={asOf}
        author={{
          name: "Andrea Calcagno",
          role: "Vice Chair, Board Member & Co-Founder, I3/NYC",
          href: "https://www.linkedin.com/in/andreacalcagno/",
        }}
      >
        <div className="mt-12">
          <LensToggle />
        </div>
        <CensusKpis variant={variant} />
      </ResearchHero>

      <SectionNav sections={NAV} />

      <ResearchSection id="findings" kicker="Findings" title={findings.title} intro={<Rich segments={findings.sub} />}>
        <FindingsGrid
          items={(findings.findings ?? []).map((f) => ({ title: f.title, body: <Rich segments={f.body} /> }))}
        />
      </ResearchSection>

      <ResearchSection id="context" kicker="Context" title={context.title} intro={<Rich segments={context.sub} />}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {(context.tiles ?? []).map((t) => (
            <div key={t.value} className="flex min-w-0 flex-col gap-2 rounded-lg border border-border bg-background/50 px-4 py-5 sm:px-6">
              <span className="font-mono text-2xl font-light tracking-tight text-primary sm:text-3xl">{t.value}</span>
              <span className="text-sm leading-relaxed text-foreground/80">
                <Rich segments={t.body} />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div>
            <SubHeading title={context.blocks?.[0]?.title ?? ""} sub={context.blocks?.[0]?.sub} />
            <VentureByYear variant={variant} rows={lists.FY} />
          </div>
          <div>
            <SubHeading title={context.blocks?.[1]?.title ?? ""} sub={context.blocks?.[1]?.sub} />
            <AiShare variant={variant} rows={lists.AIS} />
          </div>
        </div>
      </ResearchSection>

      <ResearchSection id="explorer" kicker="Explorer" title={explorer.title} intro={<Rich segments={explorer.sub} />}>
        <CohortExplorer />
      </ResearchSection>

      <ResearchSection id="stages" kicker="Funding cycle" title={stages.title} intro={<Rich segments={stages.sub} />}>
        <StageMatrix />
        {notes(stages)}
      </ResearchSection>

      <ResearchSection id="scale" kicker="Age and scale" title={scale.title} intro={<Rich segments={scale.sub} />}>
        <AgeScaleScatter variant={variant} />
      </ResearchSection>

      <ResearchSection id="models" kicker="Models" title={models.title} intro={<Rich segments={models.sub} />}>
        <ModelMatrix variant={variant} />
        {notes(models)}
        <div className="mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div>
            <SubHeading title={models.blocks?.[0]?.title ?? ""} sub={models.blocks?.[0]?.sub} />
            <NamedBars list={lists.PROV} />
          </div>
          <div>
            <SubHeading title={models.blocks?.[1]?.title ?? ""} sub={models.blocks?.[1]?.sub} />
            <NamedBars list={lists.UNI} />
          </div>
        </div>
      </ResearchSection>

      <ResearchSection id="capital" kicker="Capital" title={capital.title} intro={<Rich segments={capital.sub} />}>
        <TopRounds variant={variant} />
        {notes(capital)}
        <div className="mt-16">
          <SubHeading title={capital.blocks?.[0]?.title ?? ""} />
          <ExitsTable rows={lists.EX} />
        </div>
      </ResearchSection>

      <ResearchSection id="trends" kicker="Trends" title={trends.title} intro={<Rich segments={trends.sub} />}>
        <CardGrid
          items={lists.TR.map((t) => ({
            title: t.trend,
            body: (
              <>
                {t.evidence}
                <SourceLink href={t.source} />
              </>
            ),
          }))}
        />
      </ResearchSection>

      <ResearchSection id="database" kicker="Database" title={database.title} intro={<Rich segments={database.sub} />}>
        <CensusDatabase variant={variant} />
      </ResearchSection>

      <ResearchSection
        id="elsewhere"
        kicker="Beyond the census"
        title={elsewhere.title}
        intro={<Rich segments={elsewhere.sub} />}
      >
        <DataTable
          head={["Organization", "Home base", variant === "nyc" ? "New York footprint" : "Footprint in Italy"]}
          rows={lists.AN.map(([name, home, footprint, urls]) => [
            name,
            home,
            <span key="f">
              {footprint}{" "}
              {urls.map((u, i) => (
                <a key={u} href={u} target="_blank" rel="noopener noreferrer" className={`${LINK} mr-1`}>
                  [{i + 1}]
                </a>
              ))}
            </span>,
          ])}
        />
        <div className="mt-16">
          <SubHeading title={elsewhere.blocks?.[0]?.title ?? ""} />
          <ul className="grid gap-x-12 gap-y-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            {lists.NE.map(([name, note]) => (
              <li key={name} className="border-l border-border pl-4">
                <b className="font-medium text-foreground">{name}</b> · {note}
              </li>
            ))}
          </ul>
        </div>
      </ResearchSection>

      <ResearchSection id="policy" kicker="Academia and policy" title={policy.title} intro={<Rich segments={policy.sub} />}>
        <SubHeading title={policy.blocks?.[0]?.title ?? ""} />
        <CardGrid
          items={lists.AC.map((a) => ({
            title: `${a.institution}: ${a.program}`,
            body: (
              <>
                {a.facts}
                <SourceLink href={a.source} />
              </>
            ),
          }))}
        />
        <div className="mt-16">
          <SubHeading title={policy.blocks?.[1]?.title ?? ""} />
          <CardGrid
            items={lists.PO.map((p) => ({
              title: p.item,
              body: (
                <>
                  {p.status} ({p.date}). {p.summary}
                  <SourceLink href={p.source} />
                </>
              ),
            }))}
          />
        </div>
        <div className="mt-16">
          <SubHeading title={policy.blocks?.[2]?.title ?? ""} />
          <CardGrid
            items={lists.RI.map((r) => ({
              title: r.risk,
              body: (
                <>
                  {r.evidence}
                  <SourceLink href={r.source} />
                </>
              ),
            }))}
          />
        </div>
      </ResearchSection>

      <ResearchSection id="method" kicker="Method" title={method.title}>
        <Caveats items={(method.caveats ?? []).map((c, i) => <Rich key={i} segments={c} />)} />
        <details className="group mt-10 max-w-5xl rounded-2xl border border-border">
          <summary className="cursor-pointer list-none px-6 py-4 text-sm text-foreground/85 transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
            Companies reviewed and left out ({lists.XC.length})
            <span className="ml-2 text-muted-foreground group-open:hidden">Show</span>
            <span className="ml-2 hidden text-muted-foreground group-open:inline">Hide</span>
          </summary>
          <ul className="columns-1 gap-x-12 px-6 pb-6 text-xs leading-relaxed text-muted-foreground md:columns-2">
            {lists.XC.map((x) => (
              <li key={x.name + x.reason} className="mb-2 break-inside-avoid">
                <b className="font-medium text-foreground/85">{x.name}</b> · {x.reason}
              </li>
            ))}
          </ul>
        </details>
      </ResearchSection>

      <ResearchDisclaimer>{disclaimer}</ResearchDisclaimer>
    </Provider>
  );
}
