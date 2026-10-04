<script setup lang="ts">
import type { Movie } from '../../shared/types/movie.interface';

const props = defineProps<{
  movvie: Movie;
}>();
</script>

<template>
  <div
    :key="movvie.id"
    relative
    class="aspect-ratio-3/2 lg:aspect-ratio-25/9"
    bg-black
  >
    <div absolute top-0 right-0 lt-lg="left-0" lg="bottom-0 left-1/3">
      <Img
        width="1220"
        height="659"
        format="webp"
        :src="`/tmdb${props.movvie.image?.original}`"
        :alt="props.movvie.name"
        loading="eager"
        preload
        h-full
        w-full
        object-cover
      />
    </div>
    <div
      class="absolute bottom-0 left-0 top-0 px-10 justify-center flex-col lt-lg:bg-gradient-to-t lt-lg:right-0 lt-lg:p10 lg:px25 lg:w-2/3 lg:bg-gradient-to-r from-black via-black to-transparent"
    >
      <div>
        <h1 mt-2 text-3xl md:text-4xl lg:text-5xl line-clamp-2>
          {{ props.movvie.name }}
        </h1>

        <p
          class="mt-2 op80 leading-relaxed of-hidden line-clamp-3 md:line-clamp-5 text-xs md:text-base"
        >
          {{ props.movvie.summary }}
        </p>
      </div>
    </div>
  </div>
</template>
