import { describe, expect, it } from "vitest";
import { Prisma } from "../generated/prisma/client";
import { mapMeasurementModelToMeasurement } from "./measurements";

describe("measurements data utilities", () => {
	describe("mapMeasurementModelToMeasurement", () => {
		it("should correctly map MeasurementModel to Measurement", () => {
			const now = new Date();
			const birthdate = new Date("1990-01-01");

			const model = {
				id: 1,
				client_id: "client-1",
				date_testing: now,
				date_birthdate: birthdate,
				gender: 1,
				ethnicity: 1,
				creatine: new Prisma.Decimal(1.2),
				chloride: new Prisma.Decimal(100),
				fasting_glucose: new Prisma.Decimal(90),
				potassium: new Prisma.Decimal(4.5),
				sodium: new Prisma.Decimal(140),
				total_calcium: new Prisma.Decimal(9.5),
				total_protein: new Prisma.Decimal(7.0),
				creatine_unit: "mg/dL",
				chloride_unit: "mmol/L",
				fasting_glucose_unit: "mg/dL",
				potassium_unit: "mmol/L",
				sodium_unit: "mmol/L",
				total_calcium_unit: "mg/dL",
				total_protein_unit: "g/dL",
			};

			const result = mapMeasurementModelToMeasurement(model as any);

			expect(result.id).toBe(1);
			expect(result.date_testing).toBe(now.toISOString());
			expect(result.date_birthdate).toBe(birthdate.toISOString());
			expect(result.creatine).toBe(1.2);
			expect(result.chloride).toBe(100);
			expect(result.fasting_glucose).toBe(90);
		});
	});
});
