export function ResetButton({
	onReset,
	isResetting,
}: {
	onReset: () => void;
	isResetting: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onReset}
			disabled={isResetting}
			className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
		>
			{isResetting ? "Resetting..." : "Reset Data"}
		</button>
	);
}
