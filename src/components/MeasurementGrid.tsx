import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	type VisibilityState,
	useReactTable,
} from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDate, labValue } from "#/data/formatters";
import { useTRPC } from "#/integrations/trpc/react";
import type { Measurement } from "#/types.ts";
import { Pagination } from "./Pagination";

const routeApi = getRouteApi("/");
const columnHelper = createColumnHelper<Measurement>();
const PAGE_SIZE = 10;

interface MeasurementGridProps {
	page: number;
	setPage: (page: number) => void;
	lastPage: number;
	setLastPage: (page: number) => void;
}

export function MeasurementGrid({
	page,
	setPage,
	lastPage,
	setLastPage,
}: MeasurementGridProps) {
	const trpc = useTRPC();
	const loaderData = routeApi.useLoaderData();
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
	const columnMenuRef = useRef<HTMLDivElement>(null);

	const loadQuery = useQuery({
		...trpc.measurements.load.queryOptions({ page }),
		placeholderData: keepPreviousData,
		initialData: page === 0 ? loaderData : undefined,
		refetchOnMount: false,
	});

	const data = loadQuery.data;
	const columns = useMemo(
		() => [
			columnHelper.display({
				id: "rowNumber",
				header: "#",
				cell: ({ row }) => page * PAGE_SIZE + row.index + 1,
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
			columnHelper.display({
				id: "creatine",
				header: "Creatine",
				cell: ({ row }) => labValue(row.original, "creatine", "creatine_unit"),
			}),
			columnHelper.display({
				id: "chloride",
				header: "Chloride",
				cell: ({ row }) => labValue(row.original, "chloride", "chloride_unit"),
			}),
			columnHelper.display({
				id: "fasting_glucose",
				header: "Fasting Glucose",
				cell: ({ row }) =>
					labValue(row.original, "fasting_glucose", "fasting_glucose_unit"),
			}),
			columnHelper.display({
				id: "potassium",
				header: "Potassium",
				cell: ({ row }) => labValue(row.original, "potassium", "potassium_unit"),
			}),
			columnHelper.display({
				id: "sodium",
				header: "Sodium",
				cell: ({ row }) => labValue(row.original, "sodium", "sodium_unit"),
			}),
			columnHelper.display({
				id: "total_calcium",
				header: "Total Calcium",
				cell: ({ row }) =>
					labValue(row.original, "total_calcium", "total_calcium_unit"),
			}),
			columnHelper.display({
				id: "total_protein",
				header: "Total Protein",
				cell: ({ row }) =>
					labValue(row.original, "total_protein", "total_protein_unit"),
			}),
		],
		[page],
	);

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		state: {
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
	});
	const fixedCompactColumnWidths: Record<string, string> = {
		rowNumber: "2.5rem",
		id: "4.5rem",
		gender: "4.5rem",
		ethnicity: "4.5rem",
	};
	const gridTemplateColumns = table
		.getVisibleLeafColumns()
		.map((column) => {
			const fixedWidth = fixedCompactColumnWidths[column.id];
			if (fixedWidth) {
				return fixedWidth;
			}

			return "minmax(6rem, 1fr)";
		})
		.join(" ");
	const hideableColumns = table.getAllLeafColumns().filter((column) =>
		column.getCanHide(),
	);

	useEffect(() => {
		if (!isColumnMenuOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				columnMenuRef.current &&
				!columnMenuRef.current.contains(event.target as Node)
			) {
				setIsColumnMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isColumnMenuOpen]);

	return (
		<div className="flex flex-col gap-4">
			<div ref={columnMenuRef} className="relative">
				<button
					type="button"
					onClick={() => setIsColumnMenuOpen((open) => !open)}
					className="rounded border px-3 py-1 text-sm font-medium text-gray-700"
				>
					<span className="inline-flex items-center gap-2">
						<Columns3 className="h-4 w-4" />
						Columns
					</span>
				</button>
				{isColumnMenuOpen ? (
					<div className="absolute z-10 mt-2 w-56 rounded border bg-white p-3 shadow">
						<div className="mb-2">
							<button
								type="button"
								onClick={() => {
									for (const column of hideableColumns) {
										column.toggleVisibility(true);
									}
								}}
								className="text-sm font-medium text-blue-600 hover:text-blue-700"
							>
								Show All
							</button>
						</div>
						<div className="flex flex-col gap-2">
							{hideableColumns.map((column) => {
								const label = String(column.columnDef.header ?? column.id);
								return (
									<label
										key={column.id}
										className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
									>
										<input
											type="checkbox"
											checked={column.getIsVisible()}
											onChange={column.getToggleVisibilityHandler()}
										/>
										<span>{label}</span>
									</label>
								);
							})}
						</div>
					</div>
				) : null}
			</div>
			<div className="overflow-x-auto">
				<div className="min-w-max text-sm">
					{table.getHeaderGroups().map((headerGroup) => (
						<div
							key={headerGroup.id}
							className="grid border-b-2 border-gray-300"
							style={{ gridTemplateColumns }}
						>
							{headerGroup.headers.map((header) => (
								<div
									key={header.id}
									className="whitespace-nowrap px-2 py-2 text-right font-semibold text-gray-700"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</div>
							))}
						</div>
					))}

					<div className="flex flex-col">
						{table.getRowModel().rows.map((row) => (
							<div
								key={row.id}
								className="grid border-b border-gray-200 hover:bg-gray-50"
								style={{ gridTemplateColumns }}
							>
								{row.getVisibleCells().map((cell) => (
									<div
										key={cell.id}
										className="overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2 text-right"
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>

			<Pagination
				page={page}
				lastPage={lastPage}
				setPage={setPage}
				setLastPage={setLastPage}
				disabled={!data}
				isFetching={loadQuery.isFetching}
			/>
		</div>
	);
}
