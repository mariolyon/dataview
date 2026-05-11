import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import type { Measurement } from "#/types.ts";
import { publicProcedure, router } from "./init";

let measurements: Measurement[] = [
	{
		id: 1,
		client_id: "3837c9fc",
		date_testing: "2019-10-02",
		date_birthdate: "1950-01-01",
		gender: 2,
		ethnicity: 5,
		creatine: 1.21,
		chloride: 118.19,
		fasting_glucose: 99.42,
		potassium: 5.41,
		sodium: 125.99,
		total_calcium: 9.79,
		total_protein: 7.9,
		creatine_unit: "mgdl",
		chloride_unit: "mmoll",
		fasting_glucose_unit: "mgdl",
		potassium_unit: "mmoll",
		sodium_unit: "ul",
		total_calcium_unit: "mgdl",
		total_protein_unit: "gdl",
	},
	{
		id: 2,
		client_id: "3837c9fc",
		date_testing: "2020-10-14",
		date_birthdate: "1950-01-01",
		gender: 2,
		ethnicity: 5,
		creatine: 0.39,
		chloride: 90.58,
		fasting_glucose: 137.9,
		potassium: 1.77,
		sodium: 68.86,
		total_calcium: 13.18,
		total_protein: 7.23,
		creatine_unit: "mgdl",
		chloride_unit: "mmoll",
		fasting_glucose_unit: "mgdl",
		potassium_unit: "mmoll",
		sodium_unit: "ul",
		total_calcium_unit: "mgdl",
		total_protein_unit: "gdl",
	},
];

const measurementsRouter = {
	load: publicProcedure
		.input(z.object({ page: z.number().int().optional() }).optional())
		.query(() => measurements),
	reset: publicProcedure.mutation(() => {
		measurements = [
			{
				id: 3,
				client_id: "ec8ab245",
				date_testing: "2018-01-01",
				date_birthdate: "1950-01-01",
				gender: 1,
				ethnicity: 5,
				creatine: 0.62,
				chloride: 104.66,
				fasting_glucose: 83.72,
				potassium: 2.78,
				sodium: 82.36,
				total_calcium: 5.81,
				total_protein: 13.55,
				creatine_unit: "mgdl",
				chloride_unit: "mmoll",
				fasting_glucose_unit: "mgdl",
				potassium_unit: "mmoll",
				sodium_unit: "ul",
				total_calcium_unit: "mgdl",
				total_protein_unit: "gdl",
			},
		];
		return measurements;
	}),
} satisfies TRPCRouterRecord;

export const appRouter = router({
	measurements: measurementsRouter,
});
export type AppRouter = typeof appRouter;
