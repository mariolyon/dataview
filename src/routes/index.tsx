import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { App } from "#/components/App.tsx";

const loadInitialData = createServerFn().handler(async () => {
	const { createCaller } = await import("#/integrations/trpc/server.ts");
	const { getPageSize } = await import("#/config.ts");
	const caller = createCaller({});
	const measurements = await caller.measurements.load();
	const pageSize = getPageSize();
	return { measurements, pageSize };
});

export const Route = createFileRoute("/")({
	component: App,
	notFoundComponent: () => {
		return <p>This page does not exist</p>;
	},
	loader: () => loadInitialData(),
});
