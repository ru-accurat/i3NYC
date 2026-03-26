import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { LogoutButton } from "./logout-button";

const NAV_LINKS = [
  { label: "About", href: "/about-us" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact-us" },
];

interface SiteHeaderProps {
  isAdmin?: boolean;
}

export function SiteHeader({ isAdmin }: SiteHeaderProps) {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/i3nyc-logo.svg"
            alt="I3/NYC"
            width={48}
            height={48}
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {isAdmin ? (
            <LogoutButton />
          ) : (
            <Link
              href="/admin/login"
              className="text-xs text-foreground/40 transition-colors hover:text-foreground/60"
            >
              Admin
            </Link>
          )}
        </nav>
        <MobileNav isAdmin={isAdmin} />
      </div>
    </header>
  );
}

export { NAV_LINKS };
