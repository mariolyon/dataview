import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../db.ts";
import {
	createManyMeasurements,
	deleteAllMeasurements,
	getMeasurements,
} from "./measurements";

describe("measurements data service Integration", () => {
	beforeEach(async () => {
		// Clear data between tests
		await prisma.measurement.deleteMany();
	});

	it("should correctly store and retrieve measurements", async () => {
		const testData = [
			{
				client_id: "test-svc-1",
				date_testing: new Date(),
				date_birthdate: new Date("1990-01-01"),
				gender: 1,
				ethnicity: 1,
				creatine: 1.0,
				chloride: 100,
				fasting_glucose: 90,
				potassium: 4.0,
				sodium: 140,
				total_calcium: 9.0,
				total_protein: 6.5,
				creatine_unit: "mg/dL",
				chloride_unit: "mmol/L",
				fasting_glucose_unit: "mg/dL",
				potassium_unit: "mmol/L",
				sodium_unit: "mmol/L",
				total_calcium_unit: "mg/dL",
				total_protein_unit: "g/dL",
			},
			{
				client_id: "test-svc-2",
				date_testing: new Date(),
				date_birthdate: new Date("1992-02-02"),
				gender: 2,
				ethnicity: 2,
				creatine: 1.1,
				chloride: 101,
				fasting_glucose: 91,
				potassium: 4.1,
				sodium: 141,
				total_calcium: 9.1,
				total_protein: 6.6,
				creatine_unit: "mg/dL",
				chloride_unit: "mmol/L",
				fasting_glucose_unit: "mg/dL",
				potassium_unit: "mmol/L",
				sodium_unit: "mmol/L",
				total_calcium_unit: "mg/dL",
				total_protein_unit: "g/dL",
			},
		];

		// Test createManyMeasurements
		await createManyMeasurements(testData);

		// Test getMeasurements
		const results = await getMeasurements(0);
		expect(results).toHaveLength(2);
		expect(results[0].client_id).toBe("test-svc-1");
		expect(results[1].client_id).toBe("test-svc-2");

		// Verify mapping (Decimals should be numbers)
		expect(typeof results[0].creatine).toBe("number");
		expect(results[0].creatine).toBe(1.0);
	});

	it("should handle pagination correctly", async () => {
		// Create 15 items (assuming PAGE_SIZE is 10)
		const manyItems = Array.from({ length: 15 }, (_, i) => ({
			client_id: `page-test-${i}`,
			date_testing: new Date(),
			date_birthdate: new Date("1990-01-01"),
			gender: 1,
			ethnicity: 1,
			creatine: 1.0,
			chloride: 100,
			fasting_glucose: 90,
			potassium: 4.0,
			sodium: 140,
			total_calcium: 9.0,
			total_protein: 6.5,
			creatine_unit: "mg/dL",
			chloride_unit: "mmol/L",
			fasting_glucose_unit: "mg/dL",
			potassium_unit: "mmol/L",
			sodium_unit: "mmol/L",
			total_calcium_unit: "mg/dL",
			total_protein_unit: "g/dL",
		}));

		await createManyMeasurements(manyItems);

		// Page 0 should have 10 items
		const page0 = await getMeasurements(0);
		expect(page0).toHaveLength(10);

		// Page 1 should have 5 items
		const page1 = await getMeasurements(1);
		expect(page1).toHaveLength(5);
	});

	it("should clear all data", async () => {
		await createManyMeasurements([
			{
				client_id: "to-delete",
				date_testing: new Date(),
				date_birthdate: new Date("1990-01-01"),
				gender: 1,
				ethnicity: 1,
				creatine: 1.0,
				chloride: 100,
				fasting_glucose: 90,
				potassium: 4.0,
				sodium: 140,
				total_calcium: 9.0,
				total_protein: 6.5,
				creatine_unit: "mg/dL",
				chloride_unit: "mmol/L",
				fasting_glucose_unit: "mg/dL",
				potassium_unit: "mmol/L",
				sodium_unit: "mmol/L",
				total_calcium_unit: "mg/dL",
				total_protein_unit: "g/dL",
			},
		]);

		await deleteAllMeasurements();
		const results = await getMeasurements(0);
		expect(results).toHaveLength(0);
	});
});
