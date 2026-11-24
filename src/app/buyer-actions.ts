"use server";

import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getBuyerAuth, reserveBuyerAuthAttempt } from "@/lib/buyer-auth";
import { buyerReturnPath } from "@/lib/buyer-links";

type BuyerAuthError = "invalid" | "invalidLogin" | "duplicate" | "limited" | "unavailable";

export async function authenticateBuyer(
  mode: "register" | "login",
  _previous: BuyerAuthError | null,
  data: FormData,
): Promise<BuyerAuthError | null> {
  if (mode !== "register" && mode !== "login") return "invalid";
  const emailField = data.get("email");
  const password = data.get("password");
  const nameField = data.get("name");
  const email = typeof emailField === "string" ? emailField.trim().toLowerCase() : "";
  const name = typeof nameField === "string" ? nameField.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      typeof password !== "string" || !password.length || password.length > 128 ||
      (mode === "register" && (!name || name.length > 100 || password.length < 12))) {
    return mode === "register" ? "invalid" : "invalidLogin";
  }

  try {
    if (!(await reserveBuyerAuthAttempt(mode))) return "limited";
    const auth = getBuyerAuth();
    const requestHeaders = await headers();
    if (mode === "register") {
      await auth.api.signUpEmail({ body: { email, password, name }, headers: requestHeaders });
    } else {
      await auth.api.signInEmail({ body: { email, password }, headers: requestHeaders });
    }
  } catch (error) {
    if (isAPIError(error)) {
      const code = error.body?.code;
      if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return "duplicate";
      if (code === "INVALID_EMAIL_OR_PASSWORD" || code === "INVALID_EMAIL") return "invalidLogin";
    }
    console.error("Buyer authentication failed.");
    return "unavailable";
  }
  redirect(buyerReturnPath(data.get("next")));
}

export async function signOutBuyer() {
  await getBuyerAuth().api.signOut({ headers: await headers() });
  redirect("/catalog");
}
