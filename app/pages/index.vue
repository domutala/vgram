<script setup lang="ts">
import MovieTrending from '../components/MovieTrending.vue';
import type {
  Movie,
  MovieSearchResult,
} from '../../shared/types/movie.interface';

const { siteUrl } = useConfig();
const SITE_NAME = useRuntime().public.siteName;

const router = useRouter();

const title = `${SITE_NAME} – Où regarder vos séries en streaming`;
const description =
  'Retrouvez vos séries préférées sur Telegram, épisode par épisode. Découvrez les séries du moment et trouvez où les regarder.';

const { data: trending } = await useFetch<MovieSearchResult[]>(
  '/api/movie/search',
  { key: 'trending' },
);

useSeoMeta({
  title,
  description,
  robots: 'index, follow',
  ogType: 'website',
  ogSiteName: SITE_NAME,
  ogLocale: 'fr_FR',
  ogUrl: `${siteUrl}/`,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
});

const jsonLd = computed(() => {
  const graph: object[] = [
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${siteUrl}/`,
      inLanguage: 'fr',
    },
  ];

  if (trending.value?.length) {
    graph.push({
      '@type': 'ItemList',
      name: 'Séries tendances',
      itemListElement: trending.value.map(({ show }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: show.name,
        url: `${siteUrl}/movie/${show.id}-${slugify(show.name)}`,
      })),
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph,
  }).replace(/</g, '\\u003c');
});

useHead({
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [{ type: 'application/ld+json', innerHTML: jsonLd }],
});

function open(movie: Movie) {
  router.push(`/movie/${movie.id}-${slugify(movie.name)}`);
}
</script>

<template>
  <div class="container mx-auto py-12 px-4 max-w-9xl">
    <div class="py-10">
      <h1 class="text-center text-3xl font-semibold mb-12">
        Trouvez où regarder vos séries sur Telegram
      </h1>
    </div>

    <MovieTrending @select="open" />
  </div>
</template>
