import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { MeasurementGrid } from "#/components/MeasurementGrid";
import { TRPCProvider } from "#/integrations/trpc/react";
import type { AppRouter } from "#/integrations/trpc/router";
import { getQueryClient } from "#/lib/queryClient";

function MainContent() {
	return (
		<div className="p-8 flex flex-col gap-8">
			<h1 className="text-2xl font-bold">Data View</h1>
			<MeasurementGrid />
		</div>
	);
}

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
