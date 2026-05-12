import { createColumnHelper } from "@tanstack/react-table";
import { formatDate, labValue } from "#/data/formatters";
import type { Measurement } from "#/types.ts";

export const columnHelper = createColumnHelper<Measurement>();

export const measurementColumns = [
	columnHelper.accessor((_, index) => index + 1, {
		id: "rowNumber",
		header: "#",
		enableHiding: false,
	}),
	columnHelper.accessor("id", { header: "ID" }),
	columnHelper.accessor("client_id", { header: "Client" }),
	columnHelper.accessor("date_testing", {
		header: "Test Date",
		cell: (info) => formatDate(info.getValue()),
	}),
	columnHelper.accessor("date_birthdate", {
		header: "Birthdate",
		cell: (info) => formatDate(info.getValue()),
	}),
	columnHelper.accessor("gender", { header: "Gender" }),
	columnHelper.accessor("ethnicity", { header: "Ethnicity" }),
	columnHelper.accessor("creatine", {
		header: "Creatine",
		cell: ({ row }) => labValue(row.original, "creatine", "creatine_unit"),
	}),
	columnHelper.accessor("chloride", {
		header: "Chloride",
		cell: ({ row }) => labValue(row.original, "chloride", "chloride_unit"),
	}),
	columnHelper.accessor("fasting_glucose", {
		header: "Fasting Glucose",
		cell: ({ row }) =>
			labValue(row.original, "fasting_glucose", "fasting_glucose_unit"),
	}),
	columnHelper.accessor("potassium", {
		header: "Potassium",
		cell: ({ row }) =>
			labValue(row.original, "potassium", "potassium_unit"),
	}),
	columnHelper.accessor("sodium", {
		header: "Sodium",
		cell: ({ row }) => labValue(row.original, "sodium", "sodium_unit"),
	}),
	columnHelper.accessor("total_calcium", {
		header: "Total Calcium",
		cell: ({ row }) =>
			labValue(row.original, "total_calcium", "total_calcium_unit"),
	}),
	columnHelper.accessor("total_protein", {
		header: "Total Protein",
		cell: ({ row }) =>
			labValue(row.original, "total_protein", "total_protein_unit"),
	}),
];
