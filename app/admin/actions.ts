"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }
  await createSession();
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
