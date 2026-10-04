<script lang="ts" setup>
import type { Ref } from 'vue';
import type { Movie } from '../../shared/types/movie.interface';

const id = ref<string>();
const { showError } = useAppError();
const route = useRoute();
const { siteUrl } = useConfig();

id.value = ((route.params as any).movie as string)?.split('-').at(0);

if (!id.value) {
  throw showError(new Error('Movie not found'), {
    code: 'MOVIE_NOT_FOUND',
    statusCode: 404,
    source: 'manual',
  });
}

const { data, status, error } = await useFetch<Movie>(
  `/api/shows/${id.value}`,
  // { lazy: true },
);

if (error.value || !data.value) {
  throw showError(new Error('Movie not found'), {
    code: 'MOVIE_NOT_FOUND',
    statusCode: 404,
    source: 'manual',
  });
}

const { data: telegram } = await useFetch<{ exists: boolean }>(
  '/api/source/exists',
  {
    query: { provider: 'telegram', tvId: id.value },
  },
);

const movie = data as Ref<Movie>;

const canonical = computed(
  () => `${siteUrl}/movie/${movie.value.id}-${slugify(movie.value.name)}`,
);

const title = computed(() =>
  telegram.value?.exists
    ? `${movie.value.name} – Regarder en streaming sur Telegram`
    : `${movie.value.name} – Regarder la série en streaming`,
);

const description = computed(() => {
  const text = (movie.value.summary ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const base =
    text ||
    `Découvrez où regarder la série ${movie.value.name}, épisode par épisode.`;
  return base.length > 155 ? `${base.slice(0, 154).trimEnd()}…` : base;
});

const image = computed(() => movie.value.image?.original ?? undefined);

useSeoMeta({
  title,
  description,
  robots: 'index, follow',
  ogType: 'video.tv_show',
  ogSiteName: 'MovieDB',
  ogLocale: 'fr_FR',
  ogUrl: canonical,
  ogTitle: title,
  ogDescription: description,
  ogImage: image,
  ogImageAlt: () => `Affiche de la série ${movie.value.name}`,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
});

const jsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: movie.value.name,
    description: description.value,
    url: canonical.value,
    image: image.value,
    genre: movie.value.genres,
    inLanguage: movie.value.language,
  }).replace(/</g, '\\u003c'),
);

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [{ type: 'application/ld+json', innerHTML: jsonLd }],
});
</script>

<template>
  <div
    class="relative mb-16 max-md:-mt-(--header-height) md:w-4xl md:max-w-11/12 mx-auto md:rounded-2xl md:border overflow-hidden md:mt-16"
  >
    <!-- 1. ÉTAT DE CHARGEMENT (SQUELETTE) -->
    <div v-if="status === 'pending'">
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
    </div>

    <!-- 2. AFFICHAGE DE LA SÉRIE -->
    <div v-else-if="movie" class="relative">
      <UMovieDisplay :movie />
    </div>
  </div>
</template>
