"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem, CartProduct } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalRub: number;
  getProduct: (slug: string) => CartProduct | undefined;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "krasnaya-marketplace-cart";
const CART_CHANGED = "krasnaya-cart-changed";
const EMPTY_CART = "[]";
let inMemoryCart: string | undefined;

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(CART_CHANGED, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CART_CHANGED, notify);
  };
}

function getSnapshot() {
  if (inMemoryCart !== undefined) return inMemoryCart;
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function readItems(raw: string): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem =>
      typeof item?.slug === "string" && item.slug.length > 0 && item.slug.length <= 200 &&
      Number.isSafeInteger(item.quantity) && item.quantity > 0,
    );
  } catch {
    return [];
  }
}

function updateItems(update: (items: CartItem[]) => CartItem[]) {
  const raw = JSON.stringify(update(readItems(getSnapshot())));
  try {
    localStorage.setItem(STORAGE_KEY, raw);
    inMemoryCart = undefined;
  } catch {
    inMemoryCart = raw;
  }
  window.dispatchEvent(new Event(CART_CHANGED));
}

type Lookup = {
  slugs: string;
  attempt: number;
  products: Map<string, CartProduct> | null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_CART);
  const savedItems = useMemo(() => readItems(raw), [raw]);
  const slugs = JSON.stringify([...new Set(savedItems.map(({ slug }) => slug))]);
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (slugs === EMPTY_CART) return;
    const controller = new AbortController();
    fetch("/api/cart/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: slugs,
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load cart products");
        const products: CartProduct[] = await response.json();
        if (controller.signal.aborted) return;
        setLookup({
          attempt,
          slugs,
          products: new Map(products.map((product) => [product.slug, product])),
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLookup({ attempt, slugs, products: null });
      });
    return () => controller.abort();
  }, [attempt, slugs]);

  const value = useMemo<CartContextValue>(() => {
    const current = lookup?.slugs === slugs && lookup.attempt === attempt ? lookup : null;
    const products = current?.products;
    const getProduct = (slug: string) => products?.get(slug);
    const items = products ? savedItems.filter(({ slug }) => products.has(slug)) : savedItems;
    const subtotalKopecks = items.reduce((sum, item) => {
      const product = getProduct(item.slug);
      return sum + (product ? Math.round(product.priceRub * 100) * item.quantity : 0);
    }, 0);

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotalRub: subtotalKopecks / 100,
      getProduct,
      isLoading: slugs !== EMPTY_CART && current === null,
      hasError: current?.products === null,
      retry: () => setAttempt((previous) => previous + 1),
      add(slug, quantity = 1) {
        updateItems((current) => {
          const existing = current.find((item) => item.slug === slug);
          if (existing) {
            return current.map((item) =>
              item.slug === slug
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...current, { slug, quantity }];
        });
      },
      setQuantity(slug, quantity) {
        updateItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.slug !== slug)
            : current.map((item) =>
                item.slug === slug ? { ...item, quantity } : item,
              ),
        );
      },
      remove(slug) {
        updateItems((current) => current.filter((item) => item.slug !== slug));
      },
      clear() {
        updateItems(() => []);
      },
    };
  }, [attempt, lookup, savedItems, slugs]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
