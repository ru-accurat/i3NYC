import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "NYC University Startup Map";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Ecosystem brief",
    title: "NYC University Startup Map",
    facts: "38 programs · 12 universities and medical centers · October 2026",
  });
}
