import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Share image for the research pages: the site's dark ground, the purple
// kicker, the page title and one line of headline figures.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

interface ResearchOg {
  /** e.g. "Company census" */
  kind: string;
  title: string;
  /** e.g. "150 companies · $27.1B raised · October 2026" */
  facts: string;
}

export async function researchOgImage({ kind, title, facts }: ResearchOg) {
  const [light, medium] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Light.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#1F1F24",
          color: "#F5F5F5",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, fontWeight: 500, letterSpacing: 5, color: "#9B7BFF" }}>
          {`I3/NYC RESEARCH · ${kind.toUpperCase()}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 300, lineHeight: 1.08, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, fontWeight: 300, color: "#A0A0A8" }}>
            {facts}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            fontSize: 24,
          }}
        >
          <div style={{ display: "flex", fontWeight: 500 }}>I3/NYC — Italian Innovators Initiative</div>
          <div style={{ display: "flex", fontWeight: 300, color: "#A0A0A8" }}>i3nyc.org</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: light, style: "normal", weight: 300 },
        { name: "Geist", data: medium, style: "normal", weight: 500 },
      ],
    }
  );
}
