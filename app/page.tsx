export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

const DEFAULT_DATA = {
  sections: [
    {
      id: "home-hero",
      type: "home-hero",
      data: {
        label: "Italian Innovators Initiative",
        title: "Scaling the Bridge:",
        titleAccent: "The Premier Hub for Italian Innovation",
        titleSuffix: "in the NYC Metro Area.",
        description:
          "Bridging Italian excellence with the global tech, finance, and academic powerhouses of New York City.",
      },
    },
    {
      id: "home-stats",
      type: "stats",
      data: {
        items: [
          { value: "$2T+", label: "NY Metro economy" },
          { value: "25K+", label: "Startups valued at $700B" },
          { value: "6K+", label: "Italian innovators in NY" },
          { value: "300+", label: "Venture capital firms" },
          { value: "$177B", label: "VC invested 2019–Q1 2025" },
        ],
      },
    },
    {
      id: "home-pillars",
      type: "strategic-pillars",
      data: {
        label: "Value Proposition",
        title: "The 4 Strategic Pillars",
        items: [
          {
            title: "Knowledge-First Exchange",
            description:
              "Shifting from passive networking to providing actionable market intelligence.",
          },
          {
            title: "Institutional Integration",
            description:
              "Deep structural partnership with the Italian Consulate General in New York, serving as the operational engine for innovation mandates.",
          },
          {
            title: "Community Consolidation",
            description:
              "Fostering the local ecosystem through sustained engagement and networking.",
          },
          {
            title: "Charter Member Foundation",
            description:
              "An invitation-only circle of senior leaders and mentors shaping the vision and character of our initiatives.",
          },
        ],
      },
    },
    {
      id: "home-spotlight",
      type: "event-spotlight",
      data: {
        label: "Active Event",
        title: "Don't miss what's next.",
        eventTitle: "Spring Member Summit: Dominating the New York Market — The 2026 Roadmap.",
        date: "May 11, 2026",
        venue: "Featuring the official welcome of Consul General Giuseppe Pastorelli",
        description:
          "Our flagship spring convening on positioning Italian innovation across NYC's tech, finance, and academic ecosystems.",
        ctaLabel: "RSVP",
        ctaHref: "https://luma.com/as9d6tor",
      },
    },
    {
      id: "home-cta",
      type: "cta",
      data: {
        title: "Become part of the operational engine for",
        titleAccent: "Italian innovation in NYC.",
        primaryLabel: "Become Member",
        primaryHref: "/membership",
        secondaryLabel: "Explore upcoming events",
        secondaryHref: "/events-programs",
      },
    },
  ],
};

export default async function HomePage() {
  const raw = (await getPageData("home")) ?? DEFAULT_DATA;
  const data = migratePageData("home", raw);
  const admin = await isAdmin();

  return <PageShell slug="home" data={data} isAdmin={admin} />;
}
