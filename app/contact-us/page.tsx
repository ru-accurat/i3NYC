import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <HeroSection
        label="Contact"
        title="Let's build something"
        titleAccent="together."
        description="Whether you're a startup, an enterprise, or an individual innovator, we'd love to hear from you."
      />

      <section className="py-28">
        <div className="mx-auto grid max-w-6xl gap-16 px-8 md:grid-cols-2">
          <div>
            <p className="text-sm tracking-wide text-primary">Get in Touch</p>
            <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
              Ready to connect with the Italian innovation ecosystem in NYC?
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Reach out to learn more about membership, partnerships, events, or
              how I3/NYC can support your journey into the U.S. market.
            </p>
            <div className="mt-10 flex items-center gap-6">
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 text-sm font-medium tracking-wide"
              >
                <a href="mailto:info@i3nyc.org">Email Us</a>
              </Button>
              <Link
                href="/membership"
                className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              >
                View membership
              </Link>
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
                Email
              </p>
              <a
                href="mailto:info@i3nyc.org"
                className="mt-2 block text-base text-foreground transition-colors hover:text-primary"
              >
                info@i3nyc.org
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
                LinkedIn
              </p>
              <a
                href="https://www.linkedin.com/company/i3-italian-innovators-initiative"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-base text-foreground transition-colors hover:text-primary"
              >
                I3 Italian Innovators Initiative
              </a>
            </div>
            <div>
              <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
                Location
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                New York City, NY
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
