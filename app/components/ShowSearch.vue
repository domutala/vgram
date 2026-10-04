<script setup lang="ts">
const searchQuery = ref('');

// Configuration de useAsyncData en mode "runnable" (déclenchement manuel)
const {
  data: shows,
  pending,
  error,
  execute, // Fonction pour exécuter / relancer la requête à la demande
  clear, // Fonction pour réinitialiser les données
} = await useFetch(`/api/movie/search`, {
  immediate: false, // Empêche l'exécution automatique au chargement de la page
  lazy: true, // Empêche le blocage de la navigation
  transform: (data: any[]) => data.map((item) => item.show),
  watch: [searchQuery],
  query() {
    return { q: encodeURIComponent(searchQuery.value) };
  },
});

// Déclencheur manuel (au clic sur le bouton ou "Entrée")
const onSearch = () => {
  if (searchQuery.value.trim()) {
    execute();
  } else {
    clear();
  }
};
</script>

<template>
  <div class="search-container">
    {{ encodeURIComponent(searchQuery ?? 'break') }}
    <form @submit.prevent="onSearch" class="search-form">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher une série..."
        class="search-input"
      />
      <button type="submit" :disabled="pending" class="search-btn">
        {{ pending ? 'Recherche...' : 'Rechercher' }}
      </button>
    </form>

    <!-- Message d'erreur -->
    <div v-if="error" class="error-msg">
      Une erreur est survenue : {{ error.message }}
    </div>

    <!-- Grille des résultats -->
    <div v-if="shows && shows.length > 0" class="results-grid">
      <div v-for="show in shows" :key="show.id" class="show-card">
        <img
          :src="show.image?.medium || 'https://via.placeholder.com/210x295'"
          :alt="show.name"
        />
        <h3>{{ show.name }}</h3>
        <p v-if="show.rating?.average">⭐ {{ show.rating.average }} / 10</p>
      </div>
    </div>

    <!-- Aucun résultat trouvé -->
    <div v-else-if="shows && shows.length === 0 && !pending" class="empty-msg">
      Aucun résultat trouvé.
    </div>
  </div>
</template>
