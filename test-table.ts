import { createColumnHelper } from "@tanstack/react-table";
interface Measurement { id: number; }
const columnHelper = createColumnHelper<Measurement>();
columnHelper.accessor((row, index) => index, {
    id: "test"
});
