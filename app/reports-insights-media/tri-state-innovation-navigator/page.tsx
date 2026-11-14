import type { Metadata } from "next";
import raw from "@/data/research/tri-state-innovation-navigator.json";
import type { NavigatorData } from "@/lib/research/navigator";
import { ResearchDisclaimer, ResearchHero, ResearchSection } from "@/components/research/research-layout";
import { SectionNav } from "@/components/research/section-nav";
import { NavigatorProvider } from "@/components/research/navigator-provider";
import { NavigatorFinder } from "@/components/research/navigator-finder";
import { NavigatorExplorer } from "@/components/research/navigator-explorer";
import {
  NavigatorCalendar,
  NavigatorPath,
  NavigatorRules,
  type PathStep,
  type RuleCard,
} from "@/components/research/navigator-sections";
import { NavigatorContact } from "@/components/research/navigator-contact";

const data = raw as unknown as NavigatorData;
const { PROGRAMS, EVENTS } = data;

/** Date the programs were compiled; the calendar marks earlier events as past. */
const AS_OF_ISO = "2026-10-15";
const AS_OF = "October 15, 2026";

const DESCRIPTION =
  "Programs, funding and soft-landing routes across New York, New Jersey and Connecticut for Italian founders, scale-ups, corporates and investors. Answer three questions to see where to start, then explore every program with its eligibility and application link.";

export const metadata: Metadata = {
  title: "Tri-State Innovation Navigator — I3/NYC",
  description: DESCRIPTION,
  openGraph: {
    title: "Tri-State Innovation Navigator",
    description: `${PROGRAMS.length} programs, funding and soft-landing routes across New York, New Jersey and Connecticut for Italian founders, scale-ups, corporates and investors.`,
    type: "article",
  },
};

const SECTIONS = [
  { id: "finder", label: "Find your path" },
  { id: "explorer", label: "All programs" },
  { id: "rules", label: "2026 rule changes" },
  { id: "calendar", label: "Calendar" },
  { id: "path", label: "Landing in 7 steps" },
  { id: "contact", label: "Talk to I3/NYC" },
];

const inRegions = (...regions: string[]) => String(PROGRAMS.filter((p) => regions.includes(p.r)).length);

const KPIS = [
  { value: String(PROGRAMS.length), label: "programs, funding and soft-landing routes" },
  { value: inRegions("nyc", "nys", "li"), label: "New York (City, State and Long Island)" },
  { value: inRegions("nj"), label: "New Jersey" },
  { value: inRegions("ct"), label: "Connecticut" },
  { value: inRegions("us", "it"), label: "Federal (US) and Italy" },
];

const RULES: RuleCard[] = [
  {
    title: "SBA loans: closed to foreign owners",
    body: "Since March 1, 2026, SBA 7(a) and 504 loans require 100% ownership by US citizens living in the US. Italian-owned companies are not eligible.",
  },
  {
    title: "SBIR/STTR: stricter screening",
    body: "Reauthorized on April 13, 2026 through September 30, 2031, with new foreign-ownership and foreign-ties review. Only majority-US-owned companies qualify.",
  },
  {
    title: "H-1B: $100,000 fee",
    body: "New petitions for workers outside the US carry a $100,000 fee since September 21, 2025 (under litigation). Early-stage hiring from Italy becomes costly.",
  },
  {
    title: "E-2 and O-1: the founder routes",
    body: "Italy is an E-2 treaty country (applications through the US Embassy in Rome, allow about 3 months). O-1A has no cap and suits founders with awards, press or funding.",
    good: true,
  },
];

const STEPS: PathStep[] = [
  {
    when: "Month 0–1",
    title: "Readiness check",
    body: "Test the US thesis, confirm revenue or capital, and choose the executive who will relocate. Landing pads ask for about $5M revenue or capital to hire 5+ locally.",
  },
  {
    when: "Month 1–2",
    title: "Italian financing",
    body: "Apply to SIMEST Misura Stati Uniti. Startups add the ICE Global Start Up Program in its May call.",
  },
  {
    when: "Month 1–2",
    title: "Pick the state",
    body: "Meet NYCEDC, NJEDA or Connecticut Innovations. Compare incentives, talent and where your first customers sit.",
  },
  {
    when: "Month 2–4",
    title: "Apply to a program",
    body: "Landing pad, accelerator or pilot. Bring a local hiring plan, pilot targets and proof of capital.",
  },
  {
    when: "Month 2–5",
    title: "Entity and visas",
    body: "Incorporate the US subsidiary, open banking, and file E-2 in Rome or O-1. Register for state taxes.",
  },
  {
    when: "Month 5–9",
    title: "Land",
    body: "Start the cohort, sign a lease, and file relocation tax credits inside their deadlines. Hire first local staff.",
  },
  {
    when: "Month 9+",
    title: "Scale",
    body: "Raise a US round with state co-investment, use job-creation credits and turn pilots into contracts.",
  },
];

export default function TriStateInnovationNavigatorPage() {
  return (
    <>
      <ResearchHero
        kicker="I3/NYC Research · Free public resource"
        title="The Tri-State"
        titleAccent="Innovation Navigator"
        lede={
          <>
            Programs, funding and soft-landing routes across{" "}
            <strong className="font-normal text-foreground">New York, New Jersey and Connecticut</strong> for Italian
            founders, scale-ups, corporates and investors. Answer three questions to see where to start, then explore
            every program with its eligibility and application link.
          </>
        }
        asOf={`Updated ${AS_OF}`}
        kpis={KPIS}
      />

      <SectionNav sections={SECTIONS} />

      <NavigatorProvider data={data}>
        <ResearchSection
          id="finder"
          kicker="Pathway finder"
          title="Where should your company start?"
          intro="Pick one answer per question. The best-matching programs update instantly; open programs rank ahead of upcoming ones."
        >
          <NavigatorFinder />
        </ResearchSection>

        <ResearchSection
          id="explorer"
          kicker="Program explorer"
          title="Every program, one place"
          intro="Filter by region, type of support and status. Save programs to a shortlist you can copy into an email or a board memo."
        >
          <NavigatorExplorer />
        </ResearchSection>
      </NavigatorProvider>

      <ResearchSection
        id="rules"
        kicker="What changed in 2026"
        title="Four rules every Italian company should know"
        intro="Federal changes in 2025–26 closed some doors to foreign-owned firms and opened others. Plan the entity and the cap table before you apply."
      >
        <NavigatorRules rules={RULES} />
      </ResearchSection>

      <ResearchSection
        id="calendar"
        kicker="Calendar · Oct 2026 – Jul 2027"
        title="Dates to plan around"
        intro="Cohort programs open for a few weeks a year. Missing a window usually costs six to twelve months."
      >
        <NavigatorCalendar events={EVENTS} asOf={AS_OF_ISO} />
      </ResearchSection>

      <ResearchSection
        id="path"
        kicker="Landing in 7 steps"
        title="From Italy to an operating Tri-State presence"
        intro="A prepared company typically needs six to nine months. Run Italian financing and US program applications in parallel."
      >
        <NavigatorPath steps={STEPS} />
      </ResearchSection>

      <ResearchSection
        id="contact"
        kicker="Talk to I3/NYC"
        title="Not sure which door is yours?"
        intro="I3/NYC is a New York nonprofit endorsed by the Consulate General of Italy in New York. We connect Italian founders, companies and institutions with the Tri-State innovation ecosystem and can point you to the right program and people."
      >
        <NavigatorContact email="info@i3nyc.org" />
      </ResearchSection>

      <ResearchDisclaimer>
        Information compiled by I3/NYC from official program pages as of {AS_OF}, for educational purposes. Programs
        change often: always confirm eligibility, amounts and deadlines with the program operator before applying. This
        page is not legal, tax or immigration advice.
      </ResearchDisclaimer>
    </>
  );
}
