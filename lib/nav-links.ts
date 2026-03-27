export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const NAV_LINKS: NavItem[] = [
  { label: "About", href: "/about-us" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  {
    label: "Reports",
    href: "/reports",
    children: [
      { label: "Innovation & Tech Report · Mar 2026", href: "/reports/innovation-tech-march-2026" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
];
