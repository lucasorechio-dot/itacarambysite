"use client";

import { useFormStatus } from "react-dom";

export const inputCls =
  "w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/30";
export const labelCls = "grid gap-1 text-xs font-semibold uppercase tracking-wider text-navy/70";

export function SubmitButton({ children = "Salvar", className = "" }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full bg-copper px-5 py-2 text-xs font-semibold uppercase tracking-wider text-navy hover:brightness-105 disabled:opacity-60 ${className}`}
    >
      {pending ? "Salvando…" : children}
    </button>
  );
}

export function ConfirmButton({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, title }: { children: React.ReactNode; title: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" title={title} aria-label={title} disabled={pending} className="grid h-8 w-8 place-items-center rounded-full border border-navy/15 text-navy hover:bg-navy/5 disabled:opacity-40">
      {children}
    </button>
  );
}
