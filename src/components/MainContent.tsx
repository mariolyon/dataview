import { MeasurementGrid } from "#/components/MeasurementGrid";

export function MainContent() {
	return (
		<div className="p-8 flex flex-col gap-3">
			<h1 className="text-2xl font-bold">Data View</h1>
			<p className="text-sm text-gray-600">Download and inspect measurements</p>
			<MeasurementGrid />
		</div>
	);
}
