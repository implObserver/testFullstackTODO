import { Table, TableBody, TableHeader, TableHead, TableRow } from "#/services/lib/helpers/shadcn/components/ui/table";
import { UniversalContext } from "#/shared/lib";
import { ReactNode } from "react";
import { Row } from "../components/row";

type CellRenderer<T> = (item: T) => ReactNode;

interface ItemTableProps<T> {
    items: T[];
    heads: string[];
    keys: (string | CellRenderer<T>)[];
    features?: ReactNode[];
}

export const ItemTable = <T extends { id: string | number }>({
    items,
    heads,
    keys,
    features
}: ItemTableProps<T>): React.ReactElement => {
    const fill = () => {
        return items.map((item, index) => (
            <UniversalContext.Provider
                key={item.id ?? index}
                value={{ item, heads, keys, features }}
            >
                <Row />
            </UniversalContext.Provider>
        ));
    };

    const renderHeads = () => {
        return heads.map((head, index) => (
            <TableHead key={index} className="text-center hidden lg:table-cell">
                {head}
            </TableHead>
        ));
    };

    if (!heads || heads.length === 0) {
        return <div className="p-2">Некорректные данные</div>;
    }

    return (
        <div className="grid pl-2 gap-[var(--responsive-size)]">
            <Table>
                <TableHeader>
                    <TableRow>{renderHeads()}</TableRow>
                </TableHeader>
                <TableBody>{fill()}</TableBody>
            </Table>
        </div>
    );
};
