import type { Measurement } from "#/types.ts";

export function formatDate(iso: string) {
	const date = new Date(iso);
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function labValue(
	row: Measurement,
	key: keyof Measurement,
	unitKey: keyof Measurement,
) {
	return `${(row[key] as number).toFixed(2)} ${row[unitKey]}`;
}
