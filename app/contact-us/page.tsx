export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";
import { ContactInfo } from "@/components/sections/contact-info";
import { PageShell } from "@/components/editor/page-shell";
import { getPageData } from "@/lib/content";
import { isAdmin } from "@/lib/auth";

const DEFAULT_DATA = {
  hero: {
    label: "Contact",
    title: "Let's build something",
    titleAccent: "together.",
    description: "Whether you're a startup, an enterprise, or an individual innovator, we'd love to hear from you.",
  },
  contact: {
    label: "Get in Touch",
    title: "Ready to connect with the Italian innovation ecosystem in NYC?",
    description: "Reach out to learn more about membership, partnerships, events, or how I3/NYC can support your journey into the U.S. market.",
    email: "info@i3nyc.org",
    linkedin: "https://www.linkedin.com/company/i3-italian-innovators-initiative",
    linkedinLabel: "I3 Italian Innovators Initiative",
    location: "New York City, NY",
  },
};

export default async function ContactPage() {
  const data = (await getPageData("contact-us")) ?? DEFAULT_DATA;
  const admin = await isAdmin();
  const d = data as typeof DEFAULT_DATA;

  return (
    <PageShell slug="contact-us" data={data} isAdmin={admin}>
      <HeroSection
        label={d.hero.label}
        title={d.hero.title}
        titleAccent={d.hero.titleAccent}
        description={d.hero.description}
        fieldPrefix="hero"
      />
      <ContactInfo contact={d.contact} fieldPrefix="contact" />
    </PageShell>
  );
}
