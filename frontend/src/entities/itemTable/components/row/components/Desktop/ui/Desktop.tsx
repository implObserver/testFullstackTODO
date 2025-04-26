import { TableCell } from "#/services/lib";
import { UniversalContext, useUniversalContext } from "#/shared/lib";
import { JSX, ReactNode } from "react";

export const Desktop = <T extends { id: string | number }>(): JSX.Element => {
    const context = useUniversalContext<{
        item: T;
        heads: string[];
        keys: (string | ((item: T) => ReactNode))[];
        features?: ReactNode[];
    }>();

    const formatValue = (value: unknown): ReactNode => {
        if (typeof value === 'boolean') {
            return value ? <div>Да</div> : <div>Нет</div>;
        } else if (typeof value === 'string' && !isNaN(Date.parse(value))) {
            return new Date(value).toLocaleDateString('ru-RU');
        } else if (value instanceof Date) {
            return value.toLocaleDateString('ru-RU');
        }
        return value as ReactNode;
    };

    const renderFields = () => {
        return context.keys.map((key, index) => {
            let content: ReactNode;

            if (typeof key === 'function') {
                content = key(context.item);
            } else {
                const value = context.item[key as keyof T];
                content = formatValue(value);
            }

            return (
                <TableCell key={index} width={200}>
                    <div className="flex justify-center items-center">
                        {content}
                    </div>
                </TableCell>
            );
        });
    };

    const renderFeatures = () => {
        return context.features?.map((feature, index) => (
            <TableCell key={index} width={200}>
                <UniversalContext.Provider value={context.item}>
                    {feature}
                </UniversalContext.Provider>
            </TableCell>
        ));
    };

    return (
        <>
            {renderFields()}
            {context.features && renderFeatures()}
        </>
    );
};