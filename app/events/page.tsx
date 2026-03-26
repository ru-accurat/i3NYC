export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { EventList } from "@/components/sections/event-list";
import { CTASection } from "@/components/sections/cta-section";
import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const DEFAULT_DATA = {
  hero: {
    label: "Events",
    title: "Where Italian innovation meets",
    titleAccent: "New York.",
    description: "From intimate roundtables to large-scale conferences, our events create meaningful connections between Italian innovators and the U.S. ecosystem.",
  },
  upcoming: {
    label: "Upcoming",
    title: "Next on the calendar",
    items: [
      { title: "European Tech Night 2025", venue: "Spring Place, NYC", date: "Jun 2025", detail: "Flagship annual event \u00b7 400+ expected attendees" },
    ],
  },
  past: {
    label: "Past Events",
    title: "Recent highlights",
    items: [
      { title: "Lazio Region Program", venue: "New York City", date: "Feb 2025", detail: "200+ participants \u00b7 3 roundtables \u00b7 pitch sessions" },
      { title: "Space Economy Chat", venue: "Italian Consulate", date: "Dec 2024", detail: "Col. Walter Villadei \u00b7 Italian Air Force astronaut" },
      { title: "Federico Marchetti", venue: "YOOX Net-a-Porter", date: "Sep 2024", detail: "\"The Geek of Chic\" \u00b7 co-hosted with NIAF" },
      { title: "Innovation Night #3", venue: "Spring Studios, NYC", date: "Jun 2024", detail: "32 startups \u00b7 70% VCs & C-level \u00b7 300+ attendees" },
      { title: "AI Observatory Launch", venue: "Italian Consulate", date: "Mar 2024", detail: "Inaugural AI sector report \u00b7 panel discussion" },
    ],
  },
  cta: {
    title: "Don't miss the next one.",
    primaryLabel: "Join I3/NYC",
    primaryHref: "/contact-us",
    secondaryLabel: "Become a member",
    secondaryHref: "/membership",
  },
};

export default async function EventsPage() {
  const data = (await getPageData("events")) ?? DEFAULT_DATA;
  const admin = await isAdmin();
  const d = data as typeof DEFAULT_DATA;

  return (
    <PageShell slug="events" data={data} isAdmin={admin}>
      <HeroSection
        label={d.hero.label}
        title={d.hero.title}
        titleAccent={d.hero.titleAccent}
        description={d.hero.description}
        fieldPrefix="hero"
      />
      <EventList
        label={d.upcoming.label}
        title={d.upcoming.title}
        events={d.upcoming.items}
        fieldPrefix="upcoming"
      />
      <EventList
        label={d.past.label}
        title={d.past.title}
        events={d.past.items}
        fieldPrefix="past"
      />
      <CTASection
        title={d.cta.title}
        primaryLabel={d.cta.primaryLabel}
        primaryHref={d.cta.primaryHref}
        secondaryLabel={d.cta.secondaryLabel}
        secondaryHref={d.cta.secondaryHref}
        fieldPrefix="cta"
      />
    </PageShell>
  );
}
