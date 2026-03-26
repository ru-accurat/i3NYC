"use client";

import { EditButton } from "./edit-button";

interface PageShellProps {
  slug: string;
  data: Record<string, unknown>;
  isAdmin: boolean;
  children: React.ReactNode;
}

export function PageShell({ slug, data, isAdmin, children }: PageShellProps) {
  return (
    <>
      {children}
      {isAdmin && <EditButton slug={slug} pageData={data} />}
    </>
  );
}
