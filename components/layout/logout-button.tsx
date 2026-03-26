"use client";

import { logoutAction } from "@/app/admin/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="text-xs text-primary/60 transition-colors hover:text-primary"
      >
        Logout
      </button>
    </form>
  );
}
