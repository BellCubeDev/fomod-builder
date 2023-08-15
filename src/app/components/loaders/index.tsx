'use client';

import React, { useEffect } from "react";
import xmlFormat from 'xml-formatter';



export abstract class FomodLoader {
    abstract getFileByPath(path: string): Promise<Buffer|null>;

    static CanUse: boolean;
    static Name: string;
    static LoaderUI: React.FunctionComponent<{ newLoader: typeof FomodLoader }>;

    abstract commission(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;
    abstract decommission(): Promise<void>;

    abstract save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> >;

    abstract reloadFromText(text: string, info?: boolean): Promise<void>;

    protected abstract _infoDoc: Document;
    protected abstract _infoDocText: string;
    abstract lastInfoDocEditType: 'doc'|'text';

    protected abstract _moduleDoc: Document;
    protected abstract _moduleDocText: string;
    abstract lastModuleDocEditType: 'doc'|'text';

    get infoDoc() {
        if (this.lastModuleDocEditType === 'text' && this._infoDocText !== this._infoDoc?.textContent)
            this._infoDoc = new DOMParser().parseFromString(this._infoDocText ?? '', 'application/xml');

        return this._infoDoc;
    }

    get infoDocText() {
        if (this.lastInfoDocEditType === 'doc' && this._infoDocText !== this._infoDoc?.textContent)
            this._infoDocText = xmlFormat(
                new XMLSerializer().serializeToString(this._infoDoc ?? document.implementation.createDocument(null, null, null)),
                {
                    forceSelfClosingEmptyTag: true,
                    indentation: '    ',
                    strictMode: true,
                    whiteSpaceAtEndOfSelfclosingTag: true,
                    lineSeparator: '\n',
                }
            );

        return this._infoDocText || '';
    }

    set infoDocText(text: string) {
        this._infoDocText = text;
        this.lastInfoDocEditType = 'text';
    }

    get moduleDoc() {
        if (this.lastModuleDocEditType === 'text' && this._moduleDocText !== this._moduleDoc?.textContent)
            this.reloadFromText(this._moduleDocText ?? '', false);
        return this._moduleDoc;
    }

    get moduleDocText() {
        if (this.lastModuleDocEditType === 'doc' && this._moduleDocText !== this._moduleDoc?.textContent)
            this._moduleDocText = xmlFormat(
                new XMLSerializer().serializeToString(this._moduleDoc ?? document.implementation.createDocument(null, null, null)),
                {
                    forceSelfClosingEmptyTag: true,
                    indentation: '    ',
                    strictMode: true,
                    whiteSpaceAtEndOfSelfclosingTag: true,
                    lineSeparator: '\n',
                }
            );

        return this._moduleDocText || '';
    }

    set moduleDocText(text: string) {
        this._moduleDocText = text;
        this.lastModuleDocEditType = 'text';
    }

}



export enum FomodLoadRejectReason {
    UnsavedChanges = 1,
}

export enum FomodSaveRejectReason {
    NoLoader = 1,
}

/** The current Fomod state shared across the editor */
export interface FomodLoaderContext {
    readonly fomod: FomodLoader | null;
    load(newLoader: FomodLoader, discard?: boolean): Promise<false|FomodLoadRejectReason>;
}

export const loaderContext = React.createContext<FomodLoaderContext>({
    fomod: null,
    load() { throw new Error('Cannot call load on the default context; add a FomodLoaderProvider to the tree first!'); },
});

/** Provides the current Fomod state shared across the editor */
export function useFomod(requireLoader?: false): FomodLoaderContext
export function useFomod(requireLoader: true): false | (FomodLoaderContext & { fomod: NonNullable<FomodLoaderContext['fomod']> })
export function useFomod(requireLoader = false) {
    const c = React.useContext(loaderContext);
    if (requireLoader && !c.fomod) return false;
    return c;
}

export class NoLoaderError extends Error {
    constructor() {
        super('No Fomod loader provided');
    }
}

export function FomodLoaderProvider({ children }: { children: React.ReactNode }) {
    const [loader, setLoader] = React.useState<FomodLoader|null>(null);

    const load = React.useCallback((newLoader: FomodLoader, discard = false) => {
        if (loader && !discard) return Promise.resolve<false>(false);

        return new Promise<false | FomodLoadRejectReason>(async (resolve, reject) => {
            if (loader) await loader.decommission();
            return resolve(await newLoader.commission());
        });
    }, [loader]);

    return <loaderContext.Provider value={{ fomod: loader, load }}>
        {children}
    </loaderContext.Provider>;
}
