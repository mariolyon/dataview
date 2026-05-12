import { Button } from "./Button";

export function ResetButton({
	onReset,
	isResetting,
}: {
	onReset: () => void;
	isResetting: boolean;
}) {
	return (
		<Button
			onClick={onReset}
			disabled={isResetting}
			bgColor="bg-red-600"
			textColor="text-white"
			className="hover:bg-red-700"
		>
			{isResetting ? "Resetting..." : "Reset Data"}
		</Button>
	);
}
