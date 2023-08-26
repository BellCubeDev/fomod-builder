'use client';

import React from "react";
import { useSettings } from '../SettingsContext';
import { FomodLoader } from './LoaderBase';

export * from './LoaderBase';

export enum FomodLoadRejectReason {
    UnsavedChanges = 1,
    NoFileSelected,
    NoFolderSelected,
    InvalidXML,
    FileCouldNotBeRead,
    UnsalvageableInfoDoc,
    UnsalvageableModuleDoc,
    FileFolderMismatch,
}

export enum FomodSaveRejectReason {
    NoLoader = 1,
    PermissionDenied,
    CouldNotCreateWritable,
    CouldNotWrite,
    FileFolderMismatch,
}

/** The current Fomod state shared across the editor */
export interface FomodLoaderContext {
    readonly loader: FomodLoader | null;
    load(newLoader: FomodLoader, discard?: boolean): Promise<false|FomodLoadRejectReason>;
    autoSave(): Promise<false|FomodSaveRejectReason>;
}

export const loaderContext = React.createContext<FomodLoaderContext>({
    loader: null,
    load() { throw new Error('Cannot call load on the default context; add a FomodLoaderProvider to the tree first!'); },
    autoSave() { throw new Error('Cannot call autoSave on the default context; add a FomodLoaderProvider to the tree first!');}
});

/** Provides the current Fomod state shared across the editor */
export function useFomod(requireLoader?: false): FomodLoaderContext
export function useFomod(requireLoader: true): false | (FomodLoaderContext & { loader: NonNullable<FomodLoaderContext['loader']> })
export function useFomod(requireLoader = false) {
    const c = React.useContext(loaderContext);
    if (requireLoader && !c.loader) return false;
    return c;
}

export class NoLoaderError extends Error {
    constructor() {
        super('No Fomod loader provided');
    }
}

declare global {
    interface Window {
        fomod: FomodLoaderContext;
    }
}

export function FomodLoaderProvider({ children }: { children: React.ReactNode }) {
    const [loader, setLoader] = React.useState<FomodLoader|null>(null);

    const load = React.useCallback((newLoader: FomodLoader, discard = false) => {
        if (loader && !discard) return Promise.resolve<false>(false);

        return new Promise<false | FomodLoadRejectReason>(async (resolve, reject) => {
            try {
                if (loader) await loader.decommission();

                const reason = await newLoader.commission?.();
                if (!reason) setLoader(newLoader);

                return resolve(reason ?? false);
            } catch (e) {
                reject(e);
            }
        });
    }, [loader]);

    const settings = useSettings();
    const delay = settings?.autoSave;

    let autoSaveTimer = React.useRef<ReturnType<typeof setTimeout>|null>(null);

    const autoSave = React.useCallback(() => {
        if (!loader) return Promise.resolve(FomodSaveRejectReason.NoLoader);

        if (delay === false || delay === undefined) return Promise.resolve<false>(false);
        if (delay === 0) return loader.save();

        return new Promise<Awaited<ReturnType<FomodLoader['save']>>>((resolve, reject) => {
            if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
            autoSaveTimer.current = setTimeout(  () => loader.save().then(resolve, reject),   delay);
        });
    }, [loader, delay]);

    React.useEffect(() => {
        window.fomod = { loader, load, autoSave };
    }, [loader, load, autoSave]);

    return <loaderContext.Provider value={{ loader, load, autoSave }}>
        {children}
    </loaderContext.Provider>;
}
