import { shippingRegions } from "./data";
import type { CartItem, CartProduct } from "./types";

type ProductLookup = (slug: string) => CartProduct | undefined;

const WEIGHT_BY_SLUG: Record<string, number> = {
  "led-whitening-kit": 1.1,
  "composite-restorative-kit": 1.6,
  "fluoride-varnish-pack": 0.4,
  "clear-retainer-aftercare": 0.3,
  "sterile-instrument-cassette": 3.2,
  "daily-oral-care-bundle": 0.5,
};

function estimatedWeightKg(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const unit = WEIGHT_BY_SLUG[item.slug] ?? 0.8;
    return sum + unit * item.quantity;
  }, 0);
}

export function quoteShipping(regionId: string, items: CartItem[], getProduct: ProductLookup) {
  const region = shippingRegions.find((entry) => entry.id === regionId);
  const goods = items.filter((item) => getProduct(item.slug)?.shipsWorldwide);

  if (!region) {
    return { status: "unknownRegion" } as const;
  }

  if (goods.length === 0) {
    return {
      region,
      amountRub: 0,
      weightKg: 0,
      status: "noParcel",
    } as const;
  }

  const weightKg = estimatedWeightKg(goods);
  const amountRub = Math.round(region.baseRub + region.perKgRub * Math.max(weightKg, 0.5));

  return {
    region,
    amountRub,
    weightKg,
    status: "parcel",
  } as const;
}
