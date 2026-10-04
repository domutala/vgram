<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { Movie } from '../../shared/types/movie.interface.ts';

const { siteUrl } = useConfig();
const SITE_NAME = useRuntime().public.siteName;

const route = useRoute();
const router = useRouter();

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '');
const activeQuery = computed(() =>
  typeof route.query.q === 'string' ? route.query.q.trim() : '',
);

const {
  data: shows,
  pending,
  error,
  execute,
} = await useFetch<{ show: Movie; score: number }[]>('/api/movie/search', {
  watch: false,
  query: computed(() => ({ q: searchQuery.value.trim() || undefined })),
});

const heading = computed(() =>
  activeQuery.value
    ? `Résultats pour « ${activeQuery.value} »`
    : 'Séries tendances',
);

const title = computed(() =>
  activeQuery.value
    ? `${activeQuery.value} – Recherche de séries`
    : 'Où regarder vos séries en streaming',
);

const description = computed(() =>
  activeQuery.value
    ? `Résultats de recherche pour « ${activeQuery.value} » : trouvez où regarder la série.`
    : 'Retrouvez vos séries préférées sur Telegram, épisode par épisode. Recherchez une série et découvrez où la regarder.',
);

useSeoMeta({
  title,
  description,
  robots: () => (activeQuery.value ? 'noindex, follow' : 'index, follow'),
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
    { '@type': 'WebSite', name: SITE_NAME, url: `${siteUrl}/` },
  ];

  if (!activeQuery.value && shows.value?.length) {
    graph.push({
      '@type': 'ItemList',
      itemListElement: shows.value.map(({ show }, i) => ({
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

async function onSearch() {
  const q = searchQuery.value.trim();
  await router.replace({ query: q ? { q } : {} });
  await execute();
}

function slugify(input: string) {
  // inchangée
}

watchDebounced(searchQuery, onSearch, { debounce: 400 });
</script>

<template>
  <div class="container mx-auto py-12 px-4 max-w-9xl">
    <form
      role="search"
      class="w-full max-w-7xl items-center gap-2 mx-auto mb-20"
      @submit.prevent="onSearch"
    >
      <UInputGroup size="lg" class="h-16 rounded-xl border-0 ring ring-muted">
        <UInputGroupInput
          v-model="searchQuery"
          type="search"
          aria-label="Rechercher une série"
          placeholder="Rechercher une série (ex: Breaking Bad)..."
        />
        <UInputGroupAddon>
          <UIcon name="lucide:search" />
        </UInputGroupAddon>

        <UInputGroupAddon v-if="pending" align="inline-end">
          <USpinner class="mr-3" />
        </UInputGroupAddon>
      </UInputGroup>
    </form>

    <div v-if="error" class="text-center text-destructive py-4 font-medium">
      Une erreur est survenue lors de la récupération des données.
    </div>

    <section aria-live="polite">
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

        <template v-else-if="shows?.length">
          <UMovieCard
            v-for="({ show }, i) in shows"
            :key="show.id"
            :movie="show"
            :priority="i < 4"
          />
        </template>

        <p
          v-else-if="shows && !pending"
          class="text-center text-muted-foreground py-12 col-span-full"
        >
          Aucune série ne correspond à votre recherche.
        </p>
      </div>
    </section>
  </div>
</template>
