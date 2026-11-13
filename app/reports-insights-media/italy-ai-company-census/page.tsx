import type { Metadata } from "next";
import Link from "next/link";
import raw from "@/data/research/italy-ai-company-census.json";
import prose from "@/data/research/italy-ai-company-census.content.json";
import { AiCensusPage, type AiCensusLists } from "@/components/research/census/ai-census-page";
import type { ProseContent } from "@/components/research/rich";
import { ItalyCensusProvider } from "./provider";

const content = prose as unknown as ProseContent;
const { D: _companies, ...lists } = raw;
void _companies;

export const metadata: Metadata = {
  title: "Italy AI Company Census — I3/NYC",
  description: content.lede.map((s) => ("t" in s ? s.t : "b" in s ? s.b : s.a)).join(""),
  openGraph: {
    title: "Italy AI Company Census",
    description: "A census of 74 AI and physical AI companies headquartered in Italy, the companion to the I3/NYC census of New York City.",
    type: "article",
  },
};

export default function ItalyAiCensusPage() {
  return (
    <AiCensusPage
      variant="italy"
      content={content}
      lists={lists as unknown as AiCensusLists}
      title="Italy's AI and"
      titleAccent="physical AI companies"
      Provider={ItalyCensusProvider}
      companion={
        <>
          {" "}
          See the <Link href="/reports-insights-media/nyc-ai-company-census">NYC AI Company Census</Link>.
        </>
      }
    />
  );
}
