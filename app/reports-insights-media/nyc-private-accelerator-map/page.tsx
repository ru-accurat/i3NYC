import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/data/research/nyc-private-accelerator-map.json";
import type { ProgramMapData, ProgramMapLabels, Status } from "@/lib/research/program-map";
import {
  Caveats,
  CardGrid,
  ChartNote,
  FindingsGrid,
  ResearchDisclaimer,
  ResearchHero,
  ResearchSection,
} from "@/components/research/research-layout";
import { SectionNav } from "@/components/research/section-nav";
import { CasesTable, CoverageMatrix, FundingLadder } from "@/components/research/program-charts";
import { ProgramDatabase } from "@/components/research/program-database";

const data = raw as unknown as ProgramMapData;
const { P, STAGES, GROUPS, TOPICS, CASES } = data;

const CHECKED = "October 10, 2026";
const DESCRIPTION =
  "A map of the privately run programs that fund, house and build startups in New York City: what each one invests and takes, who can get in, whether it is running today, and what its alumni went on to do.";

export const metadata: Metadata = {
  title: "NYC Private Accelerator Map — I3/NYC",
  description: DESCRIPTION,
  openGraph: {
    title: "NYC Private Accelerator Map",
    description: `New York City's private accelerators, incubators and venture studios: ${P.length} programs, their deals and who can get in.`,
    type: "article",
  },
};

const SECTIONS = [
  { id: "findings", label: "Findings" },
  { id: "coverage", label: "Coverage" },
  { id: "deals", label: "Standard deals" },
  { id: "cases", label: "Success cases" },
  { id: "database", label: "Program database" },
  { id: "entry-points", label: "Entry points" },
  { id: "method", label: "Method" },
];

const LABELS: ProgramMapLabels = {
  group: "Program family",
  allGroups: "All families",
  access: { Open: "Open application", Mixed: "Conditions apply", Affiliates: "By invitation" },
  status: { Active: "Active", Listed: "Listed", Paused: "Closed", Unconfirmed: "Unconfirmed" },
  terms: "Equity and terms",
  checked: CHECKED,
};

const STATUS_KEY: Record<Status, string> = {
  Active: "dated evidence from 2025–26",
  Listed: "official page live, no recent date",
  Paused: "shut down",
  Unconfirmed: "only older sources found",
};

const KPIS = [
  { value: String(P.length), label: "programs mapped" },
  { value: String(P.filter((p) => p.st === "Active").length), label: "confirmed active with 2025–26 evidence" },
  { value: String(P.filter((p) => p.ne).length), label: "take no equity" },
  {
    value: String(P.filter((p) => p.g === "International landing programs").length),
    label: "built to land foreign companies",
  },
  { value: "$220K", label: "Techstars NYC standard deal" },
];

const FINDINGS = [
  {
    title: "Private money is equity money",
    body: (
      <>
        The standard deals are published: Techstars NYC puts in <b>$220K</b> (5% plus an uncapped SAFE), ERA{" "}
        <b>$150K for 6%</b>, South Park Commons <b>$400K for 7%</b> with $600K more guaranteed, and Antler commits{" "}
        <b>$500K–$1M</b>. University programs, by contrast, mostly give grants.
      </>
    ),
  },
  {
    title: "A few strong programs take nothing",
    body: (
      <>
        The <b>Grand Central Tech Residency</b> gives a year of space for zero rent and zero equity. The{" "}
        <b>FinTech Innovation Lab</b> and the <b>NYC AI Landing Pad</b> are free and non-dilutive. Betaworks Camp
        charges no fees.
      </>
    ),
  },
  {
    title: "Open to the world, but the visa is yours",
    body: (
      <>
        Techstars, Betaworks and South Park Commons take founders from anywhere.{" "}
        <b>Antler requires US work authorization</b> and the FinTech Innovation Lab states it will not sponsor visas.
        No private program in this map solves immigration.
      </>
    ),
  },
  {
    title: "The city co-produces much of the supply",
    body: (
      <>
        NYCEDC funds the <b>NYC AI Nexus</b> (C10 Labs, Plug and Play) and the{" "}
        <b>International Landing Pad Network</b> (Plug and Play, Supermomos, SOSA, The Clean Fight), and partners with
        Newlab, Company Ventures and Visible Hands on founder fellowships.
      </>
    ),
  },
  {
    title: "Studios produce the largest outcomes",
    body: (
      <>
        AlleyCorp incubated <b>MongoDB</b>, Business Insider and Gilt Groupe. Redesign Health and its portfolio have
        raised <b>over $1.5B</b> since 2018. Studios recruit founders; they do not run open cohorts.
      </>
    ),
  },
  {
    title: "International founders have a dedicated lane",
    body: (
      <>
        Five programs exist to land foreign companies: the AI Landing Pad (for companies with <b>$5M</b> in revenue or
        funding), The Clean Fight&rsquo;s landing pad, SOSA, VentureOut, and the{" "}
        <b>Italian Trade Agency&rsquo;s Global Start Up Program</b> run with gener8tor.
      </>
    ),
  },
  {
    title: "Lists go stale fast",
    body: (
      <>
        <b>URBAN-X closed</b> at the end of 2025 after 15 cohorts. <b>IndieBio NY became SOSV NY</b> in 2026.
        Entrepreneur First lists no New York program. Lair East Labs&rsquo; site has not changed since 2020.
      </>
    ),
  },
];

const ENTRY_POINTS = [
  {
    title: "Italian innovative startup, first US exposure",
    body: (
      <>
        The <b>ITA Global Start Up Program</b> placed ten Italian startups with gener8tor in New York in autumn 2025:
        six weeks, two virtual and four in person. The 2026 edition runs September to November and is free for
        registered innovative startups.
      </>
    ),
  },
  {
    title: "AI company with $5M in revenue or funding",
    body: (
      <>
        The <b>NYC AI Landing Pad</b> (Supermomos with Lightspeed) gives twelve months of coworking in Manhattan,
        mentorship and investor meetings, with no cost and no equity.
      </>
    ),
  },
  {
    title: "Early-stage team that can relocate for three months",
    body: (
      <>
        <b>Techstars NYC</b> and <b>Betaworks Camp</b> accept founders based anywhere and require in-person weeks in
        New York. <b>South Park Commons</b> runs its fellowship from a New York office.
      </>
    ),
  },
  {
    title: "Climate or energy company ready to deploy",
    body: (
      <>
        <b>The Clean Fight</b> runs an International Landing Pad cohort of ten growth-stage companies and administers
        deployment grants in New York State.
      </>
    ),
  },
  {
    title: "Fintech with a product banks can test",
    body: (
      <>
        The <b>FinTech Innovation Lab</b> puts about ten companies in front of 40+ financial institutions for twelve
        weeks. Core team must work in New York and hold US work rights.
      </>
    ),
  },
  {
    title: "A short, structured market visit",
    body: (
      <>
        <b>VentureOut</b> runs one-week sector programs and three-month US launch programs for foreign startups, often
        with a home-country government as sponsor.
      </>
    ),
  },
];

const CAVEATS = [
  "Scope: privately operated accelerators, incubators, venture studios and landing programs with a New York City program or site. Corporate and nonprofit operators are included; university and purely city-run programs are in the companion map.",
  `Status was checked on ${CHECKED} against each operator's own site or a dated release. The evidence is quoted in each row.`,
  "Five official sites could not be read during the check: Company Ventures, URBAN-X, JLABS, Plug and Play's New York page and Morgan Stanley's venture lab. Their rows rely on the secondary sources linked, or the program is left out.",
  "Left out because a New York base or program could not be confirmed from the operator's own pages: Expa, Juxtapose, Forum Ventures, Interplay, Prehype, Kairos, HearstLab and the Morgan Stanley lab.",
  "Access labels are my reading of published eligibility. “Conditions apply” covers work-authorization rules, founder-profile criteria and size thresholds.",
  "Several operators publish only global figures (Techstars, Antler, Founder Institute, IndieBio). These are marked and are not New York results.",
  "XRC's $135K figure dates from its March 2022 cohort; Lair East Labs' $50K from a site last updated in 2020.",
  "Success cases are self-reported. Attribution to a program does not mean the program caused the outcome.",
];

export default function PrivateAcceleratorMapPage() {
  return (
    <>
      <ResearchHero
        kicker="I3/NYC Research · Ecosystem brief"
        title="New York City's private accelerators, incubators and"
        titleAccent="venture studios"
        lede={
          <>
            {DESCRIPTION} It is the companion to the{" "}
            <Link href="/reports-insights-media/nyc-university-startup-map">map of university programs</Link>.
          </>
        }
        asOf={`Status checked ${CHECKED}`}
        author={{
          name: "Andrea Calcagno",
          role: "Vice Chair, Board Member & Co-Founder, I3/NYC",
          href: "https://www.linkedin.com/in/andreacalcagno/",
        }}
        kpis={KPIS}
      />

      <SectionNav sections={SECTIONS} />

      <ResearchSection
        id="findings"
        kicker="Findings"
        title="What the map shows"
        intro="Seven findings from the programs below. Every figure comes from the operator's own page or a dated release, linked in the database."
      >
        <FindingsGrid items={FINDINGS} />
      </ResearchSection>

      <ResearchSection
        id="coverage"
        kicker="Coverage"
        title="Coverage by program family and stage"
        intro="Number of mapped programs active at each stage. A program that spans stages is counted in each. Darker cells mean more programs."
      >
        <CoverageMatrix programs={P} groups={GROUPS} stages={STAGES} />
        <ChartNote>
          Reading: private supply concentrates at pre-seed and seed. Growth-stage support comes almost entirely from
          landing programs for foreign companies and from lab space.
        </ChartNote>
      </ResearchSection>

      <ResearchSection
        id="deals"
        kicker="Funding"
        title="The standard deals"
        intro="Cash a single company receives, per program, on a log scale from $10,000 to $1,000,000. A bar spans the published minimum to maximum; a short bar is a fixed amount. Every amount here is an investment, not a grant."
      >
        <FundingLadder programs={P} min={10_000} max={1_000_000} allInvestment />
        <ChartNote>
          Equity taken, where published: Techstars 5% plus an uncapped SAFE; ERA 6%; South Park Commons 7%. Antler,
          MetaProp, XRC, SOSA and Visible Hands publish amounts without a percentage. Programs with no published amount
          are omitted.
        </ChartNote>
      </ResearchSection>

      <ResearchSection
        id="cases"
        kicker="Outcomes"
        title="Success cases"
        intro="Alumni outcomes reported by the operators themselves. Global figures are marked as such."
      >
        <CasesTable cases={CASES} />
      </ResearchSection>

      <ResearchSection
        id="database"
        kicker="Database"
        title="Program database"
        intro="Pick a topic, narrow with the filters, and open a row for terms, eligibility, timing, track record, status evidence and reference links."
      >
        <ProgramDatabase
          programs={P}
          groups={GROUPS}
          stages={STAGES}
          topics={TOPICS}
          labels={LABELS}
          statusKey={STATUS_KEY}
        />
      </ResearchSection>

      <ResearchSection
        id="entry-points"
        kicker="Entry points"
        title="Entry points for international and Italian founders"
        intro="Which door fits, by the company's situation."
      >
        <CardGrid items={ENTRY_POINTS} />
      </ResearchSection>

      <ResearchSection id="method" kicker="Method" title="Method and caveats">
        <Caveats items={CAVEATS} />
      </ResearchSection>

      <ResearchDisclaimer>
        Figures are as published by each operator; confirm terms with the program before relying on them.
      </ResearchDisclaimer>
    </>
  );
}
