<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { Movie } from '../../../shared/types/movie.interface';

const props = defineProps<{ movie: Movie }>();

const { data: trending } = useFetch<{ exists: boolean }>(
  '/api/trending/exists',
  { query: { movieId: props.movie.id } },
);

const { code, hasCode, clear } = useAccessCode();
const toggling = ref(false);

async function toggleTrending() {
  const inTrending = !!trending.value?.exists;
  toggling.value = true;

  try {
    await $fetch(
      inTrending ? `/api/trending/${props.movie.id}` : '/api/trending',
      {
        method: inTrending ? 'DELETE' : 'POST',
        headers: { Authorization: code.value },
        body: inTrending ? undefined : { showId: props.movie.id },
      },
    );

    trending.value = { exists: !inTrending };
    toast.success(inTrending ? 'Retiré des tendances' : 'Ajouté aux tendances');
  } catch (e: any) {
    if (e?.statusCode === 401) {
      clear();
      toast.error("Code d'accès invalide ou désactivé");
    } else {
      toast.error('Action impossible');
    }
  } finally {
    toggling.value = false;
  }
}
</script>

<template>
  <div v-if="hasCode">
    <UTooltip>
      <UTooltipTrigger as-child>
        <UButton
          variant="ghost"
          size="icon"
          :disabled="toggling"
          :aria-label="
            trending?.exists ? 'Retirer des tendances' : 'Ajouter aux tendances'
          "
          @click.stop="toggleTrending"
        >
          <USpinner v-if="toggling" class="text-foreground" />
          <UIcon
            v-else
            :name="'tabler:bookmark-filled'"
            :class="{
              'text-accent-foreground': trending?.exists,
              'text-foreground': !trending?.exists,
            }"
            class="size-6"
          />
        </UButton>
      </UTooltipTrigger>
      <UTooltipContent side="left">
        <p>
          {{
            trending?.exists ? 'Retirer des tendances' : 'Ajouter aux tendances'
          }}
        </p>
      </UTooltipContent>
    </UTooltip>
  </div>
</template>
