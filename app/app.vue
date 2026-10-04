<script lang="ts" setup>
import { Toaster } from './components/ui/sonner';

const { initializeTheme } = useTheme();

onMounted(initializeTheme);
</script>

<template>
  <RunableLayout>
    <UTooltipProvider>
      <RunablePage />
    </UTooltipProvider>

    <Toaster />
  </RunableLayout>
</template>
