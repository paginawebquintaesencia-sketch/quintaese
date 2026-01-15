import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/ui-utils";

type AlertVariant = "default" | "destructive" | "success";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children?: ReactNode;
}

export function Alert({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) {
  const base =
    "fade-slide relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-xs shadow-[0_18px_45px_rgba(15,23,42,0.12)] bg-white/90";

  const variantClass =
    variant === "destructive"
      ? "border-red-100 text-red-700"
      : variant === "success"
      ? "border-emerald-100 text-emerald-700"
      : "border-neutral-200 text-neutral-800";

  const iconClass =
    variant === "destructive"
      ? "bg-red-500 text-white shadow-[0_8px_16px_rgba(248,113,113,0.55)]"
      : variant === "success"
      ? "bg-emerald-500 text-white shadow-[0_8px_16px_rgba(16,185,129,0.55)]"
      : "bg-neutral-900 text-white shadow-[0_8px_16px_rgba(15,23,42,0.55)]";

  const iconSymbol =
    variant === "destructive" ? "!" : variant === "success" ? "✓" : "i";

  return (
    <div className={cn(base, variantClass, className)} {...props}>
      <div
        className={cn(
          "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
          iconClass,
        )}
      >
        {iconSymbol}
      </div>
      <div className="flex-1 space-y-1">{children}</div>
    </div>
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 text-xs font-semibold tracking-wide", className)}
      {...props}
    ></h5>
  );
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-[11px] leading-relaxed text-neutral-700", className)}
      {...props}
    ></p>
  );
}
