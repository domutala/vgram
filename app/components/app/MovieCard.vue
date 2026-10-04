<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { Movie } from '../../../shared/types/movie.interface';

const props = defineProps<{ movie: Movie; priority?: boolean }>();
const emit = defineEmits<{ select: [movie: Movie] }>();

const { code, hasCode, clear } = useAccessCode();

const to = computed(() => ({
  name: 'movie',
  params: { movie: `${props.movie.id}-${slugify(props.movie.name)}` },
}));

const plainSummary = computed(() =>
  (props.movie.summary ?? '').replace(/<[^>]*>/g, '').trim(),
);

const { data: hasTelegram } = useFetch<{ exists: boolean }>(
  '/api/source/exists',
  { query: { provider: 'telegram', tvId: props.movie.id } },
);

const currentMovie = ref<Movie>();
const openMovie = ref(false);
</script>

<template>
  <article class="h-full" itemscope itemtype="https://schema.org/TVSeries">
    <UCard
      class="[&:not(:hover):not(:focus-within)>.details]:opacity-0 relative overflow-hidden flex flex-col h-full transition-all duration-200 shadow-none p-0 rounded-none border-0 cursor-pointer ring ring-muted"
    >
      <div class="relative aspect-auto h-full w-full bg-muted overflow-hidden">
        <img
          v-if="movie.image?.medium"
          itemprop="image"
          :src="movie.image.medium"
          :alt="`Affiche de la série ${movie.name}`"
          width="210"
          height="295"
          :loading="priority ? 'eager' : 'lazy'"
          :fetchpriority="priority ? 'high' : 'auto'"
          decoding="async"
          class="object-cover aspect-auto w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div
          v-else
          class="flex items-center justify-center w-full h-full text-muted-foreground text-sm"
        >
          Pas d'image
        </div>
      </div>

      <div
        class="details transition-opacity duration-300 ease-in-out absolute inset-0 flex flex-col justify-end"
      >
        <a
          :href="`/${movie.id}`"
          itemprop="url"
          class="absolute inset-0"
          @click.prevent="
            emit('select', movie);
            openMovie = true;
          "
        >
          <span class="sr-only">{{ movie.name }}</span>
        </a>

        <div
          class="pointer-events-none bg-linear-to-t from-background via-100% to-transparent backdrop-blur-lg relative h-full flex flex-col justify-end"
        >
          <UCardHeader>
            <UCardTitle
              itemprop="name"
              class="line-clamp-1 font-semibold sm:text-2xl"
            >
              {{ movie.name }}
            </UCardTitle>
            <UCardDescription v-if="plainSummary" class="max-md:hidden">
              <span class="line-clamp-6" itemprop="description">
                {{ plainSummary }}
              </span>
            </UCardDescription>
          </UCardHeader>

          <UCardContent
            class="px-6 pb-6 pt-2 flex flex-col justify-between gap-3"
          >
            <div v-if="movie.genres?.length" class="flex flex-wrap gap-1 mt-2">
              <UBadge
                v-for="genre in movie.genres"
                :key="genre"
                itemprop="genre"
                variant="tonal"
                color="inverse"
                class="rounded p-2 py-1"
              >
                {{ genre }}
              </UBadge>
            </div>
          </UCardContent>
        </div>
      </div>

      <UMovieTrendingSet
        :movie
        class="details absolute top-0 left-0 z-10 p-3"
      />

      <div
        v-if="hasTelegram?.exists"
        class="pointer-events-none p-3 absolute top-0 right-0"
      >
        <UIcon
          name="logos:telegram"
          class="size-7"
          role="img"
          aria-label="Disponible sur Telegram"
        />
      </div>
    </UCard>

    <template v-if="openMovie">
      <UModal v-model:open="openMovie" size="lg" hide-swip>
        <template #default="{ open }">
          <UMovieDisplay v-if="open" :movie />
        </template>
      </UModal>
    </template>
  </article>
</template>
