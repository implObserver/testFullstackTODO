import { useMemo } from "react";
import { BaseTab } from "../components/baseTab";
import { useTabsContext } from "#/shared/lib";

export const TabsPanel = () => {
    const context = useTabsContext();

    const fill = useMemo(() => {
        return context.tabs?.map((tab, index) => {
            return (
                <BaseTab key={index} tabPath={tab.path}>
                    <div>{tab.name}</div>
                </BaseTab>
            );
        }) ?? [];
    }, [context.tabs]);

    return (
        <div className={context.className}>
            {fill}
        </div>
    );
}