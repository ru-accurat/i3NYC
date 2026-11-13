import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "NY Metro Life Sciences";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Ecosystem brief",
    title: "NY Metro Life Sciences",
    facts: "141 companies · 42 programs · 22 research institutions · October 2026",
  });
}
