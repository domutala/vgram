<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import type { SwitchVariants } from '.';
import { reactiveOmit } from '@vueuse/core';
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui';
import { cn } from '@/lib/utils';
import { switchThumbVariants, switchVariants } from '.';

const props = withDefaults(
  defineProps<
    SwitchRootProps & {
      size?: SwitchVariants['size'];
      color?: SwitchVariants['color'];
      shape?: SwitchVariants['shape'];
      class?: HTMLAttributes['class'];
    }
  >(),
  {
    size: 'default',
    color: 'accent',
    shape: 'rounded',
  },
);

const emits = defineEmits<SwitchRootEmits>();

const delegatedProps = reactiveOmit(props, 'class', 'size', 'color', 'shape');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    :data-size="props.size"
    :data-color="props.color"
    :data-shape="props.shape"
    v-bind="forwarded"
    :class="cn(switchVariants({ size, color, shape }), props.class)"
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="switchThumbVariants({ size, shape })"
    >
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
