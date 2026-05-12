import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";

interface PreviousButtonProps {
	onClick: () => void;
	disabled: boolean;
}

export function PreviousButton({ onClick, disabled }: PreviousButtonProps) {
	return (
		<Button onClick={onClick} disabled={disabled} width="w-20" align="left">
			<span className="inline-flex items-center gap-2">
				<ChevronLeft className="h-4 w-4" />
				Prev
			</span>
		</Button>
	);
}
