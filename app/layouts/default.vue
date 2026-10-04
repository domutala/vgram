<script lang="ts" setup>
const { theme, toggleTheme } = useTheme();
</script>

<template>
  <UHeader mode="slideover">
    <template #left>
      <RunableLink to="/" class="flex items-center gap-2">
        <UIcon name="basil:telegram-solid" class="size-6 text-primary" />
        <div class="italic font-sansita">vgram</div>
      </RunableLink>
    </template>

    <nav class="flex items-center gap-1 text-sm">
      <!-- <a
        href="#foundations"
        class="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >Fondations</a
      >
      <a
        href="#components"
        class="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >Composants</a
      >
      <a
        href="#alerts"
        class="rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >Alertes</a
      > -->
    </nav>

    <template #right>
      <UButton
        variant="tonal"
        color="neutral"
        size="icon"
        aria-label="Rechercher"
        as-child
      >
        <RunableLink :to="{ name: 'search' }">
          <UIcon name="lucide:search" class="size-4" />
        </RunableLink>
      </UButton>

      <UButton
        variant="ghost"
        color="neutral"
        size="icon"
        aria-label="Changer de thème"
        @click="toggleTheme"
      >
        <UIcon name="lucide:sun" v-if="theme === 'dark'" class="size-4" />
        <UIcon name="lucide:moon" v-else class="size-4" />
      </UButton>
    </template>

    <template #body="{ close }"> </template>
  </UHeader>

  <main><slot /></main>
</template>
