import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	deleteAllMeasurements,
	getMeasurements,
} from "../../data/measurements";
import { appRouter } from "./router";

// Mock the service layer instead of Prisma directly
vi.mock("../../data/measurements", () => ({
	getMeasurements: vi.fn(),
	deleteAllMeasurements: vi.fn(),
	createManyMeasurements: vi.fn(),
}));

vi.mock("../../config.ts", () => ({
	getPageSize: vi.fn(() => 10),
}));

describe("measurementsRouter", () => {
	const caller = appRouter.createCaller({} as any);

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock fetch to prevent external calls
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => [],
		});
	});

	describe("load procedure", () => {
		it("should call getMeasurements with default page 0", async () => {
			const mockData = [{ id: 1, client_id: "test-1" }];
			vi.mocked(getMeasurements).mockResolvedValue(mockData as any);

			const result = await caller.measurements.load();

			expect(getMeasurements).toHaveBeenCalledWith(0);
			expect(result).toEqual(mockData);
		});

		it("should use the provided page parameter", async () => {
			vi.mocked(getMeasurements).mockResolvedValue([]);

			await caller.measurements.load({ page: 2 });

			expect(getMeasurements).toHaveBeenCalledWith(2);
		});

		it("should throw validation error when page is not an integer", async () => {
			await expect(
				caller.measurements.load({ page: 1.5 } as any),
			).rejects.toThrow();
		});

		it("should throw validation error when page is not a number", async () => {
			await expect(
				caller.measurements.load({ page: "1" } as any),
			).rejects.toThrow();
		});
	});

	describe("reset procedure", () => {
		it("should call deleteAllMeasurements", async () => {
			await caller.measurements.reset();
			expect(deleteAllMeasurements).toHaveBeenCalled();
		});
	});
});
