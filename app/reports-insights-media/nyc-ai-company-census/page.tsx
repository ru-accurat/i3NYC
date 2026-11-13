import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/data/research/nyc-ai-company-census.json";
import prose from "@/data/research/nyc-ai-company-census.content.json";
import { AiCensusPage, type AiCensusLists } from "@/components/research/census/ai-census-page";
import type { ProseContent } from "@/components/research/rich";
import { NycCensusProvider } from "./provider";

const content = prose as unknown as ProseContent;
const { D: _companies, ...lists } = raw;
void _companies;

export const metadata: Metadata = {
  title: "NYC AI Company Census — I3/NYC",
  description: content.lede.map((s) => ("t" in s ? s.t : "b" in s ? s.b : s.a)).join(""),
  openGraph: {
    title: "NYC AI Company Census",
    description: "A census of 150 AI and physical AI companies based in New York City: what they sell, whose models they run on, funding, scale and footprint.",
    type: "article",
  },
};

export default function NycAiCensusPage() {
  return (
    <AiCensusPage
      variant="nyc"
      content={content}
      lists={lists as unknown as AiCensusLists}
      title="New York City's AI and"
      titleAccent="physical AI companies"
      Provider={NycCensusProvider}
      companion={
        <>
          {" "}
          Its companion is the <Link href="/reports-insights-media/italy-ai-company-census">census of Italy&rsquo;s AI companies</Link>.
        </>
      }
    />
  );
}
