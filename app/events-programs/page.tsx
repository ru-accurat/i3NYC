export const dynamic = "force-dynamic";

import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";
import { migratePageData } from "@/lib/migrate-page";

const DEFAULT_DATA = {
  sections: [
    {
      id: "events-hero",
      type: "hero",
      data: {
        label: "Events & Programs",
        title: "Dual-track programming for knowledge and",
        titleAccent: "community.",
        description:
          "Showcasing high-value content alongside community-driven social touchpoints. From flagship summits to monthly aperitivi, we build the bridge in person.",
      },
    },
    {
      id: "events-track-a",
      type: "event-track",
      data: {
        label: "Track A",
        title: "The Knowledge Series",
        description:
          "High-profile anchors — carefully curated events featuring educational panelists and executive networking.",
        items: [
          {
            title: "Spring Member Summit",
            venue: "Featuring Consul General Giuseppe Pastorelli",
            date: "May 11, 2026",
            detail: "\"Dominating the New York Market: The 2026 Roadmap.\"",
          },
          {
            title: "European Tech Event",
            venue: "#NYTechWeek",
            date: "Jun 5, 2026",
            detail: "Collaborative spotlight on Europe's edge.",
          },
          {
            title: "The New Codes of Luxury",
            venue: "NYC",
            date: "Oct 7, 2026",
            detail: "Digital acceleration and heritage featuring global CDOs.",
          },
          {
            title: "Applied Intelligence & Governance",
            venue: "NYC",
            date: "Dec 3, 2026",
            detail: "Flagship AI event on ethics and enterprise-grade deployment.",
          },
        ],
      },
    },
    {
      id: "events-track-b",
      type: "event-track",
      data: {
        label: "Track B",
        title: "The Aperitivo Culture",
        description:
          "Regular monthly events designed for informal relationship building. Last Wednesday/Thursday of every month, 6:00 PM – 8:30 PM.",
        items: [
          {
            title: "April Happy Hour",
            venue: "Authentic NYC enotecas",
            date: "Apr 16, 2026",
            detail: "Immersing members in genuine Italian lifestyle.",
          },
          {
            title: "May Aperitivo",
            venue: "TBA · West Village",
            date: "May 28, 2026",
            detail: "Post-Summit informal mixer for new and returning members.",
          },
          {
            title: "June Tech-Week Aperitivo",
            venue: "Tribeca · TBA",
            date: "Jun 4, 2026",
            detail: "Casual gathering during NY Tech Week.",
          },
          {
            title: "July Summer Edition",
            venue: "Rooftop · TBA",
            date: "Jul 30, 2026",
            detail: "Mid-summer aperitivo with the wider community.",
          },
        ],
      },
    },
    {
      id: "events-past",
      type: "event-track",
      data: {
        label: "Recent Highlights",
        title: "Past convenings",
        description: "A snapshot of recent gatherings that shaped the community.",
        items: [
          {
            title: "European Tech Night",
            venue: "Spring Place, NYC",
            date: "Jun 2025",
            detail: "400+ attendees · 32 startups · 70% VCs & C-level.",
          },
          {
            title: "Lazio Region Program",
            venue: "New York City",
            date: "Feb 2025",
            detail: "200+ participants · 3 roundtables · pitch sessions.",
          },
          {
            title: "Space Economy Chat",
            venue: "Italian Consulate",
            date: "Dec 2024",
            detail: "Col. Walter Villadei · Italian Air Force astronaut.",
          },
          {
            title: "Federico Marchetti",
            venue: "YOOX Net-a-Porter",
            date: "Sep 2024",
            detail: "\"The Geek of Chic\" · co-hosted with NIAF.",
          },
        ],
      },
    },
    {
      id: "events-cta",
      type: "cta",
      data: {
        title: "Join us at the next",
        titleAccent: "convening.",
        primaryLabel: "Become Member",
        primaryHref: "/membership",
        secondaryLabel: "Join the Community",
        secondaryHref: "/membership",
      },
    },
  ],
};

export default async function EventsPage() {
  const raw = (await getPageData("events-programs")) ?? DEFAULT_DATA;
  const data = migratePageData("events-programs", raw);
  const admin = await isAdmin();

  return <PageShell slug="events-programs" data={data} isAdmin={admin} />;
}
