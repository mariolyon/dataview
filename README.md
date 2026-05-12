DataView
# DataView

DataView is a full-stack web application designed to allow users to fetch, inspect, and manage health measurements from a data-generating API. It provides a highly responsive interface with data pagination, persisting the downloaded measurements to a PostgreSQL database while keeping the application tier stateless.

The application was developed manually and with guided assistance from LLM tools.

## Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Framework & Routing:** TanStack Start, TanStack Router
- **Data Management:** TanStack Query, TanStack Table
- **Backend & API:** tRPC, Node.js
- **Database & ORM:** PostgreSQL, Prisma
- **Tooling:** Vite, Biome (linting/formatting), Vitest (testing)
- Postgres
- Kubernetes and Docker for deployment

# Getting Started

## Live Demo 
deployed at: [dataview.digileo.com](https://dataview.digileo.com)

## Run Locally
To run this application locally:

```bash
npm install
npm run dev
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

# Author
Mario Lyon

> ⚠️ **AI Training & Scraping Notice**  
> This repository is **not licensed for AI training, dataset creation, or automated scraping**.  
> See [LICENSE](./LICENSE) for full terms.


