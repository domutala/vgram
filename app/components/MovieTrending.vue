<script lang="ts" setup>
import type {
  Movie,
  MovieSearchResult,
} from '../../shared/types/movie.interface';

const emit = defineEmits<{ select: [movie: Movie] }>();

const { data: trending } = await useFetch<MovieSearchResult[]>(
  '/api/movie/search',
  { key: 'trending' },
);
</script>

<template>
  <section v-if="trending?.length" aria-labelledby="trending-title">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <UMovieCard
        v-for="(show, i) in trending"
        :key="show.show.id"
        :movie="show.show"
        :priority="i < 4"
      />
    </div>
  </section>
</template>
