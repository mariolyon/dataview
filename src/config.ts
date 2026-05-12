export function getPageSize(): number {
	// Use process.env on server-side
	const envPageSize =
		typeof process !== "undefined" ? process.env.PAGE_SIZE : undefined;

	if (!envPageSize) return 10;

	const parsed = Number.parseInt(envPageSize, 10);
	if (Number.isNaN(parsed)) return 10;

	// Clamp between 10 and 100
	return Math.min(Math.max(parsed, 10), 100);
}

// Default for client-side if not provided via loader
export const DEFAULT_PAGE_SIZE = 10;
