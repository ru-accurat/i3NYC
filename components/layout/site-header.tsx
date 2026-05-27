"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { LogoutButton } from "./logout-button";
import { NAV_LINKS } from "@/lib/nav-links";
import type { NavItem } from "@/lib/nav-links";

interface SiteHeaderProps {
  isAdmin?: boolean;
}

/** Does the given href correspond to the current path (including child routes)? */
function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isActive(item.href, pathname);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-current={active ? "page" : undefined}
        className={
          "flex items-center gap-1 text-sm transition-colors hover:text-foreground " +
          (active ? "text-foreground" : "text-foreground/60")
        }
      >
        {item.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`mt-px transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2 4l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[280px] rounded-lg border border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-sm">
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-xs tracking-wide text-foreground/50 transition-colors hover:bg-primary/10 hover:text-foreground"
          >
            All {item.label}
          </Link>
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ isAdmin }: SiteHeaderProps) {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/i3nyc-logo.svg"
            alt="I3/NYC"
            width={48}
            height={48}
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((l) =>
            l.children ? (
              <NavDropdown key={l.href} item={l} pathname={pathname} />
            ) : (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href, pathname) ? "page" : undefined}
                className={
                  "text-sm transition-colors hover:text-foreground " +
                  (isActive(l.href, pathname) ? "text-foreground" : "text-foreground/60")
                }
              >
                {l.label}
              </Link>
            )
          )}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/membership"
            className="inline-flex h-8 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Become Member
          </Link>
          <Link
            href="/events-programs"
            className="text-xs text-foreground/60 transition-colors hover:text-foreground"
          >
            Events
          </Link>
          {isAdmin && <LogoutButton />}
        </div>
        <MobileNav isAdmin={isAdmin} />
      </div>
    </header>
  );
}

export { NAV_LINKS } from "@/lib/nav-links";
