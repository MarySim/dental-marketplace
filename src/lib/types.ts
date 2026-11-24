import type { Locale, messages } from "./i18n";

export type ProductKind = "treatment" | "goods";

export type ProductCategory =
  | "prosthetics"
  | "orthodontics"
  | "prevention"
  | "clinical-supplies"
  | "home-care";

export type Product = {
  slug: string;
  name: string;
  kind: ProductKind;
  category: ProductCategory;
  unit: string;
  priceRub: number;
  rating: number;
  reviewCount: number;
  shipsWorldwide: boolean;
  accent: string;
  summary: string;
  description: string;
  highlights: string[];
};

export type CartItem = {
  slug: string;
  quantity: number;
};

export type CartProduct = Pick<
  Product,
  "slug" | "name" | "unit" | "kind" | "priceRub" | "shipsWorldwide"
> & {
  names: Record<Locale, string>;
  units: Record<Locale, string>;
};

export type CartLine = CartItem & CartProduct;

export type ShippingRegionId = keyof typeof messages.ru.shipping.regions;

export type ShippingRegion = {
  id: ShippingRegionId;
  transitDays: string;
  baseRub: number;
  perKgRub: number;
};

export type MockOrder = {
  id: string;
  createdAt: string;
  items: Array<{
    slug: string;
    name: string;
    names: Record<Locale, string>;
    quantity: number;
    unitPriceRub: number;
  }>;
  shippingRub: number;
  subtotalRub: number;
  totalRub: number;
  regionId: ShippingRegionId;
  city: string;
  recipient: string;
};
