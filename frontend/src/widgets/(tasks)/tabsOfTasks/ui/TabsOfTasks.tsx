'use client'

import { TabsPanel } from "#/entities/tabsPanel"
import { sharedStyles, TabsContext, TabSettings, TabsSettings, TextSettings } from "#/shared/lib"
import { tabs } from "../lib/const/const"


export const TabsOfTasks = () => {
    const tabSettings: TabSettings = {
        className: (active) => `
        text-center
        flex 
        justify-between 
        items-center
        ${sharedStyles.tabs.baseTab(active)}`
    }

    const textSettings: TextSettings = {
        width: '140px',
        height: '',
        clamp: 2,
    }

    const tabsSettings: TabsSettings = {
        tabs,
        path: `/tasks`,
        className: "!pl-4 !gap-2 p-2 flex w-full h-min items-end",
        tabSettings,
        textSettings,
    }

    return (
        <>
            <TabsContext.Provider value={tabsSettings}>
                <TabsPanel />
            </TabsContext.Provider>
        </>
    );
}