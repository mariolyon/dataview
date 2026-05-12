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
- **Indentation**: Use **tabs**, not spaces, for indentation.
- **Commands**: Run `npm run format` and `npm run lint` to automatically fix style issues. Ensure code complies with
  Biome before completing a task.

### 6. Application Behavior

- **Data Loading**: The application uses a hybrid approach. Initial data is fetched on the server using `createServerFn` and
  a route loader, then passed to TanStack Query's `initialData`. Subsequent pagination is handled on the client via tRPC
  queries.
- **On-Demand Data Ingestion**: When a page is requested that doesn't have sufficient data in the local database (less
  than 10 records), the backend automatically fetches additional records from an external mock API and persists them to
  the Prisma database.
- **Pagination**:
  - **Zero-based Indexing**: The pagination state is managed using zero-based indexing (e.g., Page 1 is index 0).
  - **Fixed Page Size**: Each page displays exactly 10 measurements.
  - **Dynamic Controls**: The UI features dynamic button labeling: "Next" for previously visited pages and "Load More"
    for new pages that require potentially fetching more data.
- **State Reset**: A "Reset Data" feature is implemented that performs a destructive `deleteMany` on the measurements
  table and resets all local pagination state and query caches.

