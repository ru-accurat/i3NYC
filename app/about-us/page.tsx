export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

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
  const raw = (await getPageData("about-us")) ?? DEFAULT_DATA;
  const data = migratePageData("about-us", raw);
  const admin = await isAdmin();

  return <PageShell slug="about-us" data={data} isAdmin={admin} />;
}
