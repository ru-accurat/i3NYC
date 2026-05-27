/**
 * Block Registry — maps section type strings to metadata used by the
 * generic page renderer and the admin section-management UI.
 *
 * Each entry describes:
 *  - label: human-readable name shown in the "Add Section" palette
 *  - defaults: the default data blob inserted when a new block is created
 *  - arrayFields: dot-paths within `data` that hold item arrays (for add/remove UI)
 *  - itemDefaults: default item shape keyed by the same dot-path
 */

export interface BlockDef {
  label: string;
  defaults: Record<string, unknown>;
  arrayFields?: string[];
  itemDefaults?: Record<string, Record<string, unknown>>;
}

export const BLOCK_REGISTRY: Record<string, BlockDef> = {
  "home-hero": {
    label: "Home Hero",
    defaults: {
      label: "Label",
      title: "Title text",
      titleAccent: "accent text",
      titleSuffix: "suffix text.",
      description: "Description paragraph.",
      bg: { enabled: true, opacity: 0.28 },
    },
  },
  hero: {
    label: "Hero",
    defaults: {
      label: "Section",
      title: "Section Title",
      titleAccent: "accent.",
      description: "Section description text.",
      bg: { enabled: false, opacity: 0.20 },
    },
  },
  stats: {
    label: "Stats",
    defaults: {
      items: [{ value: "0", label: "Stat" }],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { value: "0", label: "New Stat" },
    },
  },
  "team-grid": {
    label: "Team Grid",
    defaults: {
      label: "Team",
      title: "Team Title",
      members: [{ name: "Name", role: "Role", initials: "XX", portfolio: "", imageUrl: "" }],
    },
    arrayFields: ["members"],
    itemDefaults: {
      members: { name: "New Member", role: "Role", initials: "NM", portfolio: "", imageUrl: "" },
    },
  },
  "initiative-list": {
    label: "Initiative List",
    defaults: {
      label: "Programs",
      title: "Program list title.",
      items: [{ title: "Program Name", description: "Description." }],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { title: "New Program", description: "Description." },
    },
  },
  "event-list": {
    label: "Event List",
    defaults: {
      label: "Events",
      title: "Events title",
      items: [{ title: "Event Name", venue: "Venue", date: "Jan 2026", detail: "Details" }],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { title: "New Event", venue: "Venue", date: "Jan 2026", detail: "Details" },
    },
  },
  "membership-tiers": {
    label: "Membership Tiers",
    defaults: {
      label: "Membership",
      title: "Membership title.",
      items: [{ name: "Tier", price: "$0/yr", note: "Description" }],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { name: "New Tier", price: "$0/yr", note: "Description" },
    },
  },
  "benefits-grid": {
    label: "Benefits Grid",
    defaults: {
      label: "Benefits",
      title: "Benefits title.",
      items: [{ title: "Benefit", description: "Description." }],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { title: "New Benefit", description: "Description." },
    },
  },
  partners: {
    label: "Partners",
    defaults: {
      items: ["Partner Name"],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { _value: "New Partner" }, // special: string array, handled differently
    },
  },
  "contact-info": {
    label: "Contact Info",
    defaults: {
      label: "Contact",
      title: "Contact title",
      description: "Contact description.",
      email: "info@example.org",
      linkedin: "https://linkedin.com/company/example",
      linkedinLabel: "Company Name",
      location: "New York, NY",
    },
  },
  cta: {
    label: "Call to Action",
    defaults: {
      title: "CTA title",
      titleAccent: "accent.",
      primaryLabel: "Primary",
      primaryHref: "/contact-us",
      secondaryLabel: "Secondary",
      secondaryHref: "/contact-us",
    },
  },
  "strategic-pillars": {
    label: "Strategic Pillars",
    defaults: {
      label: "Value Proposition",
      title: "The 4 Strategic Pillars",
      items: [
        { title: "Pillar", description: "Description." },
      ],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { title: "New Pillar", description: "Description." },
    },
  },
  "event-spotlight": {
    label: "Event Spotlight",
    defaults: {
      label: "Featured",
      title: "Active Event",
      eventTitle: "Event Title",
      date: "Date",
      venue: "Venue",
      description: "Short description of the spotlight event.",
      ctaLabel: "RSVP",
      ctaHref: "https://luma.com/",
    },
  },
  "event-track": {
    label: "Event Track",
    defaults: {
      label: "Track",
      title: "Track Title",
      description: "Description of this track.",
      items: [
        { title: "Event Name", venue: "Venue", date: "Jan 2026", detail: "Details" },
      ],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { title: "New Event", venue: "Venue", date: "Jan 2026", detail: "Details" },
    },
  },
  "cooperation-list": {
    label: "Cooperation List",
    defaults: {
      label: "Projects",
      title: "Cooperation & Projects",
      items: [
        { name: "Partner Name", description: "Description.", contact: "" },
      ],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { name: "New Partner", description: "Description.", contact: "" },
    },
  },
  "knowledge-hub": {
    label: "Knowledge Hub",
    defaults: {
      label: "Knowledge Hub",
      title: "Insights & Media",
      items: [
        { type: "white-paper", title: "Tile Title", description: "Description.", href: "" },
      ],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { type: "white-paper", title: "New Tile", description: "Description.", href: "" },
    },
  },
  "member-spotlight": {
    label: "Member Spotlight",
    defaults: {
      label: "Members",
      title: "Member Spotlights",
      description: "Featured members from the I3/NYC community.",
      items: [],
    },
    arrayFields: ["items"],
    itemDefaults: {
      items: { name: "Member Name", role: "Role · Company", initials: "MN", quote: "" },
    },
  },
};

export type BlockType = keyof typeof BLOCK_REGISTRY;

/** Generate a short random id for new sections */
export function generateBlockId(): string {
  return "s" + Math.random().toString(36).slice(2, 8);
}
