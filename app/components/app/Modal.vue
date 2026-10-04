<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { computed, useId, useSlots } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg' | 'xl';
    role?: 'dialog' | 'alertdialog';
    closeOnBackdrop?: boolean;
    elevated?: boolean;
    flush?: boolean;
    hideSwip?: boolean;
  }>(),
  {
    size: 'md',
    role: 'dialog',
    closeOnBackdrop: true,
    elevated: false,
    flush: false,
    hideHeader: false,
    hideSwip: false,
  },
);

const emit = defineEmits<{
  close: [];
}>();

const open = defineModel<boolean>('open', { default: false });

const slots = useSlots();
const isSmallScreen = useMediaQuery('(max-width: 768px)');

const id = useId();

const sizeClass = computed(() => {
  if (!isDesktop.value) return '';

  return {
    'sm:max-w-md!': props.size === 'sm',
    'sm:max-w-lg!': props.size === 'md',
    'sm:max-w-3xl!': props.size === 'lg',
    'sm:max-w-5xl!': props.size === 'xl',
  };
});

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

const isDesktop = useMediaQuery('(min-width: 768px)');
const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogClose : DrawerClose,
}));

function close() {
  open.value = false;
}
</script>

<template>
  <component
    :is="Modal.Root"
    :dismissible="closeOnBackdrop"
    v-model:open="open"
    direction="down"
  >
    <component :is="Modal.Trigger" as-child>
      <slot name="trigger" :open :close />
    </component>
    <component
      :is="Modal.Content"
      :role="role"
      :class="[
        sizeClass,
        {
          'p-0': flush,
          'z-1100': elevated,
          'w-10/12': isDesktop,
          '[&>*:first-child]:hidden': hideSwip && !isDesktop,
        },
      ]"
      class="p-0 max-h-[calc(100dvh-6rem)] overflow-y-auto"
    >
      <!-- :class="[{ 'px-2 pb-8 *:px-4': !isDesktop }]" -->

      <slot :open :close />
    </component>
  </component>

  <!-- <UDrawer
    v-if="isSmallScreen"
    v-model:open="open"
    :dismissible="closeOnBackdrop"
    direction="down"
  >
    <UDrawerTrigger as-child>
      <slot name="trigger" />
    </UDrawerTrigger>

    <UDrawerContent
      class="max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-t-2xl shadow-float p-0"
      :class="[{ 'z-1100': elevated }]"
      :role="role"
    >
      <slot />
    </UDrawerContent>
  </UDrawer>

  <UDialog v-else v-model:open="open">
    <UDialogTrigger as-child>
      <slot name="trigger" />
    </UDialogTrigger>


    <UDialogContent
      class="max-h-[calc(100vh-2rem)] overflow-y-auto shadow-float p-0!"
      :class="[sizeClass, { 'p-0': flush, 'z-1100': elevated }]"
      :role="role"
      @pointer-down-outside="!closeOnBackdrop && $event.preventDefault()"
    >
      <slot />
    </UDialogContent>
  </UDialog> -->
</template>
