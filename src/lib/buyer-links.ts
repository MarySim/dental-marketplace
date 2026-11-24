export type BuyerAuthReason = "cart" | "favorite";

export function buyerReturnPath(value: unknown) {
  if (value === "/cart" || value === "/checkout" || value === "/favorites") return value;
  if (typeof value === "string" && /^\/products\/[a-z0-9-]{1,200}$/.test(value)) return value;
  return "/catalog";
}

export function buyerAuthLink(page: "login" | "register", next: string, reason?: BuyerAuthReason) {
  const query = new URLSearchParams({ next: buyerReturnPath(next) });
  if (reason) query.set("reason", reason);
  return `/${page}?${query}`;
}
