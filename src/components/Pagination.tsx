import type { Table } from "@tanstack/react-table";
import { ResetButton } from "#/components/ResetButton.tsx";

interface PaginationProps {
	table: Table<any>;
	onLoadMore: () => void;
	isFetching: boolean;
	onReset: () => void;
	isResetting: boolean;
}

export function Pagination({
	table,
	onLoadMore,
	isFetching,
	onReset,
	isResetting,
}: PaginationProps) {
	const pageIndex = table.getState().pagination.pageIndex;
	const pageCount = table.getPageCount();
	const totalRows = table.getCoreRowModel().rows.length;

	return (
		<div className="mt-4 flex flex-col gap-4">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="w-28 rounded border px-3 py-1 text-sm font-medium disabled:opacity-50"
					>
						Previous
					</button>
					<span className="min-w-[5rem] text-center text-sm font-medium">
						Page {pageIndex + 1} of {Math.max(1, pageCount)}
					</span>
					<button
						type="button"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="w-28 rounded border px-3 py-1 text-sm font-medium disabled:opacity-50"
					>
						Next
					</button>
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={onLoadMore}
						disabled={isFetching}
						className="rounded bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
					>
						{isFetching ? "Loading..." : "Load More Data"}
					</button>
					<ResetButton onReset={onReset} isResetting={isResetting} />
				</div>
			</div>

			<div className="text-right">
				<span className="text-sm text-gray-600">
					Total rows downloaded: <span className="font-bold">{totalRows}</span>
				</span>
			</div>
		</div>
	);
}
