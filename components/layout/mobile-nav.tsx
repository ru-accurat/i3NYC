"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS } from "@/lib/nav-links";

interface MobileNavProps {
  isAdmin?: boolean;
}

export function MobileNav({ isAdmin }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" />
        }
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV_LINKS.map((l) =>
            l.children ? (
              <div key={l.href}>
                <button
                  onClick={() =>
                    setExpandedSection(expandedSection === l.label ? null : l.label)
                  }
                  className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-base text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`transition-transform ${expandedSection === l.label ? "rotate-180" : ""}`}
                  >
                    <path d="M3 5l3 3 3-3" />
                  </svg>
                </button>
                {expandedSection === l.label && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3">
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2 text-xs tracking-wide text-foreground/50 transition-colors hover:text-foreground"
                    >
                      All {l.label}
                    </Link>
                    {l.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            )
          )}
          {isAdmin ? (
            <>
              <Separator className="my-2" />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full rounded-md px-3 py-2.5 text-left text-sm text-primary/70 transition-colors hover:text-primary"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Separator className="my-2" />
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground/40 transition-colors hover:text-foreground/60"
              >
                Admin
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
