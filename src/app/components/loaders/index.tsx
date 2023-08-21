'use client';

import React from "react";
import xmlFormat from 'xml-formatter';
import { useSettings } from '../SettingsContext';
import { TranslationTableKeys } from '../localization/strings';
import { parseInfoDoc, Fomod, FomodInfo } from 'fomod';

// TODO: Test that any of this actually does what I want it to

export abstract class FomodLoader {
    abstract getFileByPath(path: string): Promise<File|null>;

    static CanUse: boolean;
    static Name: keyof TranslationTableKeys;
    static LoaderUI: React.FunctionComponent<{}>;
    static LoaderUIClickEvent: (...params: Parameters<React.MouseEventHandler<HTMLButtonElement>>) => Promise<[false, FomodLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]>;

    abstract commission?(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;
    abstract decommission(): Promise<void>;

    abstract save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> >;

    abstract reloadFromText(text: string, info?: boolean): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;






    protected abstract _infoDoc: Document | null;
    protected abstract _info: FomodInfo | null;
    protected abstract _infoText: string | null;
    lastInfoDocEditType: 'doc'|'text'|null = null;


    get infoDoc() {
        if (this.lastModuleDocEditType === 'text' && this._infoText !== this._infoDoc?.textContent)
            this._info = this._infoDoc ? parseInfoDoc(new DOMParser().parseFromString(this._infoText ?? '', 'application/xml')) : null;

        return this._info;
    }

    get info() {
        if (this.lastInfoDocEditType === 'doc' && this._infoText !== this._infoDoc?.textContent) {

            this._info = this._infoDoc ? parseInfoDoc(this._infoDoc) : null;
        }

        return this._info;
    }

    set infoText(text: string) {
        this._infoText = text;
        this.lastInfoDocEditType = 'text';
    }


    get infoText() {
        if (this.lastInfoDocEditType === 'doc' && this._infoText !== this._infoDoc?.textContent)
            if (this._info && this._infoDoc) this._info.asElement(this._infoDoc);
            this._infoText = this._info && this._infoDoc ? xmlFormat(new XMLSerializer().serializeToString(this._info.asElement(this._infoDoc)), {
                forceSelfClosingEmptyTag: true,
                indentation: '    ',
                strictMode: true,
                whiteSpaceAtEndOfSelfclosingTag: true,
                lineSeparator: '\n',
            }) : null;

        return this._infoText || '';
    }

    get infoTextForSaving() {
        return xmlFormat(this.infoText, {
            forceSelfClosingEmptyTag: true,
            indentation: '',
            strictMode: true,
            whiteSpaceAtEndOfSelfclosingTag: false,
            lineSeparator: '',
            collapseContent: true,
        });
    }






    protected abstract _moduleDoc: Document | null;
    protected abstract _module: Fomod<false> | null;
    protected abstract _moduleText: string | null;
    lastModuleDocEditType: 'doc'|'text'|null = null;


    get moduleDoc() {
        if (this.lastModuleDocEditType === 'text' && this._moduleText !== this._moduleDoc?.textContent)
            this.reloadFromText(this._moduleText ?? '', false);
        return this._moduleDoc;
    }


    set moduleText(text: string) {
        this._moduleText = text;
        this.lastModuleDocEditType = 'text';
    }


    get moduleText() {
        if (this.lastModuleDocEditType === 'doc' && this._moduleText !== this._moduleDoc?.textContent){
            if (this._module && this._moduleDoc) this._module.asElement(this._moduleDoc);
            this._moduleText = xmlFormat(new XMLSerializer().serializeToString(this._moduleDoc ?? document.implementation.createDocument(null, null, null)), {
                forceSelfClosingEmptyTag: true,
                indentation: '    ',
                strictMode: true,
                whiteSpaceAtEndOfSelfclosingTag: true,
                lineSeparator: '\n',
            });
        }

        return this._moduleText || '';
    }

    get moduleDocForSaving() {
        return xmlFormat(this.moduleText, {
            forceSelfClosingEmptyTag: true,
            indentation: '',
            strictMode: true,
            whiteSpaceAtEndOfSelfclosingTag: false,
            lineSeparator: '',
            collapseContent: true,
        });
    }
}



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
    readonly fomod: FomodLoader | null;
    load(newLoader: FomodLoader, discard?: boolean): Promise<false|FomodLoadRejectReason>;
    autoSave(): Promise<false|FomodSaveRejectReason>;
}

export const loaderContext = React.createContext<FomodLoaderContext>({
    fomod: null,
    load() { throw new Error('Cannot call load on the default context; add a FomodLoaderProvider to the tree first!'); },
    autoSave() { throw new Error('Cannot call autoSave on the default context; add a FomodLoaderProvider to the tree first!');}
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

    return <loaderContext.Provider value={{ fomod: loader, load, autoSave }}>
        {children}
    </loaderContext.Provider>;
}
