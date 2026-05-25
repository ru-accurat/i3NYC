import Link from "next/link";

export function CtaBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/membership"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-primary px-3 text-xs font-medium tracking-wide text-primary-foreground transition-colors hover:bg-primary/80"
        >
          Become Member
        </Link>
        <Link
          href="/events-programs"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-border px-3 text-xs font-medium tracking-wide text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Events
        </Link>
      </div>
    </div>
  );
}
