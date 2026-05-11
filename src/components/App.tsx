import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import {
	// getPaginationRowModel,
	// getSortedRowModel,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { useState } from "react";
import superjson from "superjson";
import { TRPCProvider, useTRPC } from "#/integrations/trpc/react";
import type { AppRouter } from "#/integrations/trpc/router";
import type { Measurement } from "#/types.ts";

const columnHelper = createColumnHelper<Measurement>();

const columns = [
	columnHelper.accessor("id", {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
	}),
	columnHelper.accessor("client_id", {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
	}),
	columnHelper.accessor("date_testing", {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
	}),
	columnHelper.accessor("date_birthdate", {
		cell: (info) => info.getValue(),
		footer: (info) => info.column.id,
	}),
];

function Measurements() {
	const trpc = useTRPC();

	const loadQuery = useQuery(trpc.measurements.load.queryOptions());

	const data = loadQuery.data;

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<table className="border-separate border-spacing-2">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className="p-0">
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="p-0">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});
}

function ResetButton() {
	const trpc = useTRPC();

	const resetData = useMutation(
		trpc.measurements.reset.mutationOptions({
			onSuccess: async (data) => {
				await getQueryClient().invalidateQueries(
					trpc.measurements.load.queryOptions(),
				);
				console.debug(data);
			},
			onError: () => {},
		}),
	);

	return (
		<button
			type="button"
			onClick={() => resetData.mutate()}
			disabled={resetData.isPending}
		>
			{resetData.isPending ? "Reseting..." : "Reset"}
		</button>
	);
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return makeQueryClient();
	} else {
		// Browser: make a new query client if we don't already have one
		// This is very important, so we don't re-make a new client if React
		// suspends during the initial render. This may not be needed if we
		// have a suspense boundary BELOW the creation of the query client
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
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
				<Measurements />
				<ResetButton />
			</TRPCProvider>
		</QueryClientProvider>
	);
}
