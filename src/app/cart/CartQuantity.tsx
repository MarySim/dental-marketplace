import { changeCart } from "@/app/shopping-actions";

export function CartQuantity({ slug, quantity, label, update }: {
  slug: string;
  quantity: number;
  label: string;
  update: string;
}) {
  return (
    <form action={changeCart} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="slug" value={slug} />
      <label className="text-sm text-slate-500">
        {label}
        <input type="number" name="quantity" min={1} max={20} required defaultValue={quantity}
          className="ml-2 w-16 rounded-lg border border-sky-200 px-2 py-1" />
      </label>
      <button className="text-sm text-sky-700">{update}</button>
    </form>
  );
}
