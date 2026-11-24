import { listCartProducts } from "@/lib/products";

export async function POST(request: Request) {
  const slugs: unknown = await request.json().catch(() => null);
  if (
    !Array.isArray(slugs) ||
    slugs.length > 500 ||
    !slugs.every((slug): slug is string =>
      typeof slug === "string" && slug.length > 0 && slug.length <= 200,
    )
  ) {
    return Response.json({ error: "Invalid product slugs." }, { status: 400 });
  }

  return Response.json(await listCartProducts(slugs));
}
