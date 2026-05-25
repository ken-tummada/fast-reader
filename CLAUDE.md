# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

fast-reader is a speed reading / RSVP (Rapid Serial Visual Presentation) app — flashes words one at a time so the reader fixates without saccades. The UI surface is small; expect most work to be the reader view, controls (WPM, pause/resume), and ingestion of text.

## Stack

- pnpm (use `pnpm`, not `npm` or `yarn` — there's a `pnpm-lock.yaml`)
- React 19 + TypeScript, Vite 8
- Tailwind CSS v4
- Radix UI primitives (`radix-ui`)
- Phosphor Icons (`@phosphor-icons/react`)
- React Router v7

## Conventions

- **Components**: use Radix primitives (`radix-ui`) for interactive UI (dialog, dropdown, popover, etc.) rather than hand-rolling. Compose, don't replace.
- **Icons**: use `@phosphor-icons/react` rather than inline SVG or other icon libraries.
- **TypeScript**: `tsconfig.app.json` sets `erasableSyntaxOnly: true` and `verbatimModuleSyntax: true` — no enums, no namespaces, and use `import type` for type-only imports.
- **Lint**: `pnpm lint` (ESLint flat config with `typescript-eslint` + react-hooks + react-refresh, Prettier integrated).
- **Build**: `pnpm build` runs `tsc -b && vite build` — type errors fail the build.

## Gotchas

- The current `src/App.tsx` is the unedited Vite + React starter — treat it as throwaway scaffolding, not a pattern to extend.
- ESLint runs Prettier as a rule via `eslint-plugin-prettier/recommended`, so format violations show up as lint errors. Use `pnpm lint --fix` or `pnpm exec prettier --write .` to fix in bulk.

## Adding instructions

For module-specific guidance as the app grows, drop a `CLAUDE.md` into the subdirectory — it's loaded automatically when Claude works in those files.
