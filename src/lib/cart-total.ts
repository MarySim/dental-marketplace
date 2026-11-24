import type { CartLine } from "./types";

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + Math.round(line.priceRub * 100) * line.quantity, 0) / 100;
}
