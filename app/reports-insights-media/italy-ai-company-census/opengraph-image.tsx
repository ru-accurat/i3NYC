import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "Italy AI Company Census";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Company census",
    title: "Italy AI Company Census",
    facts: "74 companies · €1.39B raised · October 2026",
  });
}
