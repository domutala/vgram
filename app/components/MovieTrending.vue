<script lang="ts" setup>
import type {
  Movie,
  MovieSearchResult,
} from '../../shared/types/movie.interface';

const emit = defineEmits<{ select: [movie: Movie] }>();

const { data: trending, pending } = await useFetch<MovieSearchResult[]>(
  '/api/movie/search',
  { key: 'trending' },
);
</script>

<template>
  <section aria-labelledby="trending-title">
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="pending">
        <UCard
          v-for="i in 10"
          :key="i"
          class="overflow-hidden flex flex-col h-full p-0 shadow-none rounded-none border-0 relative"
        >
          <USkeleton class="aspect-2/3 w-full bg-foreground/10" />

          <div class="space-y-2 p-6 absolute w-full bottom-0">
            <USkeleton class="h-4 w-70 bg-foreground/10" />
            <USkeleton class="h-4 w-20 bg-foreground/10" />
          </div>
        </UCard>
      </template>

      <template v-else-if="trending?.length">
        <UMovieCard
          v-for="(show, i) in trending"
          :key="show.show.id"
          :movie="show.show"
          :priority="i < 4"
        />
      </template>
    </div>
  </section>
</template>
