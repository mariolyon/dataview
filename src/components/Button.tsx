import type { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	bgColor?: string;
	textColor?: string;
	width?: string;
	align?: "left" | "center" | "right";
}

export function Button({
	children,
	onClick,
	disabled,
	className = "",
	bgColor = "bg-white",
	textColor = "text-gray-700",
	width = "w-40",
	align = "center",
}: ButtonProps) {
	const alignmentClasses = {
		left: "justify-start px-2",
		center: "justify-center",
		right: "justify-end px-2",
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`flex items-center rounded border text-sm font-medium transition-colors disabled:opacity-50 h-10 ${width} ${alignmentClasses[align]} ${bgColor} ${textColor} ${className}`}
		>
			{children}
		</button>
	);
}
