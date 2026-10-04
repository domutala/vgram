import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Switch } from "./Switch.vue";

export const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center border border-transparent bg-input p-0.5 shadow-xs transition-colors outline-none data-[state=checked]:bg-[var(--switch-color)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--switch-color)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
      color: {
        default: "[--switch-color:var(--foreground)]",
        accent: "[--switch-color:var(--accent-color)]",
        danger: "[--switch-color:var(--danger)]",
        info: "[--switch-color:var(--info)]",
        success: "[--switch-color:var(--success)]",
        warning: "[--switch-color:var(--warning)]",
        neutral: "[--switch-color:var(--neutral)]",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "default",
      color: "accent",
      shape: "rounded",
    },
  },
);

export const switchThumbVariants = cva(
  "pointer-events-none block bg-background shadow-sm ring-0 transition-transform data-[state=unchecked]:translate-x-0",
  {
    variants: {
      size: {
        sm: "size-3 data-[state=checked]:translate-x-3",
        default: "size-4 data-[state=checked]:translate-x-4",
        lg: "size-5 data-[state=checked]:translate-x-5",
      },
      shape: {
        rounded: "rounded-full",
        square: "rounded-[calc(var(--radius)-4px)]",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "rounded",
    },
  },
);

export type SwitchVariants = VariantProps<typeof switchVariants>;
