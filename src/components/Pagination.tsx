import type { Table } from "@tanstack/react-table";
import { LoadMoreButton } from "#/components/LoadMoreButton.tsx";
import { NextButton } from "#/components/NextButton.tsx";
import { PreviousButton } from "#/components/PreviousButton.tsx";
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
					<PreviousButton
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					/>
					<span className="min-w-[5rem] text-center text-sm font-medium">
						Page {pageIndex + 1} of {Math.max(1, pageCount)}
					</span>
					<NextButton
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					/>
				</div>

				<div className="flex items-center gap-2">
					<LoadMoreButton onLoadMore={onLoadMore} isFetching={isFetching} />
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
