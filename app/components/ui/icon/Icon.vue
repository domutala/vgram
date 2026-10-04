<script lang="ts" setup>
import { Icon } from "@iconify/vue";
import { computed } from "vue";

const props = defineProps<{ name: string }>();

const iconName = computed(() => {
  if (props.name.includes(":")) return props.name;

  const separatorIndex = props.name.indexOf("/");
  if (separatorIndex === -1) return props.name;

  return `${props.name.slice(0, separatorIndex)}:${props.name.slice(separatorIndex + 1)}`;
});
</script>

<template>
  <Icon :icon="iconName" />
</template>
