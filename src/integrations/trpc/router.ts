import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { prisma } from "#/db.ts";
import type { Measurement } from "#/types.ts";
import type { MeasurementModel } from "../../generated/prisma/models";
import { publicProcedure, router } from "./init";
import { mapMeasurementModelToMeasurement } from "#/data/measurements";

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

	await prisma.measurement.createMany({
		data: parsedData,
	});
}

const measurementsRouter = {
	load: publicProcedure
		.input(
			z.object({ page: z.number().int().optional().default(0) }).optional(),
		)
		.query(async (opts) => {
			const { input } = opts;

			let result: Measurement[] = [];
			let attempts = 0;
			const PAGE_SIZE = 10;
			while (result.length < PAGE_SIZE && attempts < PAGE_SIZE) {
				const dbResults: MeasurementModel[] = await prisma.measurement.findMany(
					{
						skip: (input?.page ?? 0) * PAGE_SIZE,
						take: PAGE_SIZE,
					},
				);

				result = dbResults.map(mapMeasurementModelToMeasurement);

				if (result.length < PAGE_SIZE) {
					await fetchMoreMeasurements();
					attempts++;
				}
			}
			return result;
		}),
	reset: publicProcedure.mutation(async () => {
		await prisma.measurement.deleteMany();
	}),
} satisfies TRPCRouterRecord;

export const appRouter = router({
	measurements: measurementsRouter,
});
export type AppRouter = typeof appRouter;
