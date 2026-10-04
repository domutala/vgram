<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { AlertBorder, AlertType, AlertVariants } from '.';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { cn } from '@/lib/utils';
import { alertVariants } from '.';
import AlertDescription from './AlertDescription.vue';
import AlertTitle from './AlertTitle.vue';

interface Props {
  modelValue?: boolean;
  title?: string;
  text?: string;
  type?: AlertType;
  variant?: AlertVariants['variant'];
  color?: AlertVariants['color'];
  density?: AlertVariants['density'];
  border?: AlertBorder;
  prominent?: boolean;
  closable?: boolean;
  closeLabel?: string;
  icon?: boolean;
  class?: HTMLAttributes['class'];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  variant: 'tonal',
  density: 'default',
  prominent: false,
  closable: false,
  closeLabel: 'Fermer l’alerte',
  icon: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value;
  },
);

const typeColors: Record<AlertType, NonNullable<AlertVariants['color']>> = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'danger',
};

const resolvedColor = computed(
  () => props.color ?? (props.type ? typeColors[props.type] : 'default'),
);

const borderClass = computed(() => {
  const side =
    props.border === 'start'
      ? 'left'
      : props.border === 'end'
        ? 'right'
        : props.border;
  return side ? `alert-border-${side}` : undefined;
});

function close() {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
}
</script>

<template>
  <Transition name="alert">
    <div
      v-if="visible"
      data-slot="alert"
      :data-type="type"
      :data-variant="variant"
      :data-density="density"
      :class="
        cn(
          alertVariants({ variant, color: resolvedColor, density, prominent }),
          borderClass,
          props.class,
        )
      "
      role="alert"
    >
      <div
        v-if="icon || $slots.prepend"
        data-slot="alert-icon"
        aria-hidden="true"
      >
        <slot name="prepend">
          <CheckCircle2 v-if="icon && type === 'success'" />
          <AlertTriangle v-else-if="icon && type === 'warning'" />
          <AlertCircle v-else-if="icon && type === 'error'" />
          <Info v-else-if="icon" />
        </slot>
      </div>

      <div class="min-w-0 flex-1 self-center">
        <AlertTitle v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </AlertTitle>
        <AlertDescription v-if="text">{{ text }}</AlertDescription>
        <slot />
      </div>

      <slot name="append" />
      <slot v-if="closable" name="close" :close="close">
        <button
          type="button"
          data-slot="alert-close"
          :aria-label="closeLabel"
          class="-m-1 grid size-8 shrink-0 place-items-center rounded-md text-current opacity-70 transition hover:bg-current/10 hover:opacity-100 focus-visible:outline-none"
          @click="close"
        >
          <X class="size-4" />
        </button>
      </slot>
    </div>
  </Transition>
</template>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

.alert-border-top {
  border-top: 4px solid var(--alert-color);
}
.alert-border-right {
  border-right: 4px solid var(--alert-color);
}
.alert-border-bottom {
  border-bottom: 4px solid var(--alert-color);
}
.alert-border-left {
  border-left: 4px solid var(--alert-color);
}
</style>
