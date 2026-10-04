<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { InputVariants } from '.';
import { useVModel } from '@vueuse/core';
import { cn } from '@/lib/utils';
import { inputVariants } from '.';

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  size?: InputVariants['size'];
  class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :data-size="props.size"
    :class="cn(inputVariants({ size: props.size }), props.class)"
  />
</template>
