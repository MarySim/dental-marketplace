import type { ShippingRegion } from "./types";

export const clinic = {
  verifiedByOwner: true,
  rating: 4.6,
  reviewCount: 41,
};

export const shippingRegions: ShippingRegion[] = [
  { id: "ru", transitDays: "2–5", baseRub: 450, perKgRub: 80 },
  { id: "cis", transitDays: "5–10", baseRub: 1200, perKgRub: 220 },
  { id: "eu", transitDays: "7–14", baseRub: 2100, perKgRub: 380 },
  { id: "mena", transitDays: "8–16", baseRub: 2400, perKgRub: 420 },
  { id: "apac", transitDays: "9–18", baseRub: 2600, perKgRub: 450 },
  { id: "na", transitDays: "10–20", baseRub: 2800, perKgRub: 480 },
  { id: "latam", transitDays: "12–22", baseRub: 3100, perKgRub: 520 },
  { id: "africa", transitDays: "12–24", baseRub: 3300, perKgRub: 540 },
  { id: "oceania", transitDays: "12–21", baseRub: 3000, perKgRub: 500 },
];
