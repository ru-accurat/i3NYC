import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  titleAccent?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function CTASection({
  title,
  titleAccent,
  primaryLabel = "Join I3/NYC",
  primaryHref = "/contact-us",
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="max-w-3xl text-4xl font-light leading-[1.15] tracking-tight md:text-6xl">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-primary">{titleAccent}</span>
            </>
          )}
        </h2>
        <div className="mt-10 flex items-center gap-6">
          <Button
            asChild
            size="lg"
            className="rounded-full px-10 text-sm font-medium tracking-wide"
          >
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
