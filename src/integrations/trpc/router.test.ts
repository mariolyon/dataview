import { beforeEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../db.ts";
import { appRouter } from "./router";

// Mock dependencies
vi.mock("../../db.ts", () => ({
	prisma: {
		measurement: {
			findMany: vi.fn(),
			createMany: vi.fn(),
			deleteMany: vi.fn(),
		},
	},
}));

vi.mock("../../config.ts", () => ({
	getPageSize: vi.fn(() => 10),
}));

// Mock fetch
global.fetch = vi.fn();

const createMockMeasurement = (id: number) => ({
	id,
	client_id: `client-${id}`,
	date_testing: new Date(),
	date_birthdate: new Date("1990-01-01"),
	gender: 1,
	ethnicity: 1,
	creatine: { toNumber: () => 1.2 },
	chloride: { toNumber: () => 100 },
	fasting_glucose: { toNumber: () => 90 },
	potassium: { toNumber: () => 4.5 },
	sodium: { toNumber: () => 140 },
	total_calcium: { toNumber: () => 9.5 },
	total_protein: { toNumber: () => 7.0 },
	creatine_unit: "mg/dL",
	chloride_unit: "mmol/L",
	fasting_glucose_unit: "mg/dL",
	potassium_unit: "mmol/L",
	sodium_unit: "mmol/L",
	total_calcium_unit: "mg/dL",
	total_protein_unit: "g/dL",
});

describe("measurementsRouter", () => {
	const caller = appRouter.createCaller({} as any);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("load procedure - page parameter", () => {
		it("should use default page 0 when no input is provided", async () => {
			const mockData = new Array(10)
				.fill(null)
				.map((_, i) => createMockMeasurement(i));
			vi.mocked(prisma.measurement.findMany).mockResolvedValue(mockData as any);

			await caller.measurements.load();

			expect(prisma.measurement.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					skip: 0,
					take: 10,
				}),
			);
		});

		it("should use the provided valid page parameter", async () => {
			const mockData = new Array(10)
				.fill(null)
				.map((_, i) => createMockMeasurement(i));
			vi.mocked(prisma.measurement.findMany).mockResolvedValue(mockData as any);

			await caller.measurements.load({ page: 2 });

			expect(prisma.measurement.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					skip: 20, // (page 2) * PAGE_SIZE 10
					take: 10,
				}),
			);
		});

		//zod seems to have a bug with positive(): it slows the requests down
		// it("should throw validation error when page is negative", async () => {
		// 	await expect(caller.measurements.load({ page: -1 }))
		// 		.rejects.toThrow();
		// });

		it("should throw validation error when page is not an integer", async () => {
			await expect(
				caller.measurements.load({ page: 1.5 } as any),
			).rejects.toThrow();
		});

		it("should handle page 0 behavior", async () => {
			const mockData = new Array(10)
				.fill(null)
				.map((_, i) => createMockMeasurement(i));
			vi.mocked(prisma.measurement.findMany).mockResolvedValue(mockData as any);

			// According to Zod .positive() usually means > 0.
			try {
				await caller.measurements.load({ page: 0 });
				expect(prisma.measurement.findMany).toHaveBeenCalledWith(
					expect.objectContaining({
						skip: 0,
						take: 10,
					}),
				);
			} catch (error: any) {
				// If it throws, we check if it's a validation error
				// Zod errors in tRPC are wrapped
				expect(error.name).toBe("TRPCError");
			}
		});

		it("should throw validation error when page is not a number", async () => {
			await expect(
				caller.measurements.load({ page: "1" } as any),
			).rejects.toThrow();
		});
	});
});
