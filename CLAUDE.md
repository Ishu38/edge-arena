# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Edge Arena is a Next.js application for comparing small AI models designed for edge deployment. It displays model specifications, benchmarks, and metadata in a responsive card-based UI.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

## Architecture

```
src/
├── app/           # Next.js App Router pages and layouts
├── components/    # Reusable React components
├── data/          # Static JSON data files (models.json)
└── types/         # TypeScript type definitions
```

### Data Flow

Model data is defined in `src/data/models.json` and typed via `src/types/model.ts`. The main page imports this JSON directly and renders `ModelCard` components for each model.

### Key Types

The `AIModel` interface (`src/types/model.ts`) defines the shape of model data including:
- Basic info: `id`, `name`, `provider`, `parameters`
- Technical specs: `contextLength`, `quantization`
- Benchmarks: `mmlu`, `hellaswag`, `arc` scores
- Metadata: `tags`, `description`

## Conventions

- Components use `"use client"` directive when they need client-side interactivity
- Path alias `@/*` maps to `./src/*`
- Tailwind classes follow dark mode pattern with `dark:` variants
