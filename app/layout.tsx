import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CtaBar } from "@/components/layout/cta-bar";
import { EditorProvider } from "@/components/editor/editor-provider";
import { isAdmin } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute base for share images and canonical URLs.
  metadataBase: new URL("https://www.i3nyc.org"),
  title: "I3/NYC — Italian Innovators Initiative",
  description: "A non-profit connecting Italian innovators with New York.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await isAdmin();

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <EditorProvider>
          <SiteHeader isAdmin={admin} />
          <main id="main" className="flex-1 pt-20">{children}</main>
          <SiteFooter />
          <CtaBar />
        </EditorProvider>
      </body>
    </html>
  );
}
