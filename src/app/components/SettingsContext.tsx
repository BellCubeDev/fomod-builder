'use client';

import { GroupBehaviorType, OptionType, SortingOrder } from 'fomod';
import React from 'react';

export interface Settings {
    defaultOptionType: OptionType,
    defaultGroupBehavior: GroupBehaviorType,
    defaultOptionSortingOrder: SortingOrder,
    defaultGroupSortingOrder: SortingOrder,
    defaultStepSortingOrder: SortingOrder,

    autoSave: boolean,
    autoSaveInterval: number,

    /** The user requests reduced motion. This is offered both for accessibility and for editing speed (though, for accessibility, it's often better to go through the browser) */
    reducedMotion: boolean,

    update<TKey extends keyof Settings>(key: TKey, value: Settings[TKey]): void,
    update(settings: Partial<Settings>): void,
}

type SettingsValues = Omit<Settings, 'update'>;




export const settingsContext = React.createContext<Settings|null>(null);

declare global {
    interface Window {
        settings: Settings|null;
        defaultSettings: typeof defaultSettings;
    }
}

if (typeof window !== 'undefined') window.settings = null;

function defaultUpdate<TKey extends keyof SettingsValues>(this: Settings, key: TKey, value: Settings[TKey]): void;
function defaultUpdate                                   (this: Settings, settings: Partial<SettingsValues>): void; // @ts-ignore: don't worry about my super hacky workaround; it's fine
function defaultUpdate<TKey extends keyof SettingsValues | undefined = undefined>(this: Settings, keyOrObject: TKey | Partial<Settings>, value: TKey extends keyof Settings ? Settings[TKey] : undefined = undefined) {
    if (typeof keyOrObject === 'string') this[keyOrObject] = value as Settings[typeof keyOrObject];
    else Object.assign(this, keyOrObject);

    if (typeof window !== 'undefined') window.settings = this;
    localStorage.setItem('settings', JSON.stringify(this, (key, v) => key === 'update' ? undefined : v));
}

export const defaultSettings = {
    update: defaultUpdate,

    defaultOptionType: OptionType.Optional,
    defaultGroupBehavior: GroupBehaviorType.SelectAny,
    defaultOptionSortingOrder: SortingOrder.Explicit,
    defaultGroupSortingOrder: SortingOrder.Explicit,
    defaultStepSortingOrder: SortingOrder.Explicit,

    autoSave: true,
    autoSaveInterval: 500,

    reducedMotion: false,

} as const satisfies Readonly<Settings>;

if (typeof window !== 'undefined') window.defaultSettings = defaultSettings;

/** Provides the current user settings, shared across the editor */
export function useSettings() {
    return React.useContext(settingsContext);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [value, setValue] = React.useState<Settings|null>(null);

    React.useEffect(() => {
        const updateFObj = { update(this: Settings, ...args: any[]) {
            defaultUpdate.bind(this, ...args)();
            setValue(Object.assign({}, this)); // Hack to get React to re-render
        }};

        const fromStorage = localStorage.getItem('settings');
        setValue(Object.assign({}, defaultSettings, fromStorage ? JSON.parse(fromStorage) : {}, updateFObj));
    }, []);

    React.useEffect(() => {
        window.settings = value;
    }, [value]);

    return <settingsContext.Provider value={value}>
        {children}
    </settingsContext.Provider>;
}
