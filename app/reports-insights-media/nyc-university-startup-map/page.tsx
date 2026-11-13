import type { Metadata } from "next";
import raw from "@/data/research/nyc-university-startup-map.json";
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
  "A map of the incubators, accelerators, venture-building programs, proof-of-concept funds and seed funds run by New York City's universities and academic medical centers: who they serve, at what stage, with how much money, on what terms, whether they are running today, and what their alumni went on to do.";

export const metadata: Metadata = {
  title: "NYC University Startup Map — I3/NYC",
  description: DESCRIPTION,
  openGraph: {
    title: "NYC University Startup Map",
    description: "How New York City universities back startups and researchers: 38 programs across 12 institutions.",
    type: "article",
  },
};

const SECTIONS = [
  { id: "findings", label: "Findings" },
  { id: "coverage", label: "Coverage" },
  { id: "funding", label: "Funding ladder" },
  { id: "cases", label: "Success cases" },
  { id: "database", label: "Program database" },
  { id: "entry-points", label: "Entry points" },
  { id: "method", label: "Method" },
];

const LABELS: ProgramMapLabels = {
  group: "Institution",
  allGroups: "All institutions",
  access: { Open: "Open to outsiders", Mixed: "Mixed / unclear", Affiliates: "Affiliates only" },
  status: { Active: "Active", Listed: "Listed", Paused: "Paused", Unconfirmed: "Unconfirmed" },
  terms: "Equity, IP and terms",
  checked: CHECKED,
};

const STATUS_KEY: Record<Status, string> = {
  Active: "dated evidence from 2025–26",
  Listed: "official page live, no recent date",
  Paused: "closed or unavailable now",
  Unconfirmed: "only older sources found",
};

const KPIS = [
  { value: String(P.length), label: "programs mapped" },
  { value: "12", label: "universities and academic medical centers" },
  { value: String(P.filter((p) => p.st === "Active").length), label: "confirmed active with 2025–26 evidence" },
  { value: String(P.filter((p) => p.a === "Open").length), label: "open to founders with no affiliation" },
  { value: "$130M", label: "largest single commitment (Columbia + Deerfield)" },
];

const FINDINGS = [
  {
    title: "The serious money sits in life sciences proof-of-concept",
    body: (
      <>
        Columbia&rsquo;s Lab-to-Market network has made <b>437 cash awards worth $62.5M</b>, and its Deerfield
        partnership commits <b>up to $130M over ten years</b>. Rockefeller started its therapeutic fund with $25M and
        Mount Sinai seeded its i3 Accelerator with $10M. Nothing comparable exists for software.
      </>
    ),
  },
  {
    title: "Most doors require a university badge",
    body: (
      <>
        Programs fund their own students, faculty and alumni. A minority accept founders with no affiliation:{" "}
        <b>Endless Frontier Labs, Runway, Tandon Future Labs, Elementa Labs, MSK&rsquo;s iHub</b> and the lab-space
        incubators.
      </>
    ),
  },
  {
    title: "Non-dilutive is the default",
    body: (
      <>
        Grants and prizes dominate. Published equity terms appear in four places: Cornell Tech&rsquo;s Runway (a{" "}
        <b>$175K SAFE at a $3M cap</b>), Columbia&rsquo;s Lang Fund (a convertible note), the NYU Innovation Venture
        Fund and the NYU Langone Health Venture Fund.
      </>
    ),
  },
  {
    title: "Researchers follow one standard path: NSF I-Corps",
    body: (
      <>
        CUNY leads the regional hub with Columbia and NYU, on a <b>$15M award that ends December 31, 2026</b>. NYU
        packages the path into a ladder worth up to <b>$102K</b> per team.
      </>
    ),
  },
  {
    title: "The track record is real, and concentrated",
    body: (
      <>
        Endless Frontier Labs graduates have raised <b>$3.20B</b>. Cornell Tech startups have raised{" "}
        <b>over $500M</b> and are valued above $1.3B. Tandon Future Labs counts <b>40 acquisitions worth $940M+</b>.
      </>
    ),
  },
  {
    title: "Programs get renamed more often than they close",
    body: (
      <>
        Weill Cornell&rsquo;s Daedalus Fund became the <b>Enterprise Innovation Catalyst Fund</b> in spring 2025.
        Rockefeller&rsquo;s Robertson fund is now carried by the <b>Black family</b> gift of 2024. Mount Sinai&rsquo;s
        i3 Genesis track is unavailable.
      </>
    ),
  },
  {
    title: "Two public levers are shut for now",
    body: (
      <>
        <b>START-UP NY</b> closed to new applicants on January 1, 2026. <b>IN2NYC</b>, the CUNY visa route for
        international entrepreneurs, lists applications as closed with no reopening date.
      </>
    ),
  },
];

const ENTRY_POINTS = [
  {
    title: "Science and deep-tech startups, already incorporated",
    body: (
      <>
        <b>Endless Frontier Labs</b> (NYU Stern) admits startups from anywhere, takes no equity and charges no fees.
        The CEO attends five meeting days over nine months, two of them in person in New York. Applications run
        mid-May to end of July.
      </>
    ),
  },
  {
    title: "Recent PhDs who want to found in New York",
    body: (
      <>
        <b>Runway</b> (Cornell Tech) recruits PhD founders from universities worldwide and gives salary, research
        budget, housing allowance and space for 12 to 24 months, against a SAFE.
      </>
    ),
  },
  {
    title: "Digital health startups seeking a US hospital partner",
    body: (
      <>
        <b>Elementa Labs</b> (Mount Sinai) runs 12-week cohorts for pre-seed and seed companies; over a third of
        applicants are international. <b>MSK&rsquo;s iHub Challenge</b> runs three-month cohorts with Memorial Sloan
        Kettering teams. Neither provides cash.
      </>
    ),
  },
  {
    title: "AI, data, climate and urban-tech startups",
    body: (
      <>
        <b>NYU Tandon Future Labs</b> in Downtown Brooklyn runs sector incubators and hosts programs with foreign
        partners, including Innovate UK&rsquo;s global incubator programme.
      </>
    ),
  },
  {
    title: "Biotech teams that need a bench",
    body: (
      <>
        <b>BioLabs@NYULangone</b> in Manhattan, the <b>Einstein</b> incubator in the Bronx and{" "}
        <b>SUNY Downstate</b>&rsquo;s incubator and BioBAT in Brooklyn rent wet-lab space to early-stage companies.
      </>
    ),
  },
  {
    title: "A visa route that is closed for now",
    body: (
      <>
        <b>IN2NYC</b> pairs an international entrepreneur with a partner school so the founder can qualify for a
        cap-exempt H-1B visa. NYCEDC lists applications as closed and says future rounds will be advertised.
      </>
    ),
  },
];

const CAVEATS = [
  "Scope: programs run by, or housed at, universities and academic medical centers in the five boroughs. City-run programs and private accelerators are excluded.",
  `Status was checked on ${CHECKED} against each program's own page or a dated university release. The evidence is quoted in each row.`,
  "“Listed” means the official page is live but shows no 2025–26 date. “Unconfirmed” means I found only older sources: BioLabs@NYULangone (2019), Tri-I TDI (2020), Pace (2018) and the Weill business plan challenge (2019).",
  "Three official sites could not be opened during the check: the NY I-Corps Hub site, the IN2NYC site and the BioLabs site. Their rows rely on NSF, NYCEDC and NYU Langone pages instead.",
  "Access labels are my reading of published eligibility. “Mixed” means affiliates lead but outsiders can join a team, or the page states no rule.",
  "Success cases are self-reported by programs. Attribution to a program does not mean the program caused the outcome.",
  "Check sizes are not published for the NYU Innovation Venture Fund, the NYU Langone funds, the Weill Catalyst Fund, MSK's fund and i3 Accelerator projects.",
  "BiomedX's average award (about $74K) is my division of $6M by 81 awards, not a published figure.",
  "Not covered for lack of a verifiable source: Yeshiva, Pratt, FIT and St. John's programs.",
];

export default function UniversityStartupMapPage() {
  return (
    <>
      <ResearchHero
        kicker="I3/NYC Research · Ecosystem brief"
        title="How New York City universities back"
        titleAccent="startups and researchers"
        lede={DESCRIPTION}
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
        intro="Seven findings from the programs below. Every figure comes from the program's own page or a university release, linked in the database."
      >
        <FindingsGrid items={FINDINGS} />
      </ResearchSection>

      <ResearchSection
        id="coverage"
        kicker="Coverage"
        title="Coverage by institution and stage"
        intro="Number of mapped programs active at each stage. A program that spans stages is counted in each. Darker cells mean more programs."
      >
        <CoverageMatrix programs={P} groups={GROUPS} stages={STAGES} />
        <ChartNote>
          Reading: support is dense from research through pre-seed and thins out at seed. Only Endless Frontier Labs,
          which admits startups up to Series A, and BioBAT&rsquo;s space for more mature biotech companies reach the
          growth stage.
        </ChartNote>
      </ResearchSection>

      <ResearchSection
        id="funding"
        kicker="Funding"
        title="The funding ladder"
        intro="Money available to a single team, per program, on a log scale from $500 to $500,000. A bar spans the published minimum to maximum; a short bar is a fixed amount."
      >
        <FundingLadder programs={P} min={500} max={500_000} />
        <ChartNote>
          Fund-level commitments (Hudson Heights $130M, Rockefeller $25M, i3 Accelerator $10M) are pools, not per-team
          checks, and are left off. Funds with no published check size, and prizes last evidenced before 2020, are also
          omitted.
        </ChartNote>
      </ResearchSection>

      <ResearchSection
        id="cases"
        kicker="Outcomes"
        title="Success cases"
        intro="Alumni outcomes reported by the programs themselves or by university releases. Amounts are as published at the date shown."
      >
        <CasesTable cases={CASES} />
      </ResearchSection>

      <ResearchSection
        id="database"
        kicker="Database"
        title="Program database"
        intro="Pick a topic, narrow with the filters, and open a row for eligibility, terms, timing, track record, status evidence and reference links."
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
        title="Entry points for international founders and researchers"
        intro="The programs that do not require a New York university affiliation, by what they are good for."
      >
        <CardGrid items={ENTRY_POINTS} />
      </ResearchSection>

      <ResearchSection id="method" kicker="Method" title="Method and caveats">
        <Caveats items={CAVEATS} />
      </ResearchSection>

      <ResearchDisclaimer>
        Figures are as published by each institution; confirm terms with the program before relying on them.
      </ResearchDisclaimer>
    </>
  );
}
