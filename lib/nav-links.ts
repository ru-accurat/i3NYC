export interface NavItem {
  label: string;
  href: string;
  /** `type` is the page's content type; it picks the icon shown beside the label. */
  children?: { label: string; href: string; type?: string }[];
}

// External membership signup (Zeffy ticketing) — every "Become Member" CTA points here.
export const MEMBERSHIP_SIGNUP_URL =
  "https://www.zeffy.com/en-US/ticketing/i-cubednyc-italian-innovators-initiative-inc-memberships--2026";

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about-us" },
  { label: "Membership", href: "/membership" },
  { label: "Events & Programs", href: "/events-programs" },
  { label: "Projects & Cooperation", href: "/projects-cooperation" },
  {
    label: "Reports, Insights & Media",
    href: "/reports-insights-media",
    children: [
      { label: "Tri-State Innovation Navigator", href: "/reports-insights-media/tri-state-innovation-navigator", type: "navigator" },
      { label: "NYC AI Company Census", href: "/reports-insights-media/nyc-ai-company-census", type: "census" },
      { label: "Innovation & Tech Report", href: "/reports-insights-media/innovation-tech-march-2026", type: "white-paper" },
    ],
  },
];
