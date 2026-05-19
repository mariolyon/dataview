import type { Measurement } from "#/types.ts";
import { prisma } from "#/db.ts";
import { getPageSize } from "../config.ts";
import type { MeasurementModel } from "../generated/prisma/models";

export function mapMeasurementModelToMeasurement(
	model: MeasurementModel,
): Measurement {
	return {
		...model,
		date_testing: model.date_testing.toISOString(),
		date_birthdate: model.date_birthdate.toISOString(),
		creatine: model.creatine.toNumber(),
		chloride: model.chloride.toNumber(),
		fasting_glucose: model.fasting_glucose.toNumber(),
		potassium: model.potassium.toNumber(),
		sodium: model.sodium.toNumber(),
		total_calcium: model.total_calcium.toNumber(),
		total_protein: model.total_protein.toNumber(),
	};
}

export async function getMeasurements(page = 0): Promise<Measurement[]> {
	const PAGE_SIZE = getPageSize();
	const dbResults = await prisma.measurement.findMany({
		skip: page * PAGE_SIZE,
		take: PAGE_SIZE,
	});

	return dbResults.map(mapMeasurementModelToMeasurement);
}

export async function createManyMeasurements(data: any[]) {
	return prisma.measurement.createMany({
		data,
	});
}

export async function deleteAllMeasurements() {
	return prisma.measurement.deleteMany();
}
