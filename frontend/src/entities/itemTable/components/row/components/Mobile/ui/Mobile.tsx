import { TableCell } from "#/services/lib";
import { UniversalContext, useUniversalContext } from "#/shared/lib";
import { JSX, ReactNode } from "react";

export const Mobile = <T extends { id: string | number }>(): JSX.Element => {
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
                <div key={index} className="flex gap-2 items-center">
                    <strong className="min-w-[120px]">{context.heads[index]}:</strong>
                    <span className="flex-1">{content}</span>
                </div>
            );
        });
    };

    const renderFeatures = () => {
        if (!context.features) return null;

        return (
            <div className="flex gap-2 items-center">
                <strong className="min-w-[120px]">Действия:</strong>
                <span className="flex-1 flex gap-2">
                    {context.features.map((feature, index) => (
                        <UniversalContext.Provider key={index} value={context.item}>
                            {feature}
                        </UniversalContext.Provider>
                    ))}
                </span>
            </div>
        );
    };

    return (
        <TableCell className="grid justify-self-center w-[95%] !m-2 !p-4 border !rounded-lg shadow-md !gap-2">
            {renderFields()}
            {context.features && renderFeatures()}
        </TableCell>
    );
};
