/**
 * Section-based page data model.
 *
 * Pages are stored as { sections: Section[] }.
 * Each section has an id, a type (from block-registry), and a data blob.
 */

export interface Section {
  id: string;
  type: string;
  data: Record<string, unknown>;
}

export interface PageSections {
  sections: Section[];
}

/** Type guard: does this JSON object use the new sections format? */
export function isSectionsFormat(data: Record<string, unknown>): boolean {
  return Array.isArray(data.sections) && data.sections.length > 0 && typeof data.sections[0].type === "string";
}
