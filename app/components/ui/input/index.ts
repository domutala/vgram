import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Input } from "./Input.vue";

export const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-accent selection:text-accent-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-input focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:border-danger",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-xs",
        default: "h-9 px-3 py-1 text-sm file:h-7 file:text-sm",
        lg: "h-11 px-4 py-2 text-base file:h-8 file:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
