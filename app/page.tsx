export const dynamic = "force-dynamic";

import { StatsSection } from "@/components/sections/stats-section";
import { InitiativeList } from "@/components/sections/initiative-list";
import { TeamGrid } from "@/components/sections/team-grid";
import { EventList } from "@/components/sections/event-list";
import { MembershipTiers } from "@/components/sections/membership-tiers";
import { PartnersSection } from "@/components/sections/partners-section";
import { CTASection } from "@/components/sections/cta-section";
import { EditableContent } from "@/components/editable-content";
import { getPageContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const STATS = [
  { value: "$2T+", label: "NYC Metro Economy" },
  { value: "25K+", label: "Startups" },
  { value: "6K+", label: "Italian Innovators" },
  { value: "300+", label: "VC Firms" },
  { value: "$177B", label: "VC Invested" },
];

const INITIATIVES = [
  {
    title: "Acceleration Programs",
    description:
      "Intensive training, mentorship, and investor access tailored to Italian startups and SMEs entering the U.S. market.",
  },
  {
    title: "AI & Thematic Observatories",
    description:
      "Deep sector analysis covering AI, fintech, fashion tech, life sciences, climate tech, and more.",
  },
  {
    title: "Corporate Orientation",
    description:
      "Market-entry strategies and investor introductions for established companies exploring NYC markets.",
  },
  {
    title: "Networking & Matchmaking",
    description:
      "Flagship events, pitch sessions, and curated networking across the Italian and American innovation ecosystem.",
  },
  {
    title: "Talent Dashboard",
    description:
      "A curated pool of bilingual Italian professionals eager to work in the U.S. innovation economy.",
  },
];

const TEAM = [
  { name: "Gianluca Galletto", role: "Executive Chair", initials: "GG" },
  { name: "Andrea Calcagno", role: "Board Member", initials: "AC" },
  { name: "Dario Calogero", role: "Board Member", initials: "DC" },
  { name: "Alessandro Piol", role: "Board Member", initials: "AP" },
];

const EVENTS = [
  {
    title: "European Tech Night",
    venue: "Spring Place, NYC",
    date: "Jun 2025",
    detail: "400+ attendees \u00b7 32 startups \u00b7 70% VCs & C-level",
  },
  {
    title: "Lazio Region Program",
    venue: "New York City",
    date: "Feb 2025",
    detail: "200+ participants \u00b7 3 roundtables \u00b7 pitch sessions",
  },
  {
    title: "Space Economy Chat",
    venue: "Italian Consulate",
    date: "Dec 2025",
    detail: "Col. Walter Villadei \u00b7 Italian Air Force astronaut",
  },
  {
    title: "Federico Marchetti",
    venue: "YOOX Net-a-Porter",
    date: "Sep 2025",
    detail: '"The Geek of Chic" \u00b7 co-hosted with NIAF',
  },
];

const TIERS = [
  { name: "Startup", price: "$500/yr", note: "Mentorship, investor access, community" },
  { name: "Individual", price: "$100/yr", note: "Events, networking, knowledge sharing" },
  { name: "Corporate", price: "By invite", note: "Priority access, strategic partnerships" },
];

const PARTNERS = [
  "Italian Consulate in NY",
  "Fondazione Brodolini",
  "AIFI",
  "Lazio Innova",
  "Regione Lazio",
];

export default async function HomePage() {
  const content = await getPageContent("home");
  const admin = await isAdmin();

  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[calc(100svh-5rem)] flex-col items-start justify-center px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm tracking-wide text-primary">
            Italian Innovators Initiative
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-light leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            Building bridges between{" "}
            <span className="whitespace-nowrap text-primary">
              Italian innovation
            </span>{" "}
            and <span className="whitespace-nowrap">New York City.</span>
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            A non-profit endorsed by the Italian Consulate in New York,
            connecting startups, enterprises, and talent with the $2T+ NYC
            innovation market.
          </p>
        </div>
      </section>

      <EditableContent
        slug="home"
        rawContent={content?.raw ?? ""}
        body={content?.body ?? ""}
        isAdmin={admin}
      />

      <StatsSection stats={STATS} />

      <InitiativeList
        label="What We Do"
        title="Five programs connecting Italian innovators with U.S. opportunities."
        initiatives={INITIATIVES}
      />

      <TeamGrid label="Leadership" title="Board of Directors" members={TEAM} />

      <EventList label="Events" title="Recent highlights" events={EVENTS} />

      <MembershipTiers
        label="Membership"
        title="Join the community shaping Italian innovation globally."
        tiers={TIERS}
      />

      <PartnersSection partners={PARTNERS} />

      <CTASection
        title="Propel Italian innovation,"
        titleAccent="globally."
        primaryLabel="Join I3/NYC"
        primaryHref="/contact-us"
        secondaryLabel="Get in touch"
        secondaryHref="/contact-us"
      />
    </>
  );
}
