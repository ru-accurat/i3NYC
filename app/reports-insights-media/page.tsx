export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

const DEFAULT_DATA = {
  sections: [
    {
      id: "reports-hero",
      type: "hero",
      data: {
        label: "Knowledge Hub",
        title: "Reports, Insights &",
        titleAccent: "Media.",
        description:
          "I3/NYC as a trusted source for innovation intelligence — converting NYC ecosystem trends into practical insights for Italian founders and professionals.",
      },
    },
    {
      id: "reports-hub",
      type: "knowledge-hub",
      data: {
        label: "Research",
        title: "Explore the knowledge hub.",
        items: [
          {
            type: "navigator",
            title: "Tri-State Innovation Navigator",
            description:
              "Programs, funding and soft-landing routes across New York, New Jersey and Connecticut. Answer three questions to see where to start.",
            href: "/reports-insights-media/tri-state-innovation-navigator",
          },
          {
            type: "map",
            title: "NYC University Startup Map",
            description:
              "38 incubators, accelerators and funds run by New York City's universities: who they serve, at what stage, with how much money and on what terms.",
            href: "/reports-insights-media/nyc-university-startup-map",
          },
          {
            type: "map",
            title: "NYC Private Accelerator Map",
            description:
              "31 private accelerators, incubators and venture studios in New York City: what each invests and takes, and who can get in.",
            href: "/reports-insights-media/nyc-private-accelerator-map",
          },
          {
            type: "census",
            title: "NYC AI Company Census",
            description:
              "150 AI and physical AI companies based in the five boroughs: what they sell, whose models they run on, funding, scale and footprint.",
            href: "/reports-insights-media/nyc-ai-company-census",
          },
          {
            type: "census",
            title: "Italy AI Company Census",
            description:
              "74 AI and physical AI companies headquartered in Italy. The companion to the New York census.",
            href: "/reports-insights-media/italy-ai-company-census",
          },
          {
            type: "brief",
            title: "NY Metro Life Sciences",
            description:
              "141 companies, 42 incubators and programs, and 22 research institutions across the New York metro area.",
            href: "/reports-insights-media/ny-metro-life-sciences",
          },
          {
            type: "brief",
            title: "NY Fashion & Luxury Innovation",
            description:
              "69 innovation companies, 34 programs and investors, and 10 schools reinventing fashion, luxury, beauty and jewelry in New York.",
            href: "/reports-insights-media/ny-fashion-luxury-innovation",
          },
          {
            type: "white-paper",
            title: "Innovation & Tech Report · March 2026",
            description:
              "A data-driven analysis of 1,473 Italian and Italian-American innovation and technology professionals across the TriState area.",
            href: "/reports-insights-media/innovation-tech-march-2026",
          },
        ],
      },
    },
    {
      id: "reports-follow",
      type: "knowledge-hub",
      data: {
        label: "Stay connected",
        title: "Follow the work.",
        items: [
          {
            type: "newsletter",
            title: "Innovation Intelligence in Your Inbox",
            description:
              "Monthly deep-dives feeding our weekly LinkedIn posts. Subscribe for the latest from the bridge.",
            href: "",
          },
          {
            type: "social",
            title: "Follow us on LinkedIn",
            description:
              "Real-time engagement and professional network growth across the Italian innovation community.",
            href: "https://www.linkedin.com/company/i3-italian-innovators-initiative",
          },
        ],
      },
    },
    {
      id: "reports-spotlights",
      type: "member-spotlight",
      data: {
        label: "Member Spotlight",
        title: "Italian founders and academics shaping NYC.",
        description:
          "Structured exposure for the members contributing to the city's innovation excellence.",
        items: [],
      },
    },
    {
      id: "reports-cta",
      type: "cta",
      data: {
        title: "Stay close to the",
        titleAccent: "knowledge flow.",
        primaryLabel: "Become Member",
        primaryHref: "https://www.zeffy.com/en-US/ticketing/i-cubednyc-italian-innovators-initiative-inc-memberships--2026",
        secondaryLabel: "Join the Community",
        secondaryHref: "/events-programs",
      },
    },
  ],
};

export default async function ReportsPage() {
  const raw = (await getPageData("reports-insights-media")) ?? DEFAULT_DATA;
  const data = migratePageData("reports-insights-media", raw);
  const admin = await isAdmin();

  return (
    <PageShell slug="reports-insights-media" data={data} isAdmin={admin} />
  );
}
