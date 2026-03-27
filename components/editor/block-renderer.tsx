"use client";

import type { Section } from "@/lib/sections";
import { HeroSection } from "@/components/sections/hero-section";
import { HomeHero } from "@/components/sections/home-hero";
import { StatsSection } from "@/components/sections/stats-section";
import { TeamGrid } from "@/components/sections/team-grid";
import { InitiativeList } from "@/components/sections/initiative-list";
import { EventList } from "@/components/sections/event-list";
import { MembershipTiers } from "@/components/sections/membership-tiers";
import { BenefitsGrid } from "@/components/sections/benefits-grid";
import { PartnersSection } from "@/components/sections/partners-section";
import { CTASection } from "@/components/sections/cta-section";
import { ContactInfo } from "@/components/sections/contact-info";

/**
 * Renders a single Section by mapping its `type` to the appropriate component.
 *
 * fieldPrefix convention: the section id is used as the prefix.
 * The EditorProvider save splits "sectionId.rest.of.path" to find the
 * section and then applies setByPath(section.data, "rest.of.path", value).
 *
 * For components that receive flat props from section.data (hero, cta),
 * the prefix is just the section id — the component generates e.g. "s1.label".
 *
 * For components that receive an array from section.data.items/members,
 * we pass a prefix that includes the container key so paths resolve correctly.
 * E.g. stats prefix = "s1.items" → component generates "s1.items.0.value"
 */
export function BlockRenderer({ section }: { section: Section }) {
  const d = section.data;
  const id = section.id;

  switch (section.type) {
    case "home-hero":
      return (
        <HomeHero
          hero={d as { label: string; title: string; titleAccent: string; titleSuffix: string; description: string }}
          fieldPrefix={id}
        />
      );

    case "hero":
      return (
        <HeroSection
          label={d.label as string}
          title={d.title as string}
          titleAccent={d.titleAccent as string | undefined}
          description={d.description as string | undefined}
          fieldPrefix={id}
        />
      );

    case "stats":
      return (
        <StatsSection
          stats={d.items as { value: string; label: string }[]}
          fieldPrefix={`${id}.items`}
        />
      );

    case "team-grid":
      return (
        <TeamGrid
          label={d.label as string}
          title={d.title as string}
          members={d.members as { name: string; role: string; initials: string }[]}
          fieldPrefix={id}
        />
      );

    case "initiative-list":
      return (
        <InitiativeList
          label={d.label as string}
          title={d.title as string}
          initiatives={d.items as { title: string; description: string }[]}
          fieldPrefix={id}
        />
      );

    case "event-list":
      return (
        <EventList
          label={d.label as string}
          title={d.title as string}
          events={d.items as { title: string; venue: string; date: string; detail: string }[]}
          fieldPrefix={id}
        />
      );

    case "membership-tiers":
      return (
        <MembershipTiers
          label={d.label as string}
          title={d.title as string}
          tiers={d.items as { name: string; price: string; note: string }[]}
          fieldPrefix={id}
        />
      );

    case "benefits-grid":
      return (
        <BenefitsGrid
          label={d.label as string}
          title={d.title as string}
          benefits={d.items as { title: string; description: string }[]}
          fieldPrefix={id}
        />
      );

    case "partners":
      return (
        <PartnersSection
          partners={d.items as string[]}
          fieldPrefix={`${id}.items`}
        />
      );

    case "contact-info":
      return (
        <ContactInfo
          contact={d as { label: string; title: string; description: string; email: string; linkedin: string; linkedinLabel: string; location: string }}
          fieldPrefix={id}
        />
      );

    case "cta":
      return (
        <CTASection
          title={d.title as string}
          titleAccent={d.titleAccent as string | undefined}
          primaryLabel={d.primaryLabel as string | undefined}
          primaryHref={d.primaryHref as string | undefined}
          secondaryLabel={d.secondaryLabel as string | undefined}
          secondaryHref={d.secondaryHref as string | undefined}
          fieldPrefix={id}
        />
      );

    default:
      return (
        <div className="border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          Unknown block type: {section.type}
        </div>
      );
  }
}
