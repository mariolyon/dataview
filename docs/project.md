## Project Conventions

When writing or modifying code in this repository, agents MUST adhere to the following stack-specific conventions:

### 1. Framework & Routing (TanStack Start / React Router)

- **File-based Routing**: Use `@tanstack/react-router` `createFileRoute` for defining routes inside `src/routes/`.
- **Components**: Write functional React components. Prefer server-side data fetching through tRPC where possible.

### 2. API & Data Fetching (tRPC & TanStack Query)

- **tRPC Routers**: Define procedures in `src/integrations/trpc/router.ts` (or modularize into separate files under
  `src/integrations/trpc/`).
- **Validation**: Always use `zod` for input validation in tRPC queries and mutations.
- **Client Usage**: Use the React hooks provided by `@trpc/react-query` (e.g., `trpc.measurements.load.useQuery()`)
  inside components, wrapped with the custom `useTRPC()` hook from `#/integrations/trpc/react`.

### 3. Database (Prisma)

- **Client Instance**: Always import the singleton Prisma client from `#/db.ts` (`import { prisma } from "#/db.ts"`).
- **Generated Client**: Note that the Prisma client is generated into a custom directory (`src/generated/prisma`), not
  `node_modules`. Do not attempt to import from `@prisma/client`.
- **Schema**: The database schema is located at `prisma/schema.prisma`. Use `npx prisma db push` or
  `npx prisma migrate dev` via the configured package scripts when modifying it.

### 4. Imports & Aliases

- **Subpath Imports**: Use the `#/*` prefix for all internal absolute imports, which resolves to `./src/*` as defined in
  `package.json` (e.g., `import { Type } from "#/types.ts"`).

### 5. Formatting & Linting (Biome)

- **Tooling**: This project uses Biome, not Prettier or ESLint.
- **Commands**: Run `npm run format` and `npm run lint` to automatically fix style issues. Ensure code complies with
  Biome before completing a task.

