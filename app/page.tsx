export const dynamic = "force-dynamic";

import { StatsSection } from "@/components/sections/stats-section";
import { InitiativeList } from "@/components/sections/initiative-list";
import { TeamGrid } from "@/components/sections/team-grid";
import { EventList } from "@/components/sections/event-list";
import { MembershipTiers } from "@/components/sections/membership-tiers";
import { PartnersSection } from "@/components/sections/partners-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageShell } from "@/components/editor/page-shell";
import { HomeHero } from "@/components/sections/home-hero";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const DEFAULT_DATA = {
  hero: {
    label: "Italian Innovators Initiative",
    title: "Building bridges between",
    titleAccent: "Italian innovation",
    titleSuffix: "and New York City.",
    description: "A non-profit endorsed by the Italian Consulate in New York, connecting startups, enterprises, and talent with the $2T+ NYC innovation market.",
  },
  stats: [
    { value: "$2T+", label: "NYC Metro Economy" },
    { value: "25K+", label: "Startups" },
    { value: "6K+", label: "Italian Innovators" },
    { value: "300+", label: "VC Firms" },
    { value: "$177B", label: "VC Invested" },
  ],
  initiatives: {
    label: "What We Do",
    title: "Five programs connecting Italian innovators with U.S. opportunities.",
    items: [
      { title: "Acceleration Programs", description: "Intensive training, mentorship, and investor access tailored to Italian startups and SMEs entering the U.S. market." },
      { title: "AI & Thematic Observatories", description: "Deep sector analysis covering AI, fintech, fashion tech, life sciences, climate tech, and more." },
      { title: "Corporate Orientation", description: "Market-entry strategies and investor introductions for established companies exploring NYC markets." },
      { title: "Networking & Matchmaking", description: "Flagship events, pitch sessions, and curated networking across the Italian and American innovation ecosystem." },
      { title: "Talent Dashboard", description: "A curated pool of bilingual Italian professionals eager to work in the U.S. innovation economy." },
    ],
  },
  team: {
    label: "Leadership",
    title: "Board of Directors",
    members: [
      { name: "Gianluca Galletto", role: "Executive Chair", initials: "GG" },
      { name: "Andrea Calcagno", role: "Board Member", initials: "AC" },
      { name: "Dario Calogero", role: "Board Member", initials: "DC" },
      { name: "Alessandro Piol", role: "Board Member", initials: "AP" },
    ],
  },
  events: {
    label: "Events",
    title: "Recent highlights",
    items: [
      { title: "European Tech Night", venue: "Spring Place, NYC", date: "Jun 2025", detail: "400+ attendees \u00b7 32 startups \u00b7 70% VCs & C-level" },
      { title: "Lazio Region Program", venue: "New York City", date: "Feb 2025", detail: "200+ participants \u00b7 3 roundtables \u00b7 pitch sessions" },
      { title: "Space Economy Chat", venue: "Italian Consulate", date: "Dec 2025", detail: "Col. Walter Villadei \u00b7 Italian Air Force astronaut" },
      { title: "Federico Marchetti", venue: "YOOX Net-a-Porter", date: "Sep 2025", detail: "\"The Geek of Chic\" \u00b7 co-hosted with NIAF" },
    ],
  },
  tiers: {
    label: "Membership",
    title: "Join the community shaping Italian innovation globally.",
    items: [
      { name: "Startup", price: "$500/yr", note: "Mentorship, investor access, community" },
      { name: "Individual", price: "$100/yr", note: "Events, networking, knowledge sharing" },
      { name: "Corporate", price: "By invite", note: "Priority access, strategic partnerships" },
    ],
  },
  partners: ["Italian Consulate in NY", "Fondazione Brodolini", "AIFI", "Lazio Innova", "Regione Lazio"],
  cta: {
    title: "Propel Italian innovation,",
    titleAccent: "globally.",
    primaryLabel: "Join I3/NYC",
    primaryHref: "/contact-us",
    secondaryLabel: "Get in touch",
    secondaryHref: "/contact-us",
  },
};

export default async function HomePage() {
  const data = (await getPageData("home")) ?? DEFAULT_DATA;
  const admin = await isAdmin();
  const d = data as typeof DEFAULT_DATA;

  return (
    <PageShell slug="home" data={data} isAdmin={admin}>
      <HomeHero hero={d.hero} fieldPrefix="hero" />

      <StatsSection stats={d.stats} fieldPrefix="stats" />

      <InitiativeList
        label={d.initiatives.label}
        title={d.initiatives.title}
        initiatives={d.initiatives.items}
        fieldPrefix="initiatives"
      />

      <TeamGrid
        label={d.team.label}
        title={d.team.title}
        members={d.team.members}
        fieldPrefix="team"
      />

      <EventList
        label={d.events.label}
        title={d.events.title}
        events={d.events.items}
        fieldPrefix="events"
      />

      <MembershipTiers
        label={d.tiers.label}
        title={d.tiers.title}
        tiers={d.tiers.items}
        fieldPrefix="tiers"
      />

      <PartnersSection partners={d.partners} fieldPrefix="partners" />

      <CTASection
        title={d.cta.title}
        titleAccent={d.cta.titleAccent}
        primaryLabel={d.cta.primaryLabel}
        primaryHref={d.cta.primaryHref}
        secondaryLabel={d.cta.secondaryLabel}
        secondaryHref={d.cta.secondaryHref}
        fieldPrefix="cta"
      />
    </PageShell>
  );
}
