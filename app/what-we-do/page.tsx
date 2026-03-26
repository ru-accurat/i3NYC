export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { InitiativeList } from "@/components/sections/initiative-list";
import { PartnersSection } from "@/components/sections/partners-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const DEFAULT_DATA = {
  hero: {
    label: "What We Do",
    title: "Five programs connecting Italian innovators with",
    titleAccent: "U.S. opportunities.",
    description: "From acceleration to talent matching, we provide the tools, networks, and knowledge Italian innovators need to succeed in America.",
  },
  initiatives: {
    label: "Our Programs",
    title: "A comprehensive suite of services for Italian innovation.",
    items: [
      { title: "Acceleration Programs", description: "Intensive training, mentorship, and investor access tailored to Italian startups and SMEs entering the U.S. market. Programs include pitch coaching, market validation workshops, and introductions to key investors and corporate partners." },
      { title: "AI & Thematic Observatories", description: "Deep sector analysis covering AI, fintech, fashion tech, life sciences, climate tech, and more. Our observatories produce reports, host expert panels, and connect Italian companies with sector-specific opportunities in the U.S." },
      { title: "Corporate Orientation", description: "Market-entry strategies and investor introductions for established Italian companies exploring NYC and U.S. markets. Includes regulatory guidance, partnership facilitation, and strategic consulting." },
      { title: "Networking & Matchmaking", description: "Flagship events, pitch sessions, and curated networking across the Italian and American innovation ecosystem. From intimate roundtables to large-scale conferences, we create meaningful connections." },
      { title: "Talent Dashboard", description: "A curated pool of bilingual Italian professionals eager to work in the U.S. innovation economy. Companies can browse profiles, post opportunities, and connect directly with qualified talent." },
    ],
  },
  partners: ["Italian Consulate in NY", "Fondazione Brodolini", "AIFI", "Lazio Innova", "Regione Lazio"],
  cta: {
    title: "Ready to innovate",
    titleAccent: "across borders?",
    primaryLabel: "Get Started",
    primaryHref: "/contact-us",
    secondaryLabel: "View membership",
    secondaryHref: "/membership",
  },
};

export default async function WhatWeDoPage() {
  const data = (await getPageData("what-we-do")) ?? DEFAULT_DATA;
  const admin = await isAdmin();
  const d = data as typeof DEFAULT_DATA;

  return (
    <PageShell slug="what-we-do" data={data} isAdmin={admin}>
      <HeroSection
        label={d.hero.label}
        title={d.hero.title}
        titleAccent={d.hero.titleAccent}
        description={d.hero.description}
        fieldPrefix="hero"
      />
      <InitiativeList
        label={d.initiatives.label}
        title={d.initiatives.title}
        initiatives={d.initiatives.items}
        fieldPrefix="initiatives"
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
