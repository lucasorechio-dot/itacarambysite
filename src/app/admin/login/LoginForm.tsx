"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";
import { inputCls, labelCls } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className={labelCls}>
        E-mail
        <input name="email" type="email" autoComplete="email" required className={inputCls} />
      </label>
      <label className={labelCls}>
        Senha
        <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </label>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-copper py-3 text-xs font-semibold uppercase tracking-wider text-navy disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
