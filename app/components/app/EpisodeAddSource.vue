<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import * as _ from 'lodash-es';
import { toast } from 'vue-sonner';

import { Button } from '../ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  SourceMediaType,
  SourceType,
  type SourceData,
} from '../../../shared/types/source.interface';
import type {
  MovieEpisode,
  Movie,
} from '../../../shared/types/movie.interface';

const PROVIDERS: Record<string, { name: string; icon: string }> = {
  telegram: { name: 'Telegram', icon: 'logos:telegram' },
  netflix: { name: 'Netflix', icon: 'logos:netflix' },
};
const LANGUAGES = { fr: 'Français', en: 'English' };

const { code, hasCode, clear } = useAccessCode();
const props = defineProps<{ episode: MovieEpisode; movie: Movie }>();
const emit = defineEmits<{ saved: [source: SourceData] }>();

const submitting = ref(false);

const formSchema = toTypedSchema(
  z.object({
    provider: z.enum(
      Object.keys(PROVIDERS),
      'Choisis une plateforme dans la liste.',
    ),
    language: z.enum(Object.keys(LANGUAGES), 'Choisis la langue de la source.'),
    url: z.httpUrl('Entre un lien valide, commençant par http:// ou https://.'),
    accessCode: z
      .string("Le code d'accès est requis.")
      .trim()
      .min(1, "Le code d'accès est requis."),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    provider: 'telegram',
    language: 'fr',
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  if (submitting.value) return;

  submitting.value = true;

  try {
    const data = _.cloneDeep(values);
    _.unset(data, 'accessCode');

    const source = await $fetch<SourceData>('/api/source', {
      method: 'POST',
      headers: { Authorization: values.accessCode.trim() },
      body: {
        ...data,
        databaseId: props.episode.id,
        mediaType: SourceMediaType.EPISODE,
        tvId: props.movie.id,
        seasonNumber: props.episode.season,
        episodeNumber: props.episode.number,
        type: SourceType.STREAMING,
        // quality: orUndefined(form.quality),
        // language: orUndefined(form.language)?.toLowerCase(),
      },
      onResponseError(e) {
        if (e.response.status === 401) {
          toast.error("Code d'accès invalide ou désactivé");
        } else {
          toast.error("Impossible d'ajouter la source");
        }
      },
    });

    code.value = values.accessCode.trim();
    toast.success('Source ajoutée');

    emit('saved', source);
  } catch (error) {
    console.log(error);
  } finally {
    submitting.value = false;
  }
});

onMounted(() => {
  form.setFieldValue('accessCode', code.value);
});
</script>

<template>
  <form class="space-y-6 p-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="provider">
      <FormItem>
        <FormLabel>Provider</FormLabel>
        <FormControl>
          <USelect v-bind="componentField">
            <USelectTrigger>
              <USelectValue placeholder="Select a fruit" />
            </USelectTrigger>
            <USelectContent>
              <USelectItem
                v-for="(provider, p) in PROVIDERS"
                :key="p"
                :value="p"
              >
                {{ provider.name }}
              </USelectItem>
            </USelectContent>
          </USelect>

          <!-- <Input type="text" placeholder="shadcn" v-bind="componentField" /> -->
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="url">
      <FormItem>
        <FormLabel>Lien</FormLabel>
        <FormControl>
          <Input placeholder="url" v-bind="componentField" />
        </FormControl>

        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="language">
      <FormItem>
        <FormLabel>Langue</FormLabel>
        <FormControl>
          <USelect v-bind="componentField">
            <USelectTrigger>
              <USelectValue placeholder="Selectionnez une langue" />
            </USelectTrigger>
            <USelectContent>
              <USelectItem
                v-for="(language, l) in LANGUAGES"
                :key="l"
                :value="l"
              >
                {{ language }}
              </USelectItem>
            </USelectContent>
          </USelect>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="accessCode">
      <FormItem>
        <FormLabel>Code d'accès</FormLabel>
        <FormControl>
          <UInput v-bind="componentField" autocomplete="off"> </UInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :disabled="submitting">
      <USpinner v-if="submitting" />
      Ajouter
    </Button>
  </form>
</template>
