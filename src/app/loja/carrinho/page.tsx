import { getContent } from "@/lib/content";
import { Checkout } from "./Checkout";

export const metadata = { title: "Carrinho — Itacaramby" };

export default async function CarrinhoPage() {
  const { settings } = await getContent();
  return (
    <>
      <div className="bg-navy pb-10 pt-32 text-ivory">
        <div className="mx-auto max-w-6xl px-5">
          <h1 className="font-serif text-4xl">Seu carrinho</h1>
        </div>
      </div>
      <Checkout shippingFlatCents={settings.store.shippingFlatCents} pickupNote={settings.store.pickupNote} />
    </>
  );
}
