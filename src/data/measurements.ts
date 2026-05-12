import type { Measurement } from "#/types.ts";
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
