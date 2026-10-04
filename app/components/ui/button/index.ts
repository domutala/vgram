import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--button-color)_30%,transparent)] aria-invalid:border-danger aria-invalid:ring-danger/20",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-color)] text-[var(--button-foreground)] hover:brightness-95 active:brightness-90",
        flat:
          "bg-[var(--button-color)] text-[var(--button-foreground)] hover:brightness-95 active:brightness-90",
        elevated:
          "bg-[var(--button-color)] text-[var(--button-foreground)] shadow-md hover:-translate-y-px hover:shadow-lg hover:brightness-95 active:translate-y-0 active:shadow-sm",
        tonal:
          "bg-[var(--button-tonal)] text-[var(--button-color)] hover:bg-[var(--button-tonal-hover)]",
        outline:
          "border border-[var(--button-color)] bg-transparent text-[var(--button-color)] hover:bg-[var(--button-tonal)]",
        ghost:
          "bg-transparent text-[var(--button-color)] hover:bg-[var(--button-tonal)]",
      },
      color: {
        default:
          "[--button-color:var(--foreground)] [--button-foreground:var(--background)] [--button-tonal:color-mix(in_srgb,var(--foreground)_10%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--foreground)_16%,transparent)]",
        accent:
          "[--button-color:var(--accent-color)] [--button-foreground:var(--accent-color-foreground)] [--button-tonal:color-mix(in_srgb,var(--accent-color)_14%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--accent-color)_22%,transparent)]",
        danger:
          "[--button-color:var(--danger)] [--button-foreground:var(--danger-foreground)] [--button-tonal:color-mix(in_srgb,var(--danger)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--danger)_20%,transparent)]",
        info:
          "[--button-color:var(--info)] [--button-foreground:var(--info-foreground)] [--button-tonal:color-mix(in_srgb,var(--info)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--info)_20%,transparent)]",
        success:
          "[--button-color:var(--success)] [--button-foreground:var(--success-foreground)] [--button-tonal:color-mix(in_srgb,var(--success)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--success)_20%,transparent)]",
        warning:
          "[--button-color:var(--warning)] [--button-foreground:var(--warning-foreground)] [--button-tonal:color-mix(in_srgb,var(--warning)_14%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--warning)_22%,transparent)]",
        neutral:
          "[--button-color:var(--neutral)] [--button-foreground:var(--neutral-foreground)] [--button-tonal:color-mix(in_srgb,var(--neutral)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--neutral)_20%,transparent)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "flat",
      color: "default",
      size: "default",
    },
  },
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
