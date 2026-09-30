export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
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
      { label: "Innovation & Tech Report · Mar 2026", href: "/reports-insights-media/innovation-tech-march-2026" },
    ],
  },
];
