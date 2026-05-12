import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import type { Measurement } from "#/types.ts";

interface TableHeaderProps {
	headerGroup: HeaderGroup<Measurement>;
	gridTemplateColumns: string;
}

export function TableHeader({
	headerGroup,
	gridTemplateColumns,
}: TableHeaderProps) {
	return (
		<div
			className="grid border-b-2 border-gray-300"
			style={{ gridTemplateColumns }}
		>
			{headerGroup.headers.map((header) => (
				<div
					key={header.id}
					className={
						"whitespace-nowrap px-2 py-2 text-right font-semibold text-gray-700 " +
						(header.column.getCanSort() ? "cursor-pointer select-none" : "") +
						(header.id === "rowNumber" ? " sticky left-0 bg-white z-10" : "")
					}
					onClick={header.column.getToggleSortingHandler()}
				>
					{header.isPlaceholder ? null : (
						<div className="flex items-center justify-end gap-1">
							{flexRender(header.column.columnDef.header, header.getContext())}
							{{
								asc: " 🔼",
								desc: " 🔽",
							}[header.column.getIsSorted() as string] ?? null}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
