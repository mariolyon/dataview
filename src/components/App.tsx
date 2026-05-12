import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { MainContent } from "#/components/MainContent";
import { TRPCProvider } from "#/integrations/trpc/react";
import type { AppRouter } from "#/integrations/trpc/router";
import { getQueryClient } from "#/lib/queryClient";

export function App() {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				httpBatchLink({
					url: "/api/trpc",
					transformer: superjson,
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				<MainContent />
			</TRPCProvider>
		</QueryClientProvider>
	);
}
