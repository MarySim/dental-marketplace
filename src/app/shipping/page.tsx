import { shippingRegions } from "@/lib/data";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/server-locale";
import { formatRub } from "@/lib/format";

export async function generateMetadata() {
  return { title: messages[await getLocale()].nav.shipping };
}

export default async function ShippingPage() {
  const locale = await getLocale();
  const copy = messages[locale].shipping;
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-100 bg-white/80 p-8">
        <h1 className="text-3xl font-semibold text-sky-950">{copy.title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          {copy.intro}
        </p>
      </section>
      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-sky-50 text-sky-900">
            <tr>
              <th className="px-4 py-3 font-semibold">{copy.region}</th>
              <th className="px-4 py-3 font-semibold">{copy.transit}</th>
              <th className="px-4 py-3 font-semibold">{copy.base}</th>
              <th className="px-4 py-3 font-semibold">{copy.perKg}</th>
            </tr>
          </thead>
          <tbody>
            {shippingRegions.map((region) => (
              <tr key={region.id} className="border-t border-sky-100">
                <td className="px-4 py-3">{copy.regions[region.id]}</td>
                <td className="px-4 py-3">{region.transitDays} {copy.days}</td>
                <td className="px-4 py-3">{formatRub(region.baseRub, locale)}</td>
                <td className="px-4 py-3">{formatRub(region.perKgRub, locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-900">
        {copy.note}
      </p>
    </div>
  );
}
