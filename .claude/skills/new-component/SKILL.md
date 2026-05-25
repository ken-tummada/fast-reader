---
name: new-component
description: Scaffold a new React component for the fast-reader app following project conventions (Radix primitives, Phosphor icons, Tailwind v4, TypeScript with verbatimModuleSyntax + erasableSyntaxOnly). Use when the user asks to create, add, or scaffold a new component.
---

# new-component

Create a new React component that matches this repo's conventions.

## Steps

1. **Confirm location.** Components live under `src/`. If there's no `src/components/` yet, create it. For feature-scoped components, prefer `src/<feature>/<ComponentName>.tsx` (e.g., `src/reader/Controls.tsx`) over a flat `components/` dump.

2. **Pick the right primitive.** Before writing anything bespoke:
   - Interactive overlays (dialog, popover, dropdown, tooltip, etc.) → compose from `radix-ui` primitives. Do not hand-roll.
   - Icons → import from `@phosphor-icons/react` (e.g., `import { Play } from '@phosphor-icons/react'`).
   - Styling → Tailwind v4 utility classes. No CSS modules, no styled-components.

3. **TypeScript hygiene.** This repo uses `verbatimModuleSyntax` and `erasableSyntaxOnly`:
   - Use `import type { ... }` for type-only imports.
   - No enums, no namespaces, no parameter properties — use string literal unions and plain types instead.
   - Props go in a `type Props = { ... }`, not `interface`.

4. **File shape.** Default export the component, name the file in PascalCase to match. Example:

   ```tsx
   import type { ReactNode } from 'react'

   type Props = {
     children: ReactNode
   }

   export default function Controls({ children }: Props) {
     return <div className="flex gap-2">{children}</div>
   }
   ```

5. **Verify.** After writing, run `pnpm lint` on the changed file and (if non-trivial) `pnpm build` to catch type errors. Mention any pending wiring the user needs to do (e.g., importing the new component into a route).

## When not to use

- For a one-off tweak to an existing component, just edit it.
- For routing/page-level work, scaffold the route in `react-router` config first, then create the component as part of that work.
