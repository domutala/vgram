<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { BadgeVariants } from '.';
import { reactiveOmit } from '@vueuse/core';
import { Primitive } from 'reka-ui';
import { cn } from '../../../lib/utils';
import { badgeVariants } from '.';

const props = defineProps<
  PrimitiveProps & {
    variant?: BadgeVariants['variant'];
    color?: BadgeVariants['color'];
    class?: HTMLAttributes['class'];
  }
>();

const delegatedProps = reactiveOmit(props, 'class', 'variant', 'color');
</script>

<template>
  <Primitive
    data-slot="badge"
    :data-variant="variant"
    :data-color="color"
    :class="cn(badgeVariants({ variant, color }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
