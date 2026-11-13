import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "Tri-State Innovation Navigator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Interactive guide",
    title: "Tri-State Innovation Navigator",
    facts: "33 programs across New York, New Jersey and Connecticut · October 2026",
  });
}
