import Link from "next/link";
import { LogoMark, LogoName } from "@/components/Logo";
import { ResetRequestForm } from "./ResetRequestForm";

export const instant = false;

export default async function RecuperarPage({ searchParams }: PageProps<"/admin/recuperar">) {
  const { erro } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-navy p-6">
      <div className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-center gap-3 text-copper">
          <LogoMark className="h-8 w-auto" />
          <LogoName className="h-5 w-auto" />
        </div>
        <h1 className="text-center font-serif text-xl text-navy">Esqueci minha senha</h1>
        <p className="mt-2 text-center text-sm text-ink/60">Enviaremos um link para você criar uma senha nova.</p>
        {erro === "link" && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">O link expirou ou já foi usado. Peça um novo abaixo.</p>
        )}
        <ResetRequestForm />
        <p className="mt-6 text-center text-sm">
          <Link href="/admin/login" className="text-navy/70 underline hover:text-copper">Voltar ao login</Link>
        </p>
      </div>
    </main>
  );
}
