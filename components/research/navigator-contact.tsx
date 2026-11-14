"use client";

import { useEffect, useRef, useState } from "react";
import { GHOST_BUTTON, copyText } from "./navigator-provider";

type CopyState = "idle" | "copied" | "selected";

/** The address to write to, with a copy button. */
export function NavigatorContact({ email }: { email: string }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const mailRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    if (await copyText(email)) {
      setCopyState("copied");
      timer.current = setTimeout(() => setCopyState("idle"), 2500);
      return;
    }
    // Clipboard refused: select the address so it can be copied by hand.
    if (mailRef.current) {
      const range = document.createRange();
      range.selectNodeContents(mailRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    setCopyState("selected");
  }

  return (
    <div className="grid max-w-md gap-4 rounded-2xl border border-border p-8">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">Write to us</span>
      <span ref={mailRef} className="text-2xl font-light tracking-tight break-all text-foreground select-all">
        {email}
      </span>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={copy} className={GHOST_BUTTON}>
          Copy email address
        </button>
        <span role="status" className="text-xs text-muted-foreground">
          {copyState === "copied" ? "Copied" : copyState === "selected" ? "Address selected — copy it" : ""}
        </span>
      </div>
    </div>
  );
}
