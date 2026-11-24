export function buyerReturnPath(value: unknown) {
  if (value === "/cart" || value === "/checkout") return value;
  if (typeof value === "string" && /^\/products\/[a-z0-9-]{1,200}$/.test(value)) return value;
  return "/catalog";
}

export function buyerAuthLink(page: "login" | "register", next: string, cart = false) {
  const query = new URLSearchParams({ next: buyerReturnPath(next) });
  if (cart) query.set("reason", "cart");
  return `/${page}?${query}`;
}
