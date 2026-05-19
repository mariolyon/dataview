import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import {
	createManyMeasurements,
	deleteAllMeasurements,
	getMeasurements,
} from "#/data/measurements";
import type { Measurement } from "#/types.ts";
import { getPageSize } from "../../config.ts";
import { publicProcedure, router } from "./init";

async function fetchMoreMeasurements() {
	const response = await fetch("https://mockapi-furw4tenlq-ez.a.run.app/data");
	if (!response.ok) {
		throw new Error(`Failed to fetch measurements: ${response.statusText}`);
	}
	const data = await response.json();

	const parsedData = data.map((measurement: Measurement) => ({
		...measurement,
		date_testing: new Date(measurement.date_testing),
		date_birthdate: new Date(measurement.date_birthdate),
	}));

	await createManyMeasurements(parsedData);
}

const measurementsRouter = {
	load: publicProcedure
		.input(
			z.object({ page: z.number().int().optional().default(0) }).optional(),
		)
		.query(async (opts) => {
			const { input } = opts;
			const PAGE_SIZE = getPageSize();

			let result: Measurement[] = [];
			let attempts = 0;
			while (result.length < PAGE_SIZE && attempts < PAGE_SIZE) {
				result = await getMeasurements(input?.page ?? 0);

				if (result.length < PAGE_SIZE) {
					await fetchMoreMeasurements();
					attempts++;
				}
			}
			return result;
		}),
	reset: publicProcedure.mutation(async () => {
		await deleteAllMeasurements();
	}),
} satisfies TRPCRouterRecord;

export const appRouter = router({
	measurements: measurementsRouter,
});
export type AppRouter = typeof appRouter;
