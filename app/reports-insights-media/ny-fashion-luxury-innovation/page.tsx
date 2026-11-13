import type { Metadata } from "next";
import raw from "@/data/research/ny-fashion-luxury-innovation.json";
import prose from "@/data/research/ny-fashion-luxury-innovation.content.json";
import { fmtInt } from "@/lib/research/format";
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
import { FashionProvider } from "./provider";

const content = prose as unknown as ProseContent;

interface School {
  name: string;
  short: string;
  type: string | null;
  region: string | null;
  enr: number | null;
  ey: string | null;
  prog: string | null;
  rank: string | null;
  labs: string | null;
  partners: string | null;
  su: string | null;
  recent: string | null;
  url: string | null;
}
type CardRow = [string, string, (string | null)?];

const lists = raw as unknown as {
  I: School[];
  AN: BriefAnchor[];
  /** [year, thousands of jobs, month label] */
  MFG: [string, number, string][];
  /** [indicator, value, as of, geography, source url] */
  CTX: [string, string, string, string, (string | null)?][];
  TR: CardRow[];
  PO: CardRow[];
  RI: CardRow[];
  EX: BriefExit[];
  XC: { name: string; reason: string }[];
};

const PROGRAM_STATUS_KEY = {
  Active: "dated 2025–26 evidence",
  Listed: "still advertised, nothing recent",
  Unconfirmed: "no current evidence",
  Closed: "closed or stopped",
};

// Two short lists that are written into the source page rather than held as data.
const NUMBERS_SAY = [
  <>
    <b>Commercial, not industrial.</b> About 130,000 fashion jobs remain in the city, but only about 5,700 are in
    apparel manufacturing.
  </>,
  <>
    <b>Luxury real estate.</b> Kering, Prada and Rolex have committed about $2B to buying or building on Fifth Avenue
    since 2023.
  </>,
  <>
    <b>Talent at risk.</b> Fashion program completions in the city fell about 30% between 2016 and 2022.
  </>,
  <>
    <b>City support is small.</b> The Fashion Manufacturing Initiative has granted $6.7M since 2013; the new Local
    Production Fund adds $1.7M over two years.
  </>,
];

const SCHOOLS_OFFER = [
  <>
    <b>FIT</b> · DTech Lab (with Infor) runs industry projects with paid student researchers; the Joyce F. Brown
    Academic Building, opened October 2025, holds the largest campus knitting and weaving lab in the US.
  </>,
  <>
    <b>Parsons</b> · Entrepreneurs Lab (ELab) for design-led ventures; strong international pull.
  </>,
  <>
    <b>Pratt</b> · ran the Brooklyn Fashion + Design Accelerator, which launched 37 businesses before closing in 2019.
  </>,
  <>
    <b>LIM College</b> · acquired by the Japan Educational Foundation (owner of ESMOD Paris) in December 2025; MBA in
    luxury brand management.
  </>,
  <>
    <b>Cornell Tech Runway</b> · more than 120 companies; no fashion startups in the latest cohort.
  </>,
];

const NAV = [
  { id: "findings", label: "Findings" },
  { id: "glance", label: "At a glance" },
  { id: "companies", label: "Companies" },
  { id: "capital", label: "Capital and exits" },
  { id: "incumbents", label: "Fashion and luxury groups" },
  { id: "academia", label: "Schools" },
  { id: "programs", label: "Programs and investors" },
  { id: "policy", label: "Policy" },
  { id: "database", label: "Company database" },
  { id: "method", label: "Method" },
];

export const metadata: Metadata = {
  title: "NY Fashion & Luxury Innovation — I3/NYC",
  description: content.lede.map((s) => ("t" in s ? s.t : "b" in s ? s.b : s.a)).join(""),
  openGraph: {
    title: "NY Fashion & Luxury Innovation",
    description:
      "Fashion and luxury innovation in the New York metro area: 69 companies, 34 programs, investors and maker spaces, 10 schools and the groups headquartered here.",
    type: "article",
  },
};

export default function FashionLuxuryPage() {
  const [findings, glance, companies, capital, incumbents, academia, programs, policy, database, method] =
    content.sections;

  return (
    <FashionProvider>
      <BriefHero content={content} title="Fashion and luxury innovation in the" titleAccent="New York metro area" />
      <SectionNav sections={NAV} />

      <FindingsSection section={findings} />

      <ResearchSection id="glance" kicker="At a glance" title={glance.title} intro={<Rich segments={glance.sub} />}>
        <Tiles tiles={glance.tiles} />
        <Split>
          <div>
            <SubHeading title={glance.blocks?.[0]?.title ?? ""} sub={glance.blocks?.[0]?.sub} />
            <StaticBars
              unit="jobs"
              rows={lists.MFG.map(([label, value, tip]) => ({ label, value, display: `${value}k`, tip }))}
            />
            <Notes section={glance} />
          </div>
          <div>
            <SubHeading title={glance.blocks?.[1]?.title ?? ""} />
            <Timeline items={NUMBERS_SAY} />
          </div>
        </Split>
        <div className="mt-16">
          <SubHeading title={glance.blocks?.[2]?.title ?? ""} />
          <DataTable
            head={["Indicator", "Value", "As of", "Geography and source"]}
            minWidth="min-w-[820px]"
            nowrap={[2]}
            rows={lists.CTX.map(([indicator, value, asOf, geography, source]) => [
              indicator,
              value,
              asOf,
              <span key="g">
                {geography}
                {source && (
                  <>
                    {" "}
                    <a href={source} target="_blank" rel="noopener noreferrer" className={LINK}>
                      Source
                    </a>
                  </>
                )}
              </span>,
            ])}
          />
        </div>
      </ResearchSection>

      <ResearchSection
        id="companies"
        kicker="Companies"
        title={companies.title}
        intro={<Rich segments={companies.sub} />}
      >
        <BriefMatrixOne />
        <div className="mt-16">
          <SubHeading title={companies.blocks?.[0]?.title ?? ""} sub={companies.blocks?.[0]?.sub} />
          <BriefMatrixTwo />
        </div>
        <div className="mt-16">
          <SubHeading title={companies.blocks?.[1]?.title ?? ""} sub={companies.blocks?.[1]?.sub} />
          <BriefCohortExplorer />
        </div>
      </ResearchSection>

      <CapitalSection section={capital} exits={lists.EX} />

      <AnchorsSection
        id="incumbents"
        kicker="Incumbents"
        section={incumbents}
        anchors={lists.AN}
        baseHeading="New York base"
        movesHeading="2024–26 moves"
        barLimit={16}
        barLabel={(name) => name.split(" (")[0]}
      />

      <ResearchSection id="academia" kicker="Schools" title={academia.title} intro={<Rich segments={academia.sub} />}>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2">
          <div>
            <SubHeading title={academia.blocks?.[0]?.title ?? ""} sub={academia.blocks?.[0]?.sub} />
            <StaticBars
              rows={lists.I.filter((i) => i.enr)
                .sort((a, b) => (b.enr as number) - (a.enr as number))
                .map((i) => ({
                  label: i.short,
                  value: i.enr as number,
                  display: fmtInt(i.enr),
                  tip: `${i.name}: ${fmtInt(i.enr)} students (${i.ey || ""})`,
                }))}
            />
          </div>
          <div>
            <SubHeading title={academia.blocks?.[1]?.title ?? ""} />
            <Timeline items={SCHOOLS_OFFER} />
          </div>
        </div>
        <div className="mt-16">
          <SubHeading title={academia.blocks?.[2]?.title ?? ""} />
          <DataTable
            head={["Institution", "Type", "Students", "Rankings", "Labs, centers and partners", "Startup support"]}
            minWidth="min-w-[1180px]"
            rows={lists.I.map((i) => [
              <span key="n">
                {i.url ? (
                  <a href={i.url} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {i.name}
                  </a>
                ) : (
                  i.name
                )}
                {i.prog && <Small>{i.prog}</Small>}
                {i.recent && <Small>Recent: {i.recent}</Small>}
              </span>,
              <span key="t">
                {i.type}
                <Small>{i.region || ""}</Small>
              </span>,
              i.enr ? (
                <span key="e" className="tabular-nums">
                  {fmtInt(i.enr)}
                  <Small>{i.ey || ""}</Small>
                </span>
              ) : (
                "n/d"
              ),
              <span key="r" className="text-xs text-muted-foreground">
                {i.rank || ""}
              </span>,
              <span key="l" className="text-xs text-muted-foreground">
                {i.labs || ""}
                {i.partners && <span className="mt-1 block">Partners: {i.partners}</span>}
              </span>,
              <span key="s" className="text-xs text-muted-foreground">
                {i.su || ""}
              </span>,
            ])}
          />
        </div>
      </ResearchSection>

      <ProgramsSection section={programs} statusKey={PROGRAM_STATUS_KEY} />
      <PolicySection section={policy} policy={lists.PO} trends={lists.TR} risks={lists.RI} />
      <DatabaseSection section={database} />
      <MethodSection section={method} excluded={lists.XC} footer={content.footer} />
    </FashionProvider>
  );
}
