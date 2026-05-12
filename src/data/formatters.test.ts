import { describe, expect, it } from "vitest";
import type { Measurement } from "#/types.ts";
import { formatDate, labValue } from "./formatters";

const measurement: Measurement = {
	id: 1,
	client_id: "client-1",
	date_testing: "2013-02-21T00:00:00",
	date_birthdate: "1990-01-01T00:00:00",
	gender: 1,
	ethnicity: 2,
	creatine: 1.236,
	chloride: 100.1,
	fasting_glucose: 90,
	potassium: 4.5,
	sodium: 140,
	total_calcium: 9.5,
	total_protein: 7,
	creatine_unit: "mg/dL",
	chloride_unit: "mmol/L",
	fasting_glucose_unit: "mg/dL",
	potassium_unit: "mmol/L",
	sodium_unit: "mmol/L",
	total_calcium_unit: "mg/dL",
	total_protein_unit: "g/dL",
};

describe("formatters", () => {
	it("formats dates as dd/mm/yyyy", () => {
		expect(formatDate("2013-02-21T00:00:00")).toBe("21/02/2013");
	});

	it("formats lab values with 2 decimals and unit", () => {
		expect(labValue(measurement, "creatine", "creatine_unit")).toBe(
			"1.24 mg/dL",
		);
		expect(labValue(measurement, "total_protein", "total_protein_unit")).toBe(
			"7.00 g/dL",
		);
	});
});
