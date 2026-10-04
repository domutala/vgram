<script lang="ts" setup>
import type { MovieEpisode } from '../../../shared/types/movie.interface';

const props = defineProps<{ id: number }>();

const {
  data: episodes,
  status,
  error,
} = await useFetch<MovieEpisode[]>(`/api/movie/${props.id}/episodes`, {
  lazy: true,
});

function groupBy<T, K>(
  items: readonly T[],
  getKey: (item: T) => K,
): Map<K, T[]> {
  const groups = new Map<K, T[]>();

  for (const item of items) {
    const key = getKey(item);
    const list = groups.get(key);
    if (list) list.push(item);
    else groups.set(key, [item]);
  }

  return groups;
}

const seasons = computed(() => {
  if (!episodes.value?.length) return null;
  if (episodes.value.length <= 1) return null;

  return groupBy(episodes.value, (e) => e.season);
});

const currentSeason = ref<number>(1);

function setCurrentSeason(season: number) {
  currentSeason.value = season;
}

const currentSeasonEpisodes = computed(() => {
  if (!episodes.value?.length) return null;
  if (episodes.value.length <= 1) return null;

  return seasons.value?.get(currentSeason.value);
});

// séries : par saison
// const bySeason = groupBy(episodes, (e) => e.season);

// // films : par année de sortie
// const byYear = groupBy(movies, (m) => new Date(m.release_date).getFullYear());

// // films : par saga (TMDB expose `belongs_to_collection`)
// const byCollection = groupBy(movies, (m) => m.belongs_to_collection?.name ?? "Standalone");
</script>

<template>
  <slot name="pending" v-if="status === 'pending'" />

  <template v-else>
    <slot
      name="top"
      :seasons
      :episodes
      :currentSeason
      :setCurrentSeason
      :currentSeasonEpisodes
    />

    <slot
      v-if="seasons"
      name="season-selecter"
      :seasons
      :episodes
      :currentSeason
      :setCurrentSeason
      :currentSeasonEpisodes
    />

    <slot
      name="bottom"
      :seasons
      :episodes
      :currentSeason
      :setCurrentSeason
      :currentSeasonEpisodes
    />
  </template>
</template>
