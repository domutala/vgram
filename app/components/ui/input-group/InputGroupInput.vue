<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { InputVariants } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  size?: InputVariants['size'];
}>();
</script>

<template>
  <Input
    data-slot="input-group-control"
    :size="props.size"
    :class="
      cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        props.class,
      )
    "
  />
</template>
