export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { TeamGrid } from "@/components/sections/team-grid";
import { StatsSection } from "@/components/sections/stats-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const DEFAULT_DATA = {
  hero: {
    label: "About Us",
    title: "Empowering Italian Innovation",
    titleAccent: "on a Global Scale.",
    description: "I3/NYC is a non-profit initiative endorsed by the Italian Consulate in New York, dedicated to building bridges between Italian innovators and the vast U.S. market.",
  },
  stats: [
    { value: "$2T+", label: "NYC Metro Economy" },
    { value: "25K+", label: "Startups in NYC" },
    { value: "6K+", label: "Italian Innovators" },
    { value: "300+", label: "VC Firms" },
  ],
  board: {
    label: "Leadership",
    title: "Board of Directors",
    members: [
      { name: "Gianluca Galletto", role: "Executive Chair", initials: "GG" },
      { name: "Andrea Calcagno", role: "Board Member", initials: "AC" },
      { name: "Dario Calogero", role: "Board Member", initials: "DC" },
      { name: "Alessandro Piol", role: "Board Member", initials: "AP" },
    ],
  },
  team: {
    label: "Team",
    title: "Our Team",
    members: [
      { name: "Gabriele Rossi", role: "Head of Innovation", initials: "GR" },
      { name: "Maria Giordano", role: "Community Manager", initials: "MG" },
      { name: "Luca Bianchi", role: "Events Lead", initials: "LB" },
      { name: "Sofia Romano", role: "Marketing", initials: "SR" },
    ],
  },
  partners: ["Italian Consulate in NY", "Fondazione Brodolini", "AIFI", "Lazio Innova", "Regione Lazio"],
};

export default async function AboutPage() {
  const data = (await getPageData("about-us")) ?? DEFAULT_DATA;
  const admin = await isAdmin();
  const d = data as typeof DEFAULT_DATA;

  return (
    <PageShell slug="about-us" data={data} isAdmin={admin}>
      <HeroSection
        label={d.hero.label}
        title={d.hero.title}
        titleAccent={d.hero.titleAccent}
        description={d.hero.description}
        fieldPrefix="hero"
      />
      <StatsSection stats={d.stats} fieldPrefix="stats" />
      <TeamGrid label={d.board.label} title={d.board.title} members={d.board.members} fieldPrefix="board" />
      <TeamGrid label={d.team.label} title={d.team.title} members={d.team.members} fieldPrefix="team" />
      <PartnersSection partners={d.partners} fieldPrefix="partners" />
    </PageShell>
  );
}
