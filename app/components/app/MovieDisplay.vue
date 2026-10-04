<script setup lang="ts">
import type {
  Movie,
  MovieEpisode,
} from '../../../shared/types/movie.interface.ts';

defineProps<{ movie: Movie }>();

const currentMovieEpisode = ref<MovieEpisode>();
const openMovie = ref(false);
const openMovieEpisode = ref(false);
const openMovieEpisodeAddSource = ref(false);
</script>

<template>
  <UEpisode :id="movie.id" class="p-6">
    <template #pending>
      <div class="w-full relative h-100 flex flex-col justify-end">
        <USkeleton class="absolute inset-0 rounded-none" />

        <div class="space-y-2 p-6">
          <USkeleton class="h-4 w-70" />
          <USkeleton class="h-4 w-20" />
        </div>
      </div>

      <div class="space-y-1.5 w-full p-6">
        <USkeleton
          v-for="i in 7"
          :key="i"
          class="h-3"
          :style="{
            width: `${Math.floor(Math.random() * 5 + 6) * 10}%`,
          }"
        />
      </div>
    </template>

    <template #top>
      <div class="relative">
        <div class="h-100 overflow-hidden relative">
          <div class="aspect-auto h-full w-full bg-muted overflow-hidden">
            <img
              v-if="movie.image?.original"
              :src="movie.image.original"
              :alt="movie.name"
              class="object-cover aspect-auto w-full h-full transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <div
              v-else
              class="flex items-center justify-center w-full h-full text-muted-foreground text-sm"
            >
              Pas d'image
            </div>

            <div
              class="bg-linear-to-t from-background via-100% to-transparent backdrop-blur-lg absolute inset-0"
            ></div>
          </div>

          <div class="absolute bottom-0 inset-0 flex flex-col w-full">
            <UMovieTrendingSet :movie="movie" class="p-6" />

            <div class="p-6 mt-auto">
              <h2 class="font-semibold text-4xl">
                {{ movie.name }}
              </h2>

              <div
                v-if="movie.genres?.length"
                class="flex flex-wrap gap-1 mt-2"
              >
                <UBadge
                  v-for="genre in movie.genres"
                  :key="genre"
                  variant="tonal"
                  color="inverse"
                  class="rounded p-2 py-1"
                >
                  {{ genre }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>

        <div v-if="movie.summary" class="p-6">
          <span v-html="movie.summary"></span>
        </div>
      </div>
    </template>

    <template #season-selecter="{ seasons, setCurrentSeason, currentSeason }">
      <div
        class="px-6 bg-background/10 backdrop-blur-3xl py-2 sticky top-0 z-50 border-y"
      >
        <UDropdownMenu>
          <UDropdownMenuTrigger as-child>
            <UButton variant="tonal"> Saison {{ currentSeason }} </UButton>
          </UDropdownMenuTrigger>
          <UDropdownMenuContent align="start">
            <UDropdownMenuItem
              v-for="[s, season] in seasons"
              :key="s"
              @click="setCurrentSeason(s)"
            >
              Saison {{ s }}
            </UDropdownMenuItem>
          </UDropdownMenuContent>
        </UDropdownMenu>
      </div>
    </template>

    <template #bottom="{ currentSeasonEpisodes, currentSeason, episodes }">
      <div v-if="currentSeasonEpisodes">
        <div
          v-for="(episode, e) in currentSeasonEpisodes"
          :key="`${e}-${currentSeason}`"
          :episode
          class="flex items-center gap-2 py-3 px-6.5 mb-1 hover:bg-muted cursor-pointer"
          @click="
            currentMovieEpisode = episode;
            openMovie = false;
            openMovieEpisode = true;
          "
        >
          <div class="mr-auto font-bold">Episode {{ e + 1 }}</div>

          <!-- <UIcon
                    v-for="provider in providerGroups"
                    :key="provider.provider"
                    :name="provider.icon"
                    class="size-6"
                  /> -->
        </div>
      </div>
      <!-- <div v-else-if="episodes?.length" class="p-6">
              <EpisodeLink :episode="episodes[0]">
                <div>Regarder</div>
              </EpisodeLink>
            </div> -->
    </template>
  </UEpisode>

  <template v-if="currentMovieEpisode">
    <UModal v-model:open="openMovieEpisode" size="lg">
      <UEpisodeLink
        :episode="currentMovieEpisode"
        @add="
          openMovieEpisode = false;
          openMovieEpisodeAddSource = true;
        "
        @deleted="
          currentMovieEpisode.sources = currentMovieEpisode.sources.filter(
            (s) => s.id !== $event,
          )
        "
        @edit="openMovieEpisode = false"
      />
    </UModal>

    <UModal v-model:open="openMovieEpisodeAddSource" size="lg">
      <UEpisodeAddSource
        :movie="movie"
        :episode="currentMovieEpisode"
        @saved="openMovieEpisodeAddSource = false"
      />
    </UModal>
  </template>
</template>
