<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue';
import type { HeaderMode, HeaderToggleSide } from '.';
import { Menu, X } from '@lucide/vue';
import { Primitive } from 'reka-ui';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

defineOptions({ inheritAttrs: false });

interface Props {
  as?: string | Component;
  title?: string;
  to?: string;
  mode?: HeaderMode;
  open?: boolean;
  toggle?: boolean;
  toggleSide?: HeaderToggleSide;
  autoClose?: boolean;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'header',
  title: 'Domutala',
  to: '/',
  mode: 'modal',
  toggle: true,
  toggleSide: 'right',
  autoClose: true,
  open: undefined,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const router = useRouter();
const uncontrolledOpen = ref(false);
let removeRouteListener: (() => void) | undefined;
let previousBodyOverflow = '';
const isOpen = computed({
  get: () => props.open ?? uncontrolledOpen.value,
  set: (value: boolean) => {
    uncontrolledOpen.value = value;
    emit('update:open', value);
  },
});

const panelClass = computed(
  () =>
    ({
      modal:
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-xl border bg-background p-6 shadow-float',
      slideover: cn(
        'absolute inset-y-0 h-full w-[min(88vw,24rem)] bg-background p-6 shadow-float',
        props.toggleSide === 'left' ? 'left-0 border-r' : 'right-0 border-l',
      ),
      drawer:
        'absolute inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t bg-background p-6 shadow-float',
    })[props.mode],
);

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) close();
}

watch(isOpen, (value) => {
  if (typeof document === 'undefined') return;
  if (value) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = previousBodyOverflow;
  }
});

onMounted(() => {
  window.addEventListener('keydown', onKeydown);

  if (props.autoClose) {
    removeRouteListener = router?.afterEach(() => close());
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  removeRouteListener?.();
  if (typeof document !== 'undefined') {
    document.body.style.overflow = previousBodyOverflow;
  }
});
</script>

<template>
  <Primitive
    :as="props.as"
    v-bind="$attrs"
    data-slot="header"
    :class="
      cn(
        'sticky top-0 z-40 w-full bg-background/0 backdrop-blur-xs',
        props.class,
      )
    "
  >
    <slot name="top" />

    <div
      class="mx-auto flex h-(--header-height) items-center gap-4 px-6 lg:px-10"
    >
      <div data-slot="header-left" class="flex min-w-0 items-center gap-2">
        <slot
          v-if="props.toggleSide === 'left'"
          name="toggle"
          :open="isOpen"
          :toggle="toggleOpen"
        >
          <Button
            v-if="props.toggle"
            variant="ghost"
            color="default"
            size="icon"
            class="lg:hidden"
            :aria-label="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
            :aria-expanded="isOpen"
            @click="toggleOpen"
          >
            <X v-if="isOpen" />
            <Menu v-else />
          </Button>
        </slot>

        <slot name="left">
          <RunableLink
            :to="props.to"
            data-slot="header-title"
            class="truncate text-base font-semibold tracking-tight"
          >
            <slot name="title">{{ props.title }}</slot>
          </RunableLink>
        </slot>
      </div>

      <div
        data-slot="header-center"
        class="hidden min-w-0 flex-1 items-center justify-center lg:flex"
      >
        <slot />
      </div>

      <div
        data-slot="header-right"
        class="ml-auto flex items-center justify-end gap-1"
      >
        <slot name="right" />

        <slot
          v-if="props.toggleSide === 'right'"
          name="toggle"
          :open="isOpen"
          :toggle="toggleOpen"
        >
          <UButton
            v-if="props.toggle"
            variant="ghost"
            color="neutral"
            size="icon"
            class="lg:hidden"
            :aria-label="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
            :aria-expanded="isOpen"
            @click="toggleOpen"
          >
            <X v-if="isOpen" />
            <Menu v-else />
          </UButton>
        </slot>
      </div>
    </div>

    <slot name="bottom" />
  </Primitive>

  <Transition :name="`header-${props.mode}`">
    <div
      v-if="isOpen"
      data-slot="header-menu"
      :data-side="props.toggleSide"
      class="fixed inset-0 z-50 flex bg-black/45 backdrop-blur-xs lg:hidden"
      role="dialog"
      aria-modal="true"
      :aria-label="`${props.title} — Navigation`"
      @click.self="close"
    >
      <div :class="panelClass">
        <slot name="content" :close="close">
          <div class="mb-6 flex items-center justify-between gap-4">
            <RunableLink :to="props.to" class="font-semibold" @click="close">
              <slot name="title">{{ props.title }}</slot>
            </RunableLink>
            <UButton
              variant="ghost"
              color="neutral"
              size="icon-sm"
              aria-label="Fermer le menu"
              @click="close"
            >
              <X />
            </UButton>
          </div>
          <div data-slot="header-menu-body">
            <slot name="body" :close="close" />
          </div>
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.header-modal-enter-active,
.header-modal-leave-active,
.header-slideover-enter-active,
.header-slideover-leave-active,
.header-drawer-enter-active,
.header-drawer-leave-active {
  transition: opacity 200ms ease;
}

.header-modal-enter-active > div,
.header-modal-leave-active > div,
.header-slideover-enter-active > div,
.header-slideover-leave-active > div,
.header-drawer-enter-active > div,
.header-drawer-leave-active > div {
  transition:
    transform 250ms ease,
    opacity 200ms ease;
}

.header-modal-enter-from,
.header-modal-leave-to,
.header-slideover-enter-from,
.header-slideover-leave-to,
.header-drawer-enter-from,
.header-drawer-leave-to {
  opacity: 0;
}

.header-modal-enter-from > div,
.header-modal-leave-to > div {
  opacity: 0;
  transform: scale(0.96);
}

.header-slideover-enter-from > div,
.header-slideover-leave-to > div {
  transform: translateX(100%);
}

.header-slideover-enter-from[data-side='left'] > div,
.header-slideover-leave-to[data-side='left'] > div {
  transform: translateX(-100%);
}

.header-drawer-enter-from > div,
.header-drawer-leave-to > div {
  transform: translateY(100%);
}
</style>
