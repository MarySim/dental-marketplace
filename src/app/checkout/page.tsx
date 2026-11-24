import { requireBuyer } from "@/lib/buyer-auth";
import { listBuyerCart } from "@/lib/products";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage() {
  const buyer = await requireBuyer("/checkout");
  const items = await listBuyerCart(buyer.id);
  return <CheckoutForm items={items} buyerName={buyer.name} />;
}
