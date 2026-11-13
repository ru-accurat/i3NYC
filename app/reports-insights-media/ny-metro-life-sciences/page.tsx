import type { Metadata } from "next";
import raw from "@/data/research/ny-metro-life-sciences.json";
import prose from "@/data/research/ny-metro-life-sciences.content.json";
import { fmtInt, fmtUsdM } from "@/lib/research/format";
import { ResearchSection } from "@/components/research/research-layout";
import { LINK, Rich, type ProseContent } from "@/components/research/rich";
import { SectionNav } from "@/components/research/section-nav";
import { DataTable } from "@/components/research/explorer/data-table";
import {
  BriefCohortExplorer,
  BriefMatrixOne,
  BriefMatrixTwo,
  type BriefExit,
} from "@/components/research/brief/brief-engine";
import {
  AnchorsSection,
  BriefHero,
  CapitalSection,
  CompareBars,
  DatabaseSection,
  FindingsSection,
  MethodSection,
  Notes,
  PolicySection,
  ProgramsSection,
  Small,
  Split,
  StaticBars,
  SubHeading,
  Tiles,
  Timeline,
  type BriefAnchor,
} from "@/components/research/brief/brief-sections";
import { LifeSciencesProvider } from "./provider";

const content = prose as unknown as ProseContent;

interface Institution {
  name: string;
  short: string;
  cl: string;
  nih: number | null;
  rank: string | null;
  rankS: string | null;
  herd: number | null;
  su: string | null;
  tto: string | null;
  ttou: string | null;
  spin: string | null;
  land: string | null;
}
type CardRow = [string, string, (string | null)?];

const lists = raw as unknown as {
  I: Institution[];
  AN: BriefAnchor[];
  /** [label, $ billions, scope note] */
  VC: [string, number, string][];
  FE: { date: string; event: string; impact: string; source: string }[];
  /** [indicator, value, as of, geography and source] */
  LAB: [string, string, string, string][];
  TR: CardRow[];
  PO: CardRow[];
  RI: CardRow[];
  EX: BriefExit[];
  XC: { name: string; reason: string }[];
};

// "Against the two leading clusters": NY/NJ, Boston, Bay Area (GEN 2026).
const CLUSTERS = ["NY / NJ", "Boston", "Bay Area"];
const COMPARE: { title: string; values: number[]; format: (v: number) => string }[] = [
  { title: "Venture capital, 2025", values: [1000, 6850, 7800], format: fmtUsdM },
  { title: "Lab space (million sq ft)", values: [25.5, 63.2, 54.3], format: (v) => `${v}M sq ft` },
  { title: "Life sciences jobs", values: [147900, 117108, 150491], format: fmtInt },
];

const PROGRAM_STATUS_KEY = {
  Active: "dated 2025–26 evidence of operation",
  Listed: "still advertised, nothing dated recently",
  Unconfirmed: "no current evidence",
  Closed: "closed or stopped",
};

const NAV = [
  { id: "findings", label: "Findings" },
  { id: "glance", label: "At a glance" },
  { id: "companies", label: "Companies" },
  { id: "pipeline", label: "Pipeline" },
  { id: "capital", label: "Capital and exits" },
  { id: "anchors", label: "Pharma anchors" },
  { id: "academia", label: "Academia" },
  { id: "programs", label: "Incubators and programs" },
  { id: "labs", label: "Lab space" },
  { id: "policy", label: "Policy" },
  { id: "database", label: "Company database" },
  { id: "method", label: "Method" },
];

export const metadata: Metadata = {
  title: "NY Metro Life Sciences — I3/NYC",
  description: content.lede.map((s) => ("t" in s ? s.t : "b" in s ? s.b : s.a)).join(""),
  openGraph: {
    title: "NY Metro Life Sciences",
    description:
      "Life sciences in the New York metro area: 141 companies, 42 incubators and programs, 22 research institutions and the pharma anchors around them.",
    type: "article",
  },
};

export default function LifeSciencesPage() {
  const [findings, glance, companies, pipeline, capital, anchors, academia, programs, labs, policy, database, method] =
    content.sections;

  return (
    <LifeSciencesProvider>
      <BriefHero content={content} title="Life sciences in the" titleAccent="New York metro area" />
      <SectionNav sections={NAV} />

      <FindingsSection section={findings} />

      <ResearchSection id="glance" kicker="At a glance" title={glance.title} intro={<Rich segments={glance.sub} />}>
        <Tiles tiles={glance.tiles} />
        <Split>
          <div>
            <SubHeading title={glance.blocks?.[0]?.title ?? ""} sub={glance.blocks?.[0]?.sub} />
            <CompareBars
              blocks={COMPARE.map((m) => ({
                title: m.title,
                rows: CLUSTERS.map((label, i) => ({ label, value: m.values[i], display: m.format(m.values[i]) })),
              }))}
            />
          </div>
          <div>
            <SubHeading title={glance.blocks?.[1]?.title ?? ""} sub={glance.blocks?.[1]?.sub} />
            <StaticBars
              rows={lists.VC.map(([label, value, tip]) => ({ label, value, display: `$${value}B`, tip }))}
            />
            <Notes section={glance} />
          </div>
        </Split>
      </ResearchSection>

      <ResearchSection
        id="companies"
        kicker="Companies"
        title={companies.title}
        intro={<Rich segments={companies.sub} />}
      >
        <BriefMatrixOne />
        <Notes section={companies} />
        <div className="mt-16">
          <SubHeading title={companies.blocks?.[0]?.title ?? ""} sub={companies.blocks?.[0]?.sub} />
          <BriefCohortExplorer />
        </div>
      </ResearchSection>

      <ResearchSection id="pipeline" kicker="Pipeline" title={pipeline.title} intro={<Rich segments={pipeline.sub} />}>
        <BriefMatrixTwo />
        <Notes section={pipeline} />
      </ResearchSection>

      <CapitalSection section={capital} exits={lists.EX} />

      <AnchorsSection
        id="anchors"
        kicker="Anchors"
        section={anchors}
        anchors={lists.AN}
        baseHeading="Metro base"
        movesHeading="2025–26 in the metro"
      />

      <ResearchSection id="academia" kicker="Academia" title={academia.title} intro={<Rich segments={academia.sub} />}>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div>
            <SubHeading title={academia.blocks?.[0]?.title ?? ""} sub={academia.blocks?.[0]?.sub} />
            <StaticBars
              rows={lists.I.filter((i) => i.nih)
                .sort((a, b) => (b.nih as number) - (a.nih as number))
                .map((i) => ({
                  label: i.short,
                  value: i.nih as number,
                  display: fmtUsdM(i.nih),
                  tip: `${i.name}: ${fmtUsdM(i.nih)} NIH, FY2025. ${i.rank || ""}`,
                }))}
            />
          </div>
          <div>
            <SubHeading title={academia.blocks?.[1]?.title ?? ""} sub={academia.blocks?.[1]?.sub} />
            <Timeline
              items={lists.FE.map((x) => (
                <>
                  <b>{x.date}</b> · {x.event}. {x.impact}{" "}
                  <a href={x.source} target="_blank" rel="noopener noreferrer" className={LINK}>
                    Source
                  </a>
                </>
              ))}
            />
          </div>
        </div>
        <div className="mt-16">
          <SubHeading title={academia.blocks?.[2]?.title ?? ""} />
          <DataTable
            head={[
              "Institution",
              "Sub-region",
              "NIH FY2025",
              "Rank",
              "Federal R&D (HERD FY2024)",
              "Startups",
              "Tech transfer",
            ]}
            minWidth="min-w-[1080px]"
            nowrap={[2, 4]}
            rows={lists.I.map((i) => [
              <span key="n">
                {i.name}
                {i.spin && <Small>Spinouts: {i.spin}</Small>}
                {i.land && <Small>Landmarks: {i.land}</Small>}
              </span>,
              i.cl,
              i.nih ? fmtUsdM(i.nih) : "n/d",
              <span key="r" className="text-xs text-muted-foreground">
                {i.rankS || ""}
              </span>,
              i.herd ? fmtUsdM(i.herd) : "n/d",
              i.su || "n/d",
              i.tto ? (
                i.ttou ? (
                  <a key="t" href={i.ttou} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {i.tto}
                  </a>
                ) : (
                  i.tto
                )
              ) : (
                "n/d"
              ),
            ])}
          />
          <Notes section={academia} />
        </div>
      </ResearchSection>

      <ProgramsSection section={programs} statusKey={PROGRAM_STATUS_KEY} />

      <ResearchSection id="labs" kicker="Lab space" title={labs.title} intro={<Rich segments={labs.sub} />}>
        <Tiles tiles={labs.tiles} />
        <div className="mt-12">
          <DataTable
            head={["Indicator", "Value", "As of", "Geography and source"]}
            minWidth="min-w-[820px]"
            nowrap={[2]}
            rows={lists.LAB}
          />
          <Notes section={labs} />
        </div>
      </ResearchSection>

      <PolicySection section={policy} policy={lists.PO} trends={lists.TR} risks={lists.RI} />
      <DatabaseSection section={database} />
      <MethodSection section={method} excluded={lists.XC} footer={content.footer} />
    </LifeSciencesProvider>
  );
}
