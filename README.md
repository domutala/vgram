# vgram

Annuaire de sources de streaming pour séries et films, centré sur Telegram. Les données des séries viennent de [TVMaze](https://www.tvmaze.com/api) ; les sources (où regarder chaque épisode) et les tendances sont gérées dans notre propre base.

## Fonctionnalités

- Recherche de séries et fiche détaillée avec la liste des épisodes
- Sources par épisode ou par film (Telegram, Netflix…), regroupées par provider, Telegram en tête
- Tendances éditoriales gérées en base, avec repli automatique sur le planning du jour de TVMaze
- Codes d'accès individuels (hashés, désactivables, avec expiration optionnelle) pour ajouter, modifier ou supprimer des sources
- SEO : rendu serveur, balises `title` / `description` / canonical / Open Graph, JSON-LD (`WebSite`, `ItemList`, `TVSeries`)

## Stack

| Couche | Technologies |
| --- | --- |
| API | NestJS, TypeORM, PostgreSQL ([Neon](https://neon.tech)) |
| Front | Vue 3, Runable, shadcn-vue (préfixe `U`), Tailwind CSS 4 |
| Données externes | API TVMaze |
| Outils | pnpm, tsx, Vitest, oxlint, Prettier |

## Démarrage

```bash
pnpm install
cp .env.example .env   # puis renseigner les variables ci-dessous
pnpm migration:run
pnpm start:dev
```

### Variables d'environnement

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | URL Neon **avec pooling** (host en `-pooler`), utilisée par l'application |
| `DATABASE_URL_DIRECT` | URL Neon **sans pooling**, utilisée par les migrations |
| `ADMIN_CODE` | Code administrateur, uniquement pour gérer les codes d'accès |
| `VITE_SITE_URL` | URL publique du site (sans `/` final), pour les balises canonical et Open Graph |

Dans les URL Neon, supprime `channel_binding=require` si la connexion est coupée.

## Scripts

| Commande | Rôle |
| --- | --- |
| `pnpm start:dev` | Serveur en mode watch |
| `pnpm build` | Build de production |
| `pnpm start:prod` | Lance le build |
| `pnpm test` | Tests (Vitest) |
| `pnpm lint` | Lint (oxlint) |
| `pnpm migration:generate src/migrations/<nom>` | Génère une migration depuis les entités |
| `pnpm migration:run` | Applique les migrations |

## Base de données

Les migrations passent par `src/data-source.ts` et l'URL directe. Le script `typeorm` utilise `tsx` avec `tsconfig.server.json` :

```bash
tsx --tsconfig tsconfig.server.json node_modules/typeorm/cli.js -d src/data-source.ts
```

Contraintes liées à `tsx` (esbuild n'émet pas `emitDecoratorMetadata`) : chaque `@Column()` doit déclarer son `type` explicitement.

### Tables

- **`sources`** : une source de visionnage. Clés : `databaseId` (id TVMaze du film ou de l'épisode), `mediaType` (`movie` | `episode`), `tvId` (id de la série, obligatoire pour un épisode), `seasonNumber`, `episodeNumber`, `type`, `url`, `provider`, `language`, `quality`, `isActive`. Unicité sur `(mediaType, databaseId, url)`.
- **`trending_shows`** : séries mises en avant (`showId`, `position`).
- **`access_codes`** : codes d'accès (`label`, `codeHash`, `isActive`, `expiresAt`, `lastUsedAt`).

## API

Les routes marquées 🔒 exigent un code d'accès dans l'en-tête `Authorization` (`<code>` ou `Bearer <code>`).

### Séries : `/api/movie`

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/search?q=` | Recherche ; sans `q`, renvoie les tendances |
| GET | `/:id` | Détail d'une série |
| GET | `/:id/episodes` | Épisodes, chacun avec ses `sources` |
| GET | `/:id/full` | Série et épisodes en une réponse |

### Sources : `/api/source`

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/?mediaType=&databaseId=` | Sources actives d'un média |
| GET | `/exists?provider=&databaseId=` ou `&tvId=` | Un film ou une série a-t-il une source chez ce provider ? |
| POST 🔒 | `/` | Ajouter une source |
| PATCH 🔒 | `/:id` | Modifier une source |
| DELETE 🔒 | `/:id` | Supprimer une source |

### Tendances : `/api/trending`

| Méthode | Route | Description |
| --- | --- | --- |
| GET | `/exists?showId=` | La série est-elle dans les tendances ? |
| POST 🔒 | `/` | Ajouter `{ "showId": 139 }` |
| PUT 🔒 | `/order` | Réordonner `{ "showIds": [82, 139] }` |
| DELETE 🔒 | `/:showId` | Retirer |

### Codes d'accès : `/api/access-codes`

Réservé à l'administrateur (`Authorization: <ADMIN_CODE>`).

| Méthode | Route | Description |
| --- | --- | --- |
| POST | `/` | Créer `{ "label": "Moussa", "expiresAt": "2026-12-31T23:59:59Z" }` |
| GET | `/` | Lister |
| PATCH | `/:id/disable` | Désactiver (effet immédiat) |
| PATCH | `/:id/enable` | Réactiver |

Le code en clair n'est renvoyé qu'une seule fois, à la création : seul son hash SHA-256 est stocké.

```bash
curl -X POST localhost:3000/api/access-codes \
  -H "Authorization: $ADMIN_CODE" -H 'Content-Type: application/json' \
  -d '{ "label": "Moussa" }'
```

## Exemple : ajouter une source

```bash
curl -X POST localhost:3000/api/source \
  -H "Authorization: $CODE" -H 'Content-Type: application/json' \
  -d '{
    "databaseId": 4952,
    "mediaType": "episode",
    "tvId": 139,
    "seasonNumber": 1,
    "episodeNumber": 1,
    "type": "streaming",
    "provider": "Telegram",
    "url": "https://t.me/c/1551739481/27",
    "language": "fr"
  }'
```

`databaseId` est l'id de l'**épisode**, `tvId` celui de la **série** (visible dans `/api/movie/:id`).

## Structure

```
shared/types/   Types partagés Node / navigateur (aucune dépendance)
src/source/     Sources de visionnage
src/trending/   Tendances éditoriales
src/access-codes/   Codes d'accès et guards
src/shows/      Séries (proxy et enrichissement TVMaze)
src/migrations/ Migrations TypeORM
```

Les types dans `shared/` ne doivent importer ni TypeORM ni `reflect-metadata`, afin de rester utilisables côté navigateur.

## Licence

À définir.