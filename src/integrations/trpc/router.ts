import type {TRPCRouterRecord} from "@trpc/server";
import {z} from "zod";
import type {Measurement} from "#/types.ts";
import {publicProcedure, router} from "./init";
import {prisma} from "#/db.ts";
import type {MeasurementModel} from "../../generated/prisma/models";

async function fetchMoreMeasurements() {
  const response = await fetch("https://mockapi-furw4tenlq-ez.a.run.app/data");
  if (!response.ok) {
    throw new Error(`Failed to fetch measurements: ${response.statusText}`);
  }
  const data = await response.json();

  const formattedData = data.map((item: any) => ({
    ...item,
    date_testing: new Date(item.date_testing),
    date_birthdate: new Date(item.date_birthdate),
  }));

  await prisma.measurement.createMany({
    data: formattedData,
  });
}

const measurementsRouter = {
  load: publicProcedure
    .input(z.object({page: z.number().int().optional().default(1)}).optional())
    .query(async (opts) => {
      const {input} = opts;

      let result: Measurement[] = [];
      while (result.length < 10) {
        const dbResults: MeasurementModel[] = await prisma.measurement.findMany({
          skip: ((input?.page ?? 1) - 1) * 10,
          take: 10,
        });

        result = dbResults.map((r) => ({
          ...r,
          date_testing: r.date_testing.toISOString(),
          date_birthdate: r.date_birthdate.toISOString(),
          creatine: Number(r.creatine),
          chloride: Number(r.chloride),
          fasting_glucose: Number(r.fasting_glucose),
          potassium: Number(r.potassium),
          sodium: Number(r.sodium),
          total_calcium: Number(r.total_calcium),
          total_protein: Number(r.total_protein),
        }));

        if (result.length < 10) {
          await fetchMoreMeasurements();
        }
      }
      return result;
    }),
  reset: publicProcedure.mutation(async () => {
    await prisma.measurement.deleteMany()
  }),
} satisfies TRPCRouterRecord;

export const appRouter = router({
  measurements: measurementsRouter,
});
export type AppRouter = typeof appRouter;
