<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { InputGroupRootVariants } from '.';
import { cn } from '@/lib/utils';
import { inputGroupVariants } from '.';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  size?: InputGroupRootVariants['size'];
}>();
</script>

<template>
  <div
    data-slot="input-group"
    role="group"
    :data-size="props.size"
    :class="
      cn(
        inputGroupVariants({ size: props.size }),
        'has-[>textarea]:h-auto',

        // Variants based on alignment.
        'has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
        'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

        // Error state.
        'has-[[data-slot][aria-invalid=true]]:border-danger',

        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
