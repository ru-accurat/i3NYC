import { Compass, FileText, Grip, Map as MapIcon, Notebook } from "lucide-react";

type IconComponent = React.ComponentType<{ className?: string; strokeWidth?: number }>;

/** LinkedIn's mark as a line icon, drawn to sit with the lucide set (which has no brand icons). */
function LinkedInMark({ className, strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 11v5" />
      <path d="M8 8v.01" />
      <path d="M12 16v-5" />
      <path d="M16 16v-3a2 2 0 1 0 -4 0" />
      <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" />
    </svg>
  );
}

/**
 * One icon per content type, shared by the Reports hub cards and the Reports menu,
 * so a page carries the same icon wherever it is listed. Other types have none.
 */
export const CONTENT_TYPE_ICONS: Record<string, IconComponent> = {
  "navigator": Compass,
  "census": Grip,
  "map": MapIcon,
  "brief": Notebook,
  "white-paper": FileText,
  "social": LinkedInMark,
};

/** The icon for a content type, or nothing when the type has none. Decorative: hidden from screen readers. */
export function ContentTypeIcon({ type, className }: { type?: string; className?: string }) {
  const Icon = type ? CONTENT_TYPE_ICONS[type] : undefined;
  if (!Icon) return null;
  return (
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Icon className={className} strokeWidth={1.5} />
    </span>
  );
}
