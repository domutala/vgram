import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Alert } from "./Alert.vue";
export { default as AlertDescription } from "./AlertDescription.vue";
export { default as AlertTitle } from "./AlertTitle.vue";

export const alertVariants = cva(
  "relative flex w-full items-start gap-3 overflow-hidden rounded-lg text-sm transition-all [&_[data-slot=alert-icon]>svg]:size-5 [&_[data-slot=alert-icon]>svg]:shrink-0",
  {
    variants: {
      variant: {
        flat: "bg-[var(--alert-color)] text-[var(--alert-foreground)]",
        elevated:
          "bg-[var(--alert-color)] text-[var(--alert-foreground)] shadow-lg",
        tonal: "bg-[var(--alert-tonal)] text-[var(--alert-color)]",
        outline:
          "border border-[var(--alert-color)] bg-transparent text-[var(--alert-color)]",
        ghost: "bg-transparent text-[var(--alert-color)]",
      },
      color: {
        default:
          "[--alert-color:var(--foreground)] [--alert-foreground:var(--background)] [--alert-tonal:color-mix(in_srgb,var(--foreground)_10%,transparent)]",
        accent:
          "[--alert-color:var(--accent-color)] [--alert-foreground:var(--accent-color-foreground)] [--alert-tonal:color-mix(in_srgb,var(--accent-color)_14%,transparent)]",
        danger:
          "[--alert-color:var(--danger)] [--alert-foreground:var(--danger-foreground)] [--alert-tonal:color-mix(in_srgb,var(--danger)_12%,transparent)]",
        info:
          "[--alert-color:var(--info)] [--alert-foreground:var(--info-foreground)] [--alert-tonal:color-mix(in_srgb,var(--info)_12%,transparent)]",
        success:
          "[--alert-color:var(--success)] [--alert-foreground:var(--success-foreground)] [--alert-tonal:color-mix(in_srgb,var(--success)_12%,transparent)]",
        warning:
          "[--alert-color:var(--warning)] [--alert-foreground:var(--warning-foreground)] [--alert-tonal:color-mix(in_srgb,var(--warning)_14%,transparent)]",
        neutral:
          "[--alert-color:var(--neutral)] [--alert-foreground:var(--neutral-foreground)] [--alert-tonal:color-mix(in_srgb,var(--neutral)_12%,transparent)]",
      },
      density: {
        compact: "px-3 py-2",
        default: "px-4 py-3",
        comfortable: "px-5 py-4",
      },
      prominent: {
        true: "min-h-24 items-center [&_[data-slot=alert-icon]]:grid [&_[data-slot=alert-icon]]:size-12 [&_[data-slot=alert-icon]]:shrink-0 [&_[data-slot=alert-icon]]:place-items-center [&_[data-slot=alert-icon]]:rounded-full [&_[data-slot=alert-icon]]:bg-current/10 [&_[data-slot=alert-icon]>svg]:size-7",
      },
    },
    defaultVariants: {
      variant: "tonal",
      color: "default",
      density: "default",
      prominent: false,
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;
export type AlertType = "success" | "info" | "warning" | "error";
export type AlertBorder =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "start"
  | "end";
