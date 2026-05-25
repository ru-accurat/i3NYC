export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

const DEFAULT_DATA = {
  sections: [
    {
      id: "about-hero",
      type: "hero",
      data: {
        label: "About Us",
        title: "Mission &",
        titleAccent: "Governance.",
        description:
          "Building foundational credibility as a 501(c)(3) organization (approval pending), achieving a 300-member critical mass, and serving as the operational engine for Italian innovation in NYC.",
      },
    },
    {
      id: "about-mission",
      type: "initiative-list",
      data: {
        label: "Our Mission & Strategy",
        title: "Consolidating I3/NYC as the premier innovation hub in the NYC Metro Area.",
        items: [
          {
            title: "Mission",
            description:
              "To consolidate I3/NYC as a compliant and highly effective organization dedicated to educational and scientific objectives as the premier innovation hub in the NYC Metro Area.",
          },
          {
            title: "Strategy Vision",
            description:
              "Creating a strong, enduring foundation for the community by facilitating a continuous flow of innovation and knowledge between Italy and the US.",
          },
        ],
      },
    },
    {
      id: "about-board",
      type: "team-grid",
      data: {
        label: "Leadership",
        title: "Board of Directors",
        members: [
          { name: "Gianluca Galletto", role: "Chair", initials: "GG", portfolio: "" },
          { name: "Andrea Calcagno", role: "Vice Chair", initials: "AC", portfolio: "" },
          { name: "Alessandro Piol", role: "Secretary", initials: "AP", portfolio: "" },
          { name: "Giacomo Iammarrone", role: "Treasurer", initials: "GI", portfolio: "" },
          { name: "Dario Calogero", role: "Board Member", initials: "DC", portfolio: "" },
          { name: "Gabriele Rossi", role: "Board Member", initials: "GR", portfolio: "" },
          { name: "Alice Biagini", role: "Board Member", initials: "AB", portfolio: "" },
        ],
      },
    },
    {
      id: "about-committee",
      type: "team-grid",
      data: {
        label: "Operating Committee",
        title: "Day-to-day leadership across marketing, community, and member relations.",
        members: [
          { name: "Gianluca Galletto", role: "Strategy & Institutional Relationship", initials: "GG", portfolio: "" },
          { name: "Andrea Calcagno", role: "Operations & Innovation Insights", initials: "AC", portfolio: "" },
          { name: "Alessandro Piol", role: "VC Ecosystem & Charter Member Lead", initials: "AP", portfolio: "" },
          { name: "Dario Calogero", role: "Italian Ecosystem", initials: "DC", portfolio: "" },
          { name: "Gabriele Rossi", role: "Programs & Innovation Design", initials: "GR", portfolio: "" },
          { name: "Giovanni Iammarrone", role: "Finance & Compliance", initials: "GI", portfolio: "" },
          { name: "Elena Briola", role: "Marketing", initials: "EB", portfolio: "" },
          { name: "Matilde Iasi", role: "Events & Community Lead", initials: "MI", portfolio: "" },
          { name: "Andrea De Castiglioni", role: "Events & Sponsor Lead", initials: "AD", portfolio: "" },
        ],
      },
    },
    {
      id: "about-cta",
      type: "cta",
      data: {
        title: "Help us scale the bridge.",
        titleAccent: "Become a member.",
        primaryLabel: "Become Member",
        primaryHref: "/membership",
        secondaryLabel: "Join the Community",
        secondaryHref: "/events-programs",
      },
    },
  ],
};

export default async function AboutPage() {
  const raw = (await getPageData("about-us")) ?? DEFAULT_DATA;
  const data = migratePageData("about-us", raw);
  const admin = await isAdmin();

  return <PageShell slug="about-us" data={data} isAdmin={admin} />;
}
