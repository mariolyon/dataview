import { Button } from "./Button";

interface LoadMoreButtonProps {
	onLoadMore: () => void;
	isFetching: boolean;
}

export function LoadMoreButton({
	onLoadMore,
	isFetching,
}: LoadMoreButtonProps) {
	return (
		<Button
			onClick={onLoadMore}
			disabled={isFetching}
			bgColor="bg-blue-600"
			textColor="text-white"
			className="hover:bg-blue-700"
		>
			{isFetching ? "Loading..." : "Load More Data"}
		</Button>
	);
}
