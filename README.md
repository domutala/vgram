# Runable + NestJS Starter

The official starter for building a **Vue application with Runable on top of NestJS**.

Runable brings modern Vue conventions to your application — routing, layouts, SSR, data loading, auto-imports, plugins, modules, and generated types — while **NestJS remains your server runtime**.

> All the Vue conventions. Your server runtime.

## Stack

This starter comes with:

- **Runable 1.2**
- **Vue 3**
- **Vue Router**
- **NestJS 12**
- **TypeScript 6**
- **Vitest**
- **Oxlint**
- **Prettier**

## Getting Started

### Install dependencies

```bash
pnpm install
```

The `prepare` script automatically runs:

```bash
runable prepare
```

This prepares the Runable application and generates the required files and types.

### Start development

```bash
pnpm start:dev
```

NestJS starts in watch mode while Runable integrates the Vue application into the server runtime.

For a standard start without watch mode:

```bash
pnpm start
```

## Build

Build the application for production:

```bash
pnpm build
```

The build happens in two stages.

First, NestJS builds the server:

```bash
nest build
```

Then the `postbuild` script automatically prepares and builds the Runable application:

```bash
tsc -p tsconfig.runable.build.json
runable build
```

You therefore only need to run:

```bash
pnpm build
```

## Production

After building the application:

```bash
pnpm start:prod
```

This starts the compiled NestJS server from:

```text
dist/main
```

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm prepare` | Prepare Runable and generate required files/types |
| `pnpm build` | Build NestJS and Runable for production |
| `pnpm start:dev` | Start NestJS in watch mode |
| `pnpm start:prod` | Start the compiled production server |
| `pnpm start` | Start the NestJS application |

## Runable + NestJS

This starter does not put another server runtime in front of NestJS.

NestJS **is your server**.

Runable integrates the Vue application into that existing runtime.

```text
┌─────────────────────────────┐
│          Vue App            │
│                             │
│  Pages · Layouts · SSR      │
│  Data · Plugins · Modules   │
└──────────────┬──────────────┘
               │
            Runable
               │
┌──────────────▼──────────────┐
│           NestJS            │
│                             │
│ Controllers · Services      │
│ Guards · Pipes · Modules    │
│ Dependency Injection        │
└──────────────┬──────────────┘
               │
        Your infrastructure
```

You keep the NestJS architecture and ecosystem you already know.

Runable adds the Vue conventions.

## Your NestJS Application Stays NestJS

You can continue building your backend normally:

```ts
import { Controller, Get } from '@nestjs/common'

@Controller('api')
export class AppController {
  @Get('hello')
  getHello() {
    return {
      message: 'Hello from NestJS',
    }
  }
}
```

Your controllers, providers, modules, guards, interceptors, pipes, middleware, WebSockets, and other NestJS features remain part of the same application.

Runable does not replace them.

## Why Runable?

Modern Vue applications benefit from conventions such as file-system routing, layouts, SSR, data loading, auto-imports, modules, and generated types.

But adopting those conventions shouldn't require replacing a backend that already fits your application.

With this starter, you get:

**Runable for the Vue experience.**

**NestJS for the server architecture.**

One application. One server runtime.

## Requirements

- Node.js 24+

## Learn More

- Runable — https://runablejs.com
- Runable GitHub — https://github.com/runablejs/runable
- NestJS — https://nestjs.com
- Vue.js — https://vuejs.org

## License

MIT