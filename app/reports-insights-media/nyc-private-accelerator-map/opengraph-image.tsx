import { OG_CONTENT_TYPE, OG_SIZE, researchOgImage } from "@/lib/research/og";

export const alt = "NYC Private Accelerator Map";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return researchOgImage({
    kind: "Ecosystem brief",
    title: "NYC Private Accelerator Map",
    facts: "31 accelerators, incubators and venture studios · October 2026",
  });
}
