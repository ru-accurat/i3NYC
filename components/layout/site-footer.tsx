import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav-links";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-8 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Image
            src="/i3nyc-logo.svg"
            alt="I3/NYC"
            width={40}
            height={40}
            className="h-7 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A 501(c)(3) non-profit for Italian innovators in the New York
            area, endorsed by the Italian Consulate General in New York.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
            Navigate
          </p>
          <div className="mt-4 flex flex-col lg:gap-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground lg:min-h-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
            Connect
          </p>
          <div className="mt-4 flex flex-col lg:gap-3">
            <a
              href="https://www.linkedin.com/company/i3-italian-innovators-initiative"
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground lg:min-h-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <Link
              href="/contact-us"
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground lg:min-h-0"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 pt-2 pb-20 lg:py-6">
          <p className="text-xs text-muted-foreground">
            &copy; I3/NYC {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.iubenda.com/privacy-policy/23178177"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs text-muted-foreground hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="https://www.iubenda.com/privacy-policy/23178177/cookie-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs text-muted-foreground hover:text-foreground"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
