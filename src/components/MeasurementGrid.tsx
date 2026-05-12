import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { debounce } from "perfect-debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDate, labValue } from "#/data/formatters";
import { useTRPC } from "#/integrations/trpc/react";
import { getQueryClient } from "#/lib/queryClient.ts";
import type { Measurement } from "#/types.ts";
import { Pagination } from "./Pagination";

const routeApi = getRouteApi("/");
const columnHelper = createColumnHelper<Measurement>();
const PAGE_SIZE = 10;

export function MeasurementGrid() {
	const trpc = useTRPC();
	const loaderData = routeApi.useLoaderData();
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [lastPage, setLastPage] = useState(0);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
	const columnMenuRef = useRef<HTMLDivElement>(null);

	const [allMeasurements, setAllMeasurements] = useState<Measurement[]>([]);
	const [localPageIndex, setLocalPageIndex] = useState(0);

	const [initialLoad, setInitialLoad] = useState(true);

	const loadQuery = useQuery({
		...trpc.measurements.load.queryOptions({ page: lastPage }),
		placeholderData: keepPreviousData,
		initialData: lastPage === 0 && initialLoad ? loaderData : undefined,
		refetchOnMount: false,
	});

	useEffect(() => {
		setInitialLoad(false);
	}, []);

	const resetData = useMutation(
		trpc.measurements.reset.mutationOptions({
			onSuccess: async () => {
				getQueryClient().removeQueries();
				setLastPage(0);
			},
			onError: () => {},
		}),
	);

	// Accumulate and handle data changes (including reset)
	useEffect(() => {
		if (loadQuery.data && !loadQuery.isPlaceholderData) {
			if (lastPage === 0) {
				setAllMeasurements(loadQuery.data);
				setLocalPageIndex(0);
			} else {
				setAllMeasurements((prev) => {
					return [...prev, ...loadQuery.data];
				});
			}
		}
	}, [loadQuery.data, loadQuery.isPlaceholderData, lastPage]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const columns = useMemo(
		() => [
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
		],
		[columnVisibility, sorting],
	);

	const table = useReactTable({
		data: allMeasurements,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: false,
		manualFiltering: false,
		manualSorting: false,
		autoResetPageIndex: false,
		state: {
			columnVisibility,
			sorting,
			pagination: {
				pageIndex: localPageIndex,
				pageSize: PAGE_SIZE,
			},
		},
		onColumnVisibilityChange: setColumnVisibility,
		onSortingChange: setSorting,
		onPaginationChange: (updater) => {
			const nextState =
				typeof updater === "function"
					? updater({ pageIndex: localPageIndex, pageSize: PAGE_SIZE })
					: updater;
			setLocalPageIndex(nextState.pageIndex);
		},
	});

	// Trigger jump to last page only after the table actually gains more pages
	useEffect(() => {
		const pageCount = table.getPageCount();
		if (pageCount > 0) {
			setLocalPageIndex(pageCount - 1);
			table.setPageIndex(pageCount - 1);
		}
		//}
	}, [table.getPageCount()]);

	const handleLoadMore = useCallback(() => {
		console.log(`lastPage ${lastPage} - getting more`);
		setLastPage(lastPage + 1);
	}, [lastPage]);

	const handleReset = useCallback(async () => {
		await resetData.mutate();
		setLastPage(0);
	}, [resetData]);

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
	const hideableColumns = table
		.getAllLeafColumns()
		.filter((column) => column.getCanHide());

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

	const debouncedHandleLoadMore = useMemo(
		() => debounce(handleLoadMore, 100),
		[handleLoadMore],
	);

	const debouncedHandleReset = useMemo(
		() => debounce(handleReset, 100),
		[handleReset],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-end gap-4">
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
						<div className="absolute z-10 right-0 mt-2 w-56 rounded border bg-white p-3 shadow">
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
									className={
										"whitespace-nowrap px-2 py-2 text-right font-semibold text-gray-700 " +
										(header.column.getCanSort()
											? "cursor-pointer select-none"
											: "")
									}
									onClick={header.column.getToggleSortingHandler()}
								>
									{header.isPlaceholder ? null : (
										<div className="flex items-center justify-end gap-1">
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											{{
												asc: " 🔼",
												desc: " 🔽",
											}[header.column.getIsSorted() as string] ?? null}
										</div>
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
				table={table}
				onLoadMore={debouncedHandleLoadMore}
				isFetching={loadQuery.isFetching}
				onReset={debouncedHandleReset}
				isResetting={resetData.isPending}
			/>
		</div>
	);
}
