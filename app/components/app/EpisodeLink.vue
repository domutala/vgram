<script lang="ts" setup>
import { toast } from 'vue-sonner';
import type { MovieEpisode } from '../../../shared/types/movie.interface';

type EpisodeSource = MovieEpisode['sources'][number];

const props = defineProps<{ episode: MovieEpisode }>();
const emit = defineEmits<{
  add: [episode: MovieEpisode];
  edit: [source: EpisodeSource];
  deleted: [id: string];
}>();

const { code, hasCode, clear } = useAccessCode();
const deletingId = ref<string | null>(null);

const PROVIDERS: Record<string, { name: string; icon: string }> = {
  telegram: { name: 'Telegram', icon: 'logos:telegram' },
  netflix: { name: 'Netflix', icon: 'logos:netflix' },
};

const providerGroups = computed(() => {
  const map = new Map<
    string,
    { provider: string; icon: string; name: string; sources: EpisodeSource[] }
  >();

  for (const source of props.episode.sources) {
    const key = source.provider.toLowerCase();
    let group = map.get(key);
    if (!group) {
      group = {
        provider: source.provider,
        icon: PROVIDERS[key].icon ?? 'lucide:play-circle',
        name: PROVIDERS[key].name,
        sources: [],
      };
      map.set(key, group);
    }
    group.sources.push(source);
  }

  return [...map.values()];
});

async function remove(source: EpisodeSource) {
  if (!confirm('Supprimer cette source ?')) return;

  deletingId.value = source.id;
  try {
    await $fetch(`/api/source/${source.id}`, {
      method: 'DELETE',
      headers: { Authorization: code.value },
    });
    emit('deleted', source.id);
    toast.success('Source supprimée');
  } catch (e: any) {
    if (e?.statusCode === 401) {
      clear();
      toast.error("Code d'accès invalide ou désactivé");
    } else {
      toast.error('Impossible de supprimer la source');
    }
  } finally {
    deletingId.value = null;
  }
}
</script>

<template>
  <div>
    <template v-if="providerGroups.length">
      <template v-for="group in providerGroups" :key="group.provider">
        <div
          v-for="source in group.sources"
          :key="source.id"
          class="p-6 not-first:border-t"
        >
          <UButtonGroup>
            <UButton variant="tonal" as-child>
              <a :href="source.url" target="_blank" rel="noopener">
                <UIcon :name="group.icon" class="size-6" />
                Regerder sur {{ group.name }}
              </a>
            </UButton>

            <template v-if="hasCode">
              <UButtonGroupSeparator />

              <UButton
                variant="tonal"
                size="icon"
                @click="emit('edit', source)"
              >
                <UIcon name="lucide:pencil" />
              </UButton>

              <UButtonGroupSeparator />

              <UButton
                variant="tonal"
                size="icon"
                :disabled="deletingId === source.id"
                @click="remove(source)"
              >
                <USpinner v-if="deletingId === source.id" />
                <UIcon v-else name="lucide:trash-2" />
              </UButton>
            </template>
          </UButtonGroup>
        </div>
      </template>
    </template>

    <p v-else class="p-6 text-center">
      Aucune source disponible pour cet épisode.
    </p>

    <div
      class="flex justify-center p-6 border-t"
      :class="{ 'border-t': providerGroups.length }"
    >
      <UButton
        variant="elevated"
        class="rounded-3xl"
        @click="emit('add', episode)"
      >
        <UIcon name="lucide:plus" class="size-4" />
        Ajouter une source
      </UButton>
    </div>
  </div>
</template>
