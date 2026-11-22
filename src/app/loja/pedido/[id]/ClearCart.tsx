"use client";

import { useEffect } from "react";
import { useCart } from "@/components/store/CartProvider";

/** Esvazia o carrinho depois que o pedido foi criado. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
