import { MeasurementGrid } from "#/components/MeasurementGrid.tsx";

export function App() {
	return (
		<div className="p-8 flex flex-col gap-3">
			<h1 className="text-2xl font-bold">Data View</h1>
			<p className="text-sm text-gray-600">
				Download and inspect health measurements
			</p>
			<MeasurementGrid />
		</div>
	);
}
