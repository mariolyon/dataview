import { getNextButtonText } from "#/data/measurements.ts";

interface PaginationProps {
	page: number;
	lastPage: number;
	setPage: (page: number) => void;
	setLastPage: (page: number) => void;
	disabled: boolean;
	isFetching: boolean;
}

export function Pagination({
	page,
	lastPage,
	setPage,
	setLastPage,
	disabled,
	isFetching,
}: PaginationProps) {
	return (
		<div className="mt-2 flex items-center gap-4">
			<button
				type="button"
				onClick={() => setPage(Math.max(0, page - 1))}
				disabled={page === 0}
				className="w-28 rounded border px-3 py-1 disabled:opacity-50"
			>
				Previous
			</button>
			<span className="w-28 font-medium">Page {page + 1}</span>
			<button
				type="button"
				onClick={() => {
					const nextPage = page + 1;
					setPage(nextPage);
					setLastPage(Math.max(nextPage, lastPage));
				}}
				disabled={disabled || isFetching}
				className="w-28 rounded border px-3 py-1 disabled:opacity-50"
			>
				{getNextButtonText(page, lastPage, isFetching)}
			</button>
			{isFetching && <span className="text-sm text-gray-500">Loading...</span>}
		</div>
	);
}
