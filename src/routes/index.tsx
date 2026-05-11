import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { App } from "#/components/App.tsx";

const loadMeasurements = createServerFn().handler(async () => {
	const { createCaller } = await import("#/integrations/trpc/server.ts");
	const caller = createCaller({});
	return caller.measurements.load();
});

export const Route = createFileRoute("/")({
	component: App,
	notFoundComponent: () => {
		return <p>This page does not exist</p>;
	},
	loader: () => loadMeasurements(),
});
