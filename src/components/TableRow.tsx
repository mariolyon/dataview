import { flexRender, type Row } from "@tanstack/react-table";
import type { Measurement } from "#/types.ts";

interface TableRowProps {
	row: Row<Measurement>;
	gridTemplateColumns: string;
}

export function TableRow({ row, gridTemplateColumns }: TableRowProps) {
	return (
		<div
			className="group grid border-b border-gray-200 hover:bg-gray-50"
			style={{ gridTemplateColumns }}
		>
			{row.getVisibleCells().map((cell) => (
				<div
					key={cell.id}
					className={
						"overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2 text-right " +
						(cell.column.id === "rowNumber"
							? "sticky left-0 bg-white group-hover:bg-gray-50 z-10"
							: "")
					}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</div>
			))}
		</div>
	);
}
