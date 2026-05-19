export function getPageSize(): number {
	// Use process.env on server-side
	const envPageSize =
		typeof process !== "undefined" ? process.env.PAGE_SIZE : undefined;

	if (!envPageSize) return DEFAULT_PAGE_SIZE;

	const parsed = Number.parseInt(envPageSize);
	if (Number.isNaN(parsed)) return DEFAULT_PAGE_SIZE;

	// Clamp between 10 and 100
	return Math.min(Math.max(parsed, DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
}

// Default for client-side if not provided via loader
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
