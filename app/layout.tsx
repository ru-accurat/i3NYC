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
  title: "I3/NYC — Italian Innovators Initiative",
  description: "Your Strategic Bridge to the Heart of Innovation",
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
          className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        >
          Skip to main content
        </a>
        <EditorProvider>
          <SiteHeader isAdmin={admin} />
          <main id="main" className="flex-1 pt-20 pb-16 md:pb-0">{children}</main>
          <SiteFooter />
          <CtaBar />
        </EditorProvider>
      </body>
    </html>
  );
}
