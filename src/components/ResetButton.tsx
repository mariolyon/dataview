import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "#/integrations/trpc/react";
import { getQueryClient } from "#/lib/queryClient";

export function ResetButton({
	resetPagination,
}: {
	resetPagination: () => void;
}) {
	const trpc = useTRPC();
	const resetData = useMutation(
		trpc.measurements.reset.mutationOptions({
			onSuccess: async () => {
				resetPagination();
				await getQueryClient().invalidateQueries(
					trpc.measurements.load.queryFilter(
						{},
						{
							predicate: () => true,
						},
					),
				);
			},
			onError: () => {},
		}),
	);

	return (
		<button
			type="button"
			onClick={() => resetData.mutate()}
			disabled={resetData.isPending}
			className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
		>
			{resetData.isPending ? "Resetting..." : "Reset Data"}
		</button>
	);
}
