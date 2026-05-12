import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { debounce } from "perfect-debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTRPC } from "#/integrations/trpc/react";
import { getQueryClient } from "#/lib/queryClient.ts";
import type { Measurement } from "#/types.ts";
import { ColumnVisibilityMenu } from "./ColumnVisibilityMenu";
import { measurementColumns } from "./measurementColumns";
import { Pagination } from "./Pagination";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

const routeApi = getRouteApi("/");
const PAGE_SIZE = 10;

export function MeasurementGrid() {
	const trpc = useTRPC();
	const loaderData = routeApi.useLoaderData();
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [lastPage, setLastPage] = useState(0);
	const [sorting, setSorting] = useState<SortingState>([]);

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

	const table = useReactTable({
		data: allMeasurements,
		columns: measurementColumns,
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

	// Trigger jump to last page after the table gains more pages
	useEffect(() => {
		const pageCount = table.getPageCount();
		if (pageCount > 0) {
			setLocalPageIndex(pageCount - 1);
			table.setPageIndex(pageCount - 1);
		}
		//}
	}, [table.getPageCount()]);

	const handleLoadMore = useCallback(() => {
		setLastPage(lastPage + 1);
	}, [lastPage]);

	const handleReset = useCallback(async () => {
		resetData.mutate();
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
				<ColumnVisibilityMenu
					hideableColumns={table
						.getAllLeafColumns()
						.filter((column) => column.getCanHide())}
				/>
			</div>
			<div className="overflow-x-auto">
				<div className="min-w-max text-sm">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableHeader
							key={headerGroup.id}
							headerGroup={headerGroup}
							gridTemplateColumns={gridTemplateColumns}
						/>
					))}

					<div className="flex flex-col">
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								row={row}
								gridTemplateColumns={gridTemplateColumns}
							/>
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
