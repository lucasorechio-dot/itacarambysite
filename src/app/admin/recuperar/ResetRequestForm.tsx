"use client";

import { useActionState } from "react";
import { requestPasswordReset, type FormState } from "../senha-actions";
import { inputCls, labelCls } from "@/components/admin/ui";

export function ResetRequestForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, {});

  if (state.ok) {
    return (
      <p className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-900">
        Se esse e-mail tiver acesso ao painel, você vai receber em instantes um link para criar a senha nova. Confira também a caixa de spam.
      </p>
    );
  }

  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className={labelCls}>
        E-mail
        <input name="email" type="email" autoComplete="email" required className={inputCls} />
      </label>
      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-copper py-3 text-xs font-semibold uppercase tracking-wider text-navy disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar link"}
      </button>
    </form>
  );
}
