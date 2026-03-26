import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "./site-header";

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
            Empowering Italian Innovation on a Global Scale. A non-profit
            initiative endorsed by the Italian Consulate in New York.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-widest text-muted-foreground/50 uppercase">
            Navigate
          </p>
          <div className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
          <div className="mt-4 flex flex-col gap-3">
            <a
              href="https://www.linkedin.com/company/i3-italian-innovators-initiative"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <Link
              href="/contact-us"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <p className="text-xs text-muted-foreground/40">
            &copy; I3/NYC {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
