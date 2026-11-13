import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "NYC AI Company Census";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Company census",
    title: "NYC AI Company Census",
    facts: "150 companies · $27.1B raised · October 2026",
  });
}
