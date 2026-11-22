"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  key: string;                 // produto:<id> ou curso:<id>:<plano>
  type: "produto" | "curso";
  id: string;
  plan?: "mensal" | "completo";
  kind?: "fisico" | "digital";
  name: string;
  price_cents: number;         // só para exibir: o valor cobrado é recalculado no servidor
  image_url?: string;
  qty: number;
};

type Cart = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hasPhysical: boolean;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  ready: boolean;
};

const CartContext = createContext<Cart | null>(null);
const STORAGE_KEY = "itacaramby-carrinho-v1";

function keyOf(i: Pick<CartItem, "type" | "id" | "plan">) {
  return i.type === "curso" ? `curso:${i.id}:${i.plan}` : `produto:${i.id}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback<Cart["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const key = keyOf(item);
      const single = item.type === "curso" || item.kind === "digital";
      // um curso só pode estar em um plano por vez
      const base = item.type === "curso" ? prev.filter((p) => !(p.type === "curso" && p.id === item.id)) : prev;
      const found = base.find((p) => p.key === key);
      if (found) {
        return base.map((p) => (p.key === key ? { ...p, qty: single ? 1 : Math.min(50, p.qty + qty) } : p));
      }
      return [...base, { ...item, key, qty: single ? 1 : qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, Math.min(50, qty)) } : p)));
  }, []);
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((p) => p.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Cart>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price_cents * i.qty, 0),
      hasPhysical: items.some((i) => i.type === "produto" && i.kind === "fisico"),
      add,
      setQty,
      remove,
      clear,
      ready,
    }),
    [items, add, setQty, remove, clear, ready],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

const EMPTY: Cart = {
  items: [],
  count: 0,
  subtotal: 0,
  hasPhysical: false,
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
  ready: false,
};

export function useCart() {
  // Fora do provedor (ex.: renderizações isoladas do Next) devolve um carrinho vazio em vez de quebrar a página.
  return useContext(CartContext) ?? EMPTY;
}
