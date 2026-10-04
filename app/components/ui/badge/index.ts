import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export { default as Badge } from './Badge.vue';

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium transition-all [&>svg]:size-3 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--badge-color)_30%,transparent)] aria-invalid:border-danger aria-invalid:ring-danger/20',
  {
    variants: {
      variant: {
        default:
          'border-[var(--button-border)] bg-[var(--button-color)] text-[var(--button-foreground)] hover:brightness-95 active:brightness-90',
        flat: 'border-[var(--button-border)] bg-[var(--button-color)] text-[var(--button-foreground)] hover:brightness-95 active:brightness-90',
        elevated:
          'border-[var(--button-border)] bg-[var(--button-color)] text-[var(--button-foreground)] shadow-md hover:-translate-y-px hover:shadow-lg hover:brightness-95 active:translate-y-0 active:shadow-sm',
        tonal:
          'bg-[var(--button-tonal)] text-[var(--button-text)] hover:bg-[var(--button-tonal-hover)]',
        outline:
          'border-[var(--button-text)] bg-transparent text-[var(--button-text)] hover:bg-[var(--button-tonal)]',
        ghost:
          'bg-transparent text-[var(--button-text)] hover:bg-[var(--button-tonal)]',
      },
      color: {
        default:
          '[--button-color:var(--background)] [--button-foreground:var(--foreground)] [--button-tonal:color-mix(in_srgb,var(--background)_10%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--background)_16%,transparent)]',

        inverse:
          '[--button-color:var(--foreground)] [--button-foreground:var(--background)] [--button-tonal:color-mix(in_srgb,var(--foreground)_10%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--foreground)_16%,transparent)]',

        accent:
          '[--button-color:var(--accent-color)] [--button-foreground:var(--accent-color-foreground)] [--button-tonal:color-mix(in_srgb,var(--accent-color)_14%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--accent-color)_22%,transparent)]',
        danger:
          '[--button-color:var(--danger)] [--button-foreground:var(--danger-foreground)] [--button-tonal:color-mix(in_srgb,var(--danger)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--danger)_20%,transparent)]',
        info: '[--button-color:var(--info)] [--button-foreground:var(--info-foreground)] [--button-tonal:color-mix(in_srgb,var(--info)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--info)_20%,transparent)]',
        success:
          '[--button-color:var(--success)] [--button-foreground:var(--success-foreground)] [--button-tonal:color-mix(in_srgb,var(--success)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--success)_20%,transparent)]',
        warning:
          '[--button-color:var(--warning)] [--button-foreground:var(--warning-foreground)] [--button-tonal:color-mix(in_srgb,var(--warning)_14%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--warning)_22%,transparent)]',
        neutral:
          '[--button-color:var(--neutral)] [--button-foreground:var(--neutral-foreground)] [--button-tonal:color-mix(in_srgb,var(--neutral)_12%,transparent)] [--button-tonal-hover:color-mix(in_srgb,var(--neutral)_20%,transparent)]',
      },

      // variant: {
      //   default:
      //     "bg-[var(--badge-color)] text-[var(--badge-foreground)] [a&]:hover:brightness-95",
      //   flat:
      //     "bg-[var(--badge-color)] text-[var(--badge-foreground)] [a&]:hover:brightness-95",
      //   elevated:
      //     "bg-[var(--badge-color)] text-[var(--badge-foreground)] shadow-md [a&]:hover:-translate-y-px [a&]:hover:shadow-lg [a&]:hover:brightness-95",
      //   tonal:
      //     "bg-[var(--badge-tonal)] text-[var(--badge-color)] [a&]:hover:bg-[var(--badge-tonal-hover)]",
      //   outline:
      //     "border border-[var(--badge-color)] bg-transparent text-[var(--badge-color)] [a&]:hover:bg-[var(--badge-tonal)]",
      //   ghost:
      //     "bg-transparent text-[var(--badge-color)] [a&]:hover:bg-[var(--badge-tonal)]",
      // },
      // color: {
      //   default:
      //     "[--badge-color:var(--foreground)] [--badge-foreground:var(--background)] [--badge-tonal:color-mix(in_srgb,var(--foreground)_10%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--foreground)_16%,transparent)]",
      //   accent:
      //     "[--badge-color:var(--accent-color)] [--badge-foreground:var(--accent-color-foreground)] [--badge-tonal:color-mix(in_srgb,var(--accent-color)_14%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--accent-color)_22%,transparent)]",
      //   danger:
      //     "[--badge-color:var(--danger)] [--badge-foreground:var(--danger-foreground)] [--badge-tonal:color-mix(in_srgb,var(--danger)_12%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--danger)_20%,transparent)]",
      //   info:
      //     "[--badge-color:var(--info)] [--badge-foreground:var(--info-foreground)] [--badge-tonal:color-mix(in_srgb,var(--info)_12%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--info)_20%,transparent)]",
      //   success:
      //     "[--badge-color:var(--success)] [--badge-foreground:var(--success-foreground)] [--badge-tonal:color-mix(in_srgb,var(--success)_12%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--success)_20%,transparent)]",
      //   warning:
      //     "[--badge-color:var(--warning)] [--badge-foreground:var(--warning-foreground)] [--badge-tonal:color-mix(in_srgb,var(--warning)_14%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--warning)_22%,transparent)]",
      //   neutral:
      //     "[--badge-color:var(--neutral)] [--badge-foreground:var(--neutral-foreground)] [--badge-tonal:color-mix(in_srgb,var(--neutral)_12%,transparent)] [--badge-tonal-hover:color-mix(in_srgb,var(--neutral)_20%,transparent)]",
      // },
    },
    defaultVariants: {
      variant: 'flat',
      color: 'default',
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
