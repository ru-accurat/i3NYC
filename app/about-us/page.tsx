import { HeroSection } from "@/components/sections/hero-section";
import { TeamGrid } from "@/components/sections/team-grid";
import { StatsSection } from "@/components/sections/stats-section";
import { PartnersSection } from "@/components/sections/partners-section";
import { ContentRenderer } from "@/components/content-renderer";

const BOARD = [
  { name: "Gianluca Galletto", role: "Executive Chair", initials: "GG" },
  { name: "Andrea Calcagno", role: "Board Member", initials: "AC" },
  { name: "Dario Calogero", role: "Board Member", initials: "DC" },
  { name: "Alessandro Piol", role: "Board Member", initials: "AP" },
];

const TEAM = [
  { name: "Gabriele Rossi", role: "Head of Innovation", initials: "GR" },
  { name: "Maria Giordano", role: "Community Manager", initials: "MG" },
  { name: "Luca Bianchi", role: "Events Lead", initials: "LB" },
  { name: "Sofia Romano", role: "Marketing", initials: "SR" },
];

const STATS = [
  { value: "$2T+", label: "NYC Metro Economy" },
  { value: "25K+", label: "Startups in NYC" },
  { value: "6K+", label: "Italian Innovators" },
  { value: "300+", label: "VC Firms" },
];

const PARTNERS = [
  "Italian Consulate in NY",
  "Fondazione Brodolini",
  "AIFI",
  "Lazio Innova",
  "Regione Lazio",
];

const MISSION_TEXT = `
## Our Mission & Vision

**Mission:** To foster a thriving ecosystem that connects Italian innovators — startups, enterprises, and professionals — with the vast opportunities in the New York City metro area and the broader U.S. market.

**Vision:** To be the premier bridge for Italian innovation on the global stage, creating lasting partnerships, accelerating growth, and empowering talent to succeed across borders.

## Why New York City?

New York City is the beating heart of global innovation. Home to over 25,000 startups, 300+ venture capital firms, and a metro economy exceeding $2 trillion, NYC offers unparalleled access to capital, talent, and markets. For Italian innovators, the city represents the most strategic entry point into the American ecosystem.
`;

export default function AboutPage() {
  return (
    <>
      <HeroSection
        label="About Us"
        title="Empowering Italian Innovation"
        titleAccent="on a Global Scale."
        description="I3/NYC is a non-profit initiative endorsed by the Italian Consulate in New York, dedicated to building bridges between Italian innovators and the vast U.S. market."
      />

      <div className="py-20 px-8">
        <ContentRenderer content={MISSION_TEXT} />
      </div>

      <StatsSection stats={STATS} />

      <TeamGrid label="Leadership" title="Board of Directors" members={BOARD} />

      <TeamGrid label="Team" title="Our Team" members={TEAM} />

      <PartnersSection partners={PARTNERS} />
    </>
  );
}
