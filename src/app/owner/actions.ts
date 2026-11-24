"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getOwnerAuth, reserveOwnerLoginAttempt } from "@/lib/owner-auth";

type LoginError = "invalid" | "limited" | "unavailable";

export async function signInOwner(
  _previous: LoginError | null,
  formData: FormData,
): Promise<LoginError | null> {
  const rawEmail = formData.get("email");
  const password = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 128
  ) {
    return "invalid";
  }

  try {
    if (!(await reserveOwnerLoginAttempt())) return "limited";

    await getOwnerAuth().api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch (error) {
    if (isAPIError(error) && error.body?.code === "INVALID_EMAIL_OR_PASSWORD") return "invalid";
    console.error("Owner sign-in failed.");
    return "unavailable";
  }
  redirect("/owner");
}

export async function signOutOwner() {
  await getOwnerAuth().api.signOut({ headers: await headers() });
  redirect("/owner/login");
}
