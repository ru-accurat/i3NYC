export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { BenefitsGrid } from "@/components/sections/benefits-grid";
import { MembershipTiers } from "@/components/sections/membership-tiers";
import { CTASection } from "@/components/sections/cta-section";
import { EditableContent } from "@/components/editable-content";
import { getPageContent } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const BENEFITS = [
  { title: "Investor Access", description: "Direct introductions to VCs, angels, and corporate investors active in the NYC ecosystem." },
  { title: "Mentorship", description: "One-on-one guidance from experienced founders and industry leaders who have navigated the U.S. market." },
  { title: "Events & Networking", description: "Priority access to I3/NYC events, pitch sessions, roundtables, and flagship conferences." },
  { title: "Market Intelligence", description: "Sector-specific reports and analysis from our AI & Thematic Observatories." },
  { title: "Community", description: "Join a network of 6,000+ Italian innovators, entrepreneurs, and professionals in NYC." },
  { title: "Visibility", description: "Showcase your company at I3/NYC events and through our communication channels." },
  { title: "Talent Pipeline", description: "Access our Talent Dashboard to find bilingual professionals for your U.S. operations." },
  { title: "Strategic Partnerships", description: "Facilitated connections with corporations, government agencies, and academic institutions." },
];

const TIERS = [
  { name: "Startup", price: "$500/yr", note: "Mentorship, investor access, community, event priority, talent dashboard" },
  { name: "Individual", price: "$100/yr", note: "Events, networking, knowledge sharing, community access" },
  { name: "Corporate", price: "By invite", note: "Priority access, strategic partnerships, branding, dedicated support" },
];

export default async function MembershipPage() {
  const content = await getPageContent("membership");
  const admin = await isAdmin();

  return (
    <>
      <HeroSection
        label="Membership"
        title="Join the community shaping"
        titleAccent="Italian innovation globally."
        description="Whether you're a startup, an individual professional, or a corporation, I3/NYC offers a membership tier designed for your goals."
      />

      <EditableContent
        slug="membership"
        rawContent={content?.raw ?? ""}
        body={content?.body ?? ""}
        isAdmin={admin}
      />

      <BenefitsGrid
        label="Benefits"
        title="Everything you need to succeed in the U.S. innovation market."
        benefits={BENEFITS}
      />

      <MembershipTiers
        label="Tiers"
        title="Choose the membership that fits your ambitions."
        tiers={TIERS}
      />

      <CTASection
        title="Start your journey"
        titleAccent="today."
        primaryLabel="Become a Member"
        primaryHref="/contact-us"
        secondaryLabel="Questions? Get in touch"
        secondaryHref="/contact-us"
      />
    </>
  );
}
