import { TableRow } from "#/services/lib/helpers/shadcn/components/ui/table";
import { Desktop } from "../components/Desktop";
import { Mobile } from "../components/Mobile";

export const Row = () => {
    return (
        <>
            <TableRow className="hidden lg:table-row" style={{ height: '64px' }}>
                <Desktop />
            </TableRow>

            <TableRow className="block lg:hidden">
                <Mobile />
            </TableRow>
        </>
    )
}