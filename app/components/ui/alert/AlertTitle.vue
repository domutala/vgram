<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div
    data-slot="alert-title"
    :class="cn('mb-0.5 min-h-4 font-semibold tracking-tight', props.class)"
  >
    <slot />
  </div>
</template>
