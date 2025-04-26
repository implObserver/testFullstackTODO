'use client'
import { createContext, useContext } from "react";

export interface ConstItem {
    name: string,
    path: string,
}

export interface TabsSettings {
    tabs: ConstItem[],
    path: string,
    className?: string,
    tabSettings: TabSettings,
    textSettings: TextSettings,
}

export interface TabSettings {
    className?: string | ((active: boolean) => string);
}

export interface TextSettings {
    width?: string,
    height?: string,
    clamp?: number,
    className?: string,
}

export const TabsContext = createContext<undefined | TabsSettings>(undefined);

export const useTabsContext = () => {
    const props = useContext(TabsContext);
    if (props === undefined) {
        throw new Error('use this context must be used with a TabsContext');
    }
    return props;
}