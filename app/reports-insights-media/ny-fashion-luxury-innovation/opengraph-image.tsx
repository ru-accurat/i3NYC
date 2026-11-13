import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "NY Fashion & Luxury Innovation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Ecosystem brief",
    title: "NY Fashion & Luxury Innovation",
    facts: "69 companies · 34 programs and investors · 10 schools · October 2026",
  });
}
