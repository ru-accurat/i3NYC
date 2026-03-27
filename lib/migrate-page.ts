/**
 * Migrate legacy page JSON (fixed-shape objects) to the new
 * sections-array format. Each page slug has a known mapping.
 */

import type { Section, PageSections } from "./sections";
import { isSectionsFormat } from "./sections";
import { generateBlockId } from "./block-registry";

function sec(type: string, data: Record<string, unknown>): Section {
  return { id: generateBlockId(), type, data };
}

/**
 * If the data is already in sections format, return as-is.
 * Otherwise, convert from the legacy shape based on the slug.
 */
export function migratePageData(
  slug: string,
  data: Record<string, unknown>
): PageSections {
  if (isSectionsFormat(data)) return data as unknown as PageSections;

  const d = data as Record<string, Record<string, unknown> | unknown[] | string[]>;

  switch (slug) {
    case "home":
      return migrateHome(d);
    case "about-us":
      return migrateAbout(d);
    case "what-we-do":
      return migrateWhatWeDo(d);
    case "membership":
      return migrateMembership(d);
    case "events":
      return migrateEvents(d);
    case "contact-us":
      return migrateContact(d);
    default:
      // Unknown slug — wrap the entire blob as a single section
      return { sections: [sec("hero", data)] };
  }
}

/* ─── Per-page migration functions ─── */

function migrateHome(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("home-hero", d.hero as Record<string, unknown>));
  if (d.stats) sections.push(sec("stats", { items: d.stats }));
  if (d.initiatives) sections.push(sec("initiative-list", d.initiatives as Record<string, unknown>));
  if (d.events) sections.push(sec("event-list", d.events as Record<string, unknown>));
  if (d.tiers) sections.push(sec("membership-tiers", d.tiers as Record<string, unknown>));
  if (d.partners) sections.push(sec("partners", { items: d.partners }));
  if (d.cta) sections.push(sec("cta", d.cta as Record<string, unknown>));
  return { sections };
}

function migrateAbout(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("hero", d.hero as Record<string, unknown>));
  if (d.stats) sections.push(sec("stats", { items: d.stats }));
  if (d.board) sections.push(sec("team-grid", d.board as Record<string, unknown>));
  if (d.team) sections.push(sec("team-grid", d.team as Record<string, unknown>));
  if (d.partners) sections.push(sec("partners", { items: d.partners }));
  return { sections };
}

function migrateWhatWeDo(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("hero", d.hero as Record<string, unknown>));
  if (d.initiatives) sections.push(sec("initiative-list", d.initiatives as Record<string, unknown>));
  if (d.partners) sections.push(sec("partners", { items: d.partners }));
  if (d.cta) sections.push(sec("cta", d.cta as Record<string, unknown>));
  return { sections };
}

function migrateMembership(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("hero", d.hero as Record<string, unknown>));
  if (d.benefits) sections.push(sec("benefits-grid", d.benefits as Record<string, unknown>));
  if (d.tiers) sections.push(sec("membership-tiers", d.tiers as Record<string, unknown>));
  if (d.cta) sections.push(sec("cta", d.cta as Record<string, unknown>));
  return { sections };
}

function migrateEvents(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("hero", d.hero as Record<string, unknown>));
  if (d.upcoming) sections.push(sec("event-list", d.upcoming as Record<string, unknown>));
  if (d.past) sections.push(sec("event-list", d.past as Record<string, unknown>));
  if (d.cta) sections.push(sec("cta", d.cta as Record<string, unknown>));
  return { sections };
}

function migrateContact(d: Record<string, unknown>): PageSections {
  const sections: Section[] = [];
  if (d.hero) sections.push(sec("hero", d.hero as Record<string, unknown>));
  if (d.contact) sections.push(sec("contact-info", d.contact as Record<string, unknown>));
  return { sections };
}
