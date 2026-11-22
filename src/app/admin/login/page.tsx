import { LogoMark, LogoName } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const instant = false;

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { erro } = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-navy p-6">
      <div className="w-full max-w-sm rounded-2xl bg-ivory p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-center gap-3 text-copper">
          <LogoMark className="h-8 w-auto" />
          <LogoName className="h-5 w-auto" />
        </div>
        <h1 className="text-center font-serif text-xl text-navy">Painel administrativo</h1>
        {erro === "sem-permissao" && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">Este usuário não tem acesso ao painel.</p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
