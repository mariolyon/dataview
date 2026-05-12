import { ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface NextButtonProps {
	onClick: () => void;
	disabled: boolean;
}

export function NextButton({ onClick, disabled }: NextButtonProps) {
	return (
		<Button onClick={onClick} disabled={disabled} width="w-20" align="right">
			<span className="inline-flex items-center gap-2">
				Next
				<ChevronRight className="h-4 w-4" />
			</span>
		</Button>
	);
}
