import { type Column } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import type { Measurement } from "#/types.ts";

interface ColumnVisibilityMenuProps {
	hideableColumns: Column<Measurement, any>[];
}

export function ColumnVisibilityMenu({
	hideableColumns,
}: ColumnVisibilityMenuProps) {
	const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
	const columnMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isColumnMenuOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				columnMenuRef.current &&
				!columnMenuRef.current.contains(event.target as Node)
			) {
				setIsColumnMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [isColumnMenuOpen]);

	return (
		<div ref={columnMenuRef} className="relative">
			<Button
				onClick={() => setIsColumnMenuOpen((open) => !open)}
				width="w-28"
			>
				<span className="inline-flex items-center gap-2">
					<Columns3 className="h-4 w-4" />
					Columns
				</span>
			</Button>
			{isColumnMenuOpen ? (
				<div className="absolute z-10 right-0 mt-2 w-56 rounded border bg-white p-3 shadow">
					<div className="mb-2">
						<button
							type="button"
							onClick={() => {
								for (const column of hideableColumns) {
									column.toggleVisibility(true);
								}
							}}
							className="text-sm font-medium text-blue-600 hover:text-blue-700"
						>
							Show All
						</button>
					</div>
					<div className="flex flex-col gap-2">
						{hideableColumns.map((column) => {
							const label = String(column.columnDef.header ?? column.id);
							return (
								<label
									key={column.id}
									className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
								>
									<input
										type="checkbox"
										checked={column.getIsVisible()}
										onChange={column.getToggleVisibilityHandler()}
									/>
									<span>{label}</span>
								</label>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
