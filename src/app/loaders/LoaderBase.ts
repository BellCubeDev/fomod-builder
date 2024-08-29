'use client';

import React from "react";
import xmlFormat from 'xml-formatter';
import { Immutable, immerable, createDraft, Immer, current, produce } from '@/immer';

import { TranslationTableKeys } from '../localization/strings';
import { FomodLoadRejectReason, FomodSaveRejectReason } from '.';

import * as fomodLib from 'fomod';
import { Fomod, FomodInfo, InstallPattern, BlankModuleConfig, BlankInfoDoc } from 'fomod';
import { FomodEventTarget } from './index';
import type { FomodDocumentConfig } from "fomod/dist/definitions/lib/FomodDocumentConfig";

for (const item of Object.values(fomodLib)) {
    if ((typeof item === 'function' || typeof item === 'object') && 'prototype' in item) {
        item.prototype ??= {};
        item.prototype[immerable] = true;
    }
}

export class FomodLoadingError extends Error {
    constructor(message: string, public reason: FomodLoadRejectReason) {
        super(message);
    }
}

export class FomodSavingError extends Error {
    constructor(message: string, public reason: FomodSaveRejectReason) {
        super(message);
    }
}

export function reorganizeInstalls(module: Fomod<false>) {
    module.steps.forEach(step => {
        step.groups.forEach(group => {
            group.options.forEach(option => {
                if (option.installsToSet.filesWrapper.installs.size === 0) return;
                module.installs.add(option.installsToSet);
                option.installsToSet = new InstallPattern(option.installsToSet.dependencies);
            });
        });
    });
}

export const fomodParseConfig: Required<FomodDocumentConfig> = {
    flattenConditionalInstalls: false,
    flattenConditionalInstallsNoDependencies: false,
    generateNewOptionFlagNames: false,
    includeInfoSchema: true,
    optionSelectedValue: 'OPTION_SELECTED',
    parseOptionFlags: 'loose',
    removeEmptyConditionalInstalls: true,
};

export abstract class FomodLoader {
    abstract getFileByPath(path: string): Promise<File|null>;

    abstract pickFile(): Promise<[path: string, file: File, extraData: unknown]|null>;

    /** Whether this loader can be used in any capacity */
    static CanUse: boolean;
    get CanUse() { return (this.constructor as typeof FomodLoader).CanUse; }
    /** Whether the code has access to the file system to do arbitrary reads/writes */
    static FileSystemCapability: boolean;
    get FileSystemCapability() { return (this.constructor as typeof FomodLoader).FileSystemCapability; }

    static Name: keyof TranslationTableKeys & `loader_${string}`;
    static LoaderUI: React.FunctionComponent<{onButtonClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void}>;

    static LoaderUIClickEvent: (eventTarget: FomodEventTarget, ...params: Parameters<React.MouseEventHandler<HTMLButtonElement>>) => Promise<[false, FomodLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]>;

    abstract commission?(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;
    abstract decommission(): Promise<unknown>;

    abstract save_(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> >;

    async save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> > {
        const result = await this.save_();
        if (result === false) window.hasUnsavedChanges = false;
        return result;
    }

    /** This MUST set the _x, _xDoc, and _xText properties. MUST! */
    reloadFromText(text: string, info?: boolean | undefined): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> {
        let result;

        if (info) result = this.reloadInfoFromText(text);
        else result = this.reloadModuleFromText(text);

        if (result) return result;

        this.history.add([this._module!, this._info!]);

        return false;
    }

    // TODO: Come up with some clever way to notify the user when their Monaco-edited XML is invalid

    reloadInfoFromText(text: string): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> {
        try {
                text ||= BlankInfoDoc;

            let doc: Document;

            try {
                doc = new DOMParser().parseFromString(text, 'application/xml');
                if (doc.body?.firstElementChild?.tagName === 'parsererror' || doc.documentElement?.firstElementChild?.tagName === 'parsererror') return FomodLoadRejectReason.InvalidXML;
            } catch (e) {
                if (e instanceof Error && e.name === 'SyntaxError') return FomodLoadRejectReason.InvalidXML;
                else throw e;
            }

            let result = fomodLib.parseInfoDoc(doc, fomodParseConfig);
            if (!result) {
                if (doc.documentElement.getElementsByTagName(FomodInfo.tagName).length) return FomodLoadRejectReason.UnsalvageableInfoDoc;
                result = new FomodInfo();
                result.assignElement(fomodLib.getOrCreateElementByTagName(doc.documentElement, FomodInfo.tagName));
            }

            let asElement!: Element;
            const immutableResult = produce(result, d => {
                asElement = d.asElement(doc, fomodParseConfig);
                return d;
            });

            this._info = immutableResult;
            this._infoDoc = asElement.ownerDocument!;
            this._infoText = asElement.outerHTML;

            return false;
        } catch (e) {
            console.error(e); // TODO: Show a notification to the user
            return FomodLoadRejectReason.UnsalvageableInfoDoc;
        }
    }

    reloadModuleFromText(text: string): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> {
        try {
            text ||=  BlankModuleConfig;

            let doc: Document;

            try {
                doc = new DOMParser().parseFromString(text, 'application/xml');
                if (doc.body?.firstElementChild?.tagName === 'parsererror' || doc.documentElement?.firstElementChild?.tagName === 'parsererror')
                    return FomodLoadRejectReason.InvalidXML;
            } catch (e) {
                if (e instanceof Error && e.name === 'SyntaxError') return FomodLoadRejectReason.InvalidXML;
                else throw e;
            }


            let result = fomodLib.parseModuleDoc(doc, fomodParseConfig);
            if (!result) {
                if (doc.documentElement.getElementsByTagName(Fomod.tagName).length) return FomodLoadRejectReason.UnsalvageableModuleDoc;
                result = new Fomod();
                result.assignElement(fomodLib.getOrCreateElementByTagName(doc.documentElement, Fomod.tagName));
            }

            reorganizeInstalls(result);

            let asElement!: Element;
            const immutableResult = produce(result, d => {
                asElement = d.asElement(doc, fomodParseConfig);
                return d;
            });

            this._module = immutableResult;
            this._moduleDoc = asElement.ownerDocument!;
            this._moduleText = this.formatXMLForEditing(asElement.outerHTML);

            return false;
        } catch (e) {
            console.error(e); // TODO: Show a notification to the user
            return FomodLoadRejectReason.UnsalvageableModuleDoc;
        }
    }


    constructor(protected eventTarget: FomodEventTarget) {

    }


    formatXMLForEditing(text: string) {
        return xmlFormat(text, {
            forceSelfClosingEmptyTag: true,
            indentation: '    ',
            strictMode: true,
            whiteSpaceAtEndOfSelfclosingTag: true,
            lineSeparator: '\n',
            collapseContent: true,
        });
    }

    formatXMLForSaving(text: string) {
        return xmlFormat(text, {
            forceSelfClosingEmptyTag: true,
            indentation: '',
            strictMode: true,
            whiteSpaceAtEndOfSelfclosingTag: false,
            lineSeparator: '',
            collapseContent: true,
        });
    }

    private reloadModuleIfNeeded(getType: 'document' | 'text') {
        if (this._lastModuleEdit === null) return false;
        if (this._lastModuleEdit === getType) return false;

        this._lastModuleEdit = null;

        if (getType === 'document') {
            if (this._moduleText === null) return false;
            return this.reloadFromText(this._moduleText, false);
        } else {
            if (!this._moduleDoc || !this._module) return false;
            this._moduleText = this.formatXMLForEditing(current(createDraft(this._module)).asElement(this._moduleDoc, fomodParseConfig).outerHTML);
            return false;
        }
    }

    private reloadInfoIfNeeded(getType: 'document' | 'text') {
        if (this._lastInfoEdit === null) return false;
        if (this._lastInfoEdit === getType) return false;

        this._lastInfoEdit = null;

        if (getType === 'document') {
            if (this._infoText === null) return false;
            return this.reloadFromText(this._infoText, true);
        } else {
            if (!this._infoDoc || !this._info) return false;
            this._infoText = this.formatXMLForEditing(current(createDraft(this._info)).asElement(this._infoDoc, fomodParseConfig).outerHTML);
            return false;
        }
    }




    protected _lastInfoEdit: 'document' | 'text' | null = null;
    protected abstract _infoDoc: Document | null;
    protected abstract _info: Immutable<FomodInfo> | null;
    protected abstract _infoText: string | null;

    get infoDoc(): Document | null {
        const reloadRejection = this.reloadInfoIfNeeded('document');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload Info.xml from text', reloadRejection);

        return this._infoDoc;
    }

    get info(): Immutable<FomodInfo> {
        const reloadRejection = this.reloadInfoIfNeeded('document');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload Info.xml from text', reloadRejection);

        if (!this._info) throw new Error('Info has not been initialized on this loader!');
        return this._info;
    }

    set info(val: Immutable<FomodInfo>) {
        this.history.add([this.module, val]);
        this._lastInfoEdit = 'document';
    }

    get infoText(): string {
        const reloadRejection = this.reloadInfoIfNeeded('text');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload Info.xml from text', reloadRejection);

        return this._infoText!;
    }

    set infoText(text: string) {
        this._infoText = text;
        this._lastInfoEdit = 'text';
    }

    get infoTextForSaving(): string {
        const reloadRejection = this.reloadInfoIfNeeded('text');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload Info.xml from text', reloadRejection);

        return this.formatXMLForSaving(this._infoText!);
    }





    protected _lastModuleEdit: 'document' | 'text' | null = null;
    protected abstract _moduleDoc: Document | null;
    protected abstract _module: Immutable<Fomod<false>> | null;
    protected abstract _moduleText: string | null;

    get moduleDoc(): Document | null {
        const reloadRejection = this.reloadModuleIfNeeded('document');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload ModuleConfig.xml from text', reloadRejection);

        if (!this._moduleDoc) throw new Error('ModuleConfig.xml has not been initialized on this loader!');

        return this._moduleDoc;
    }

    get module(): Immutable<Fomod<false>> {
        const reloadRejection = this.reloadModuleIfNeeded('document');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload ModuleConfig.xml from text', reloadRejection);

        if (!this._module) throw new Error('ModuleConfig has not been initialized on this loader!');
        return this._module;
    }

    set module(val: Immutable<Fomod<false>>) {
        this.history.add([val, this.info]);
        this._lastModuleEdit = 'document';
    }




    get moduleText(): string {
        const reloadRejection = this.reloadModuleIfNeeded('text');
        if (reloadRejection) throw new FomodLoadingError('Failed to reload ModuleConfig.xml from text', reloadRejection);

        return this.formatXMLForEditing(createDraft(this.module).asElement(this.moduleDoc!, fomodParseConfig).outerHTML);
    }

    set moduleText(text: string) {
        this._moduleText = text;
        this._lastModuleEdit = 'text';
    }

    get moduleDocForSaving(): string {
        return this.formatXMLForSaving(createDraft(this.module).asElement(this.moduleDoc!, fomodParseConfig).outerHTML);
    }




    protected history: HistoryStates<[Fomod<false>, FomodInfo]> = (()=>{
        const this_ = this as FomodLoader;

        const item: HistoryStates<[Fomod<false>, FomodInfo]> = {
            add: function (this: HistoryStates<[Fomod<false>, FomodInfo]>, s: TupleOfImmutable<[Fomod<false>, FomodInfo]>) {
                const lastState = this.current;

                if (lastState && lastState[0] === s[0] && lastState[1] === s[1]) return;

                addBase.bind<typeof addBase<[Fomod<false>, FomodInfo]>>(this)(s);

                if (lastState?.[0] !== this.current![0]) this_.eventTarget.dispatchEvent(new Event('module-update', {cancelable: false}));
                if (lastState?.[1] !== this.current![1]) this_.eventTarget.dispatchEvent(new Event('info-update', {cancelable: false}));
            },
            move: function (this: HistoryStates<[Fomod<false>, FomodInfo]>, howMuch: number) {
                const lastState = this.current!;
                const newState = moveBase.bind<typeof moveBase<[Fomod<false>, FomodInfo]>>(this)(howMuch);

                if (!newState) return;
                if (lastState[0] !== newState[0]) this_.eventTarget.dispatchEvent(new Event('module-update', {cancelable: false}));
                if (lastState[1] !== newState[1]) this_.eventTarget.dispatchEvent(new Event('info-update', {cancelable: false}));
            },
            forward: [],
            backward: [],
            get current() { return this_._module && this_._info ? [this_._module, this_._info] : null; },
            set current(newState: [Immutable<Fomod<false>>, Immutable<FomodInfo>] | null) {
                if (!newState) return;

                this_._module = newState[0];
                this_._info = newState[1];
            }
        };

        for (const key in item)
            if (item[key as keyof typeof item] && typeof item[key as keyof typeof item] === 'function')
                item[key as keyof typeof item] = (item[key as keyof typeof item] as Function).bind(item);

        return item;
    })();


    undo() {
        this.history.move(-1);
    }

    redo() {
        this.history.move(1);
    }
}


type TupleOfImmutable<T> = T extends [] ? { [K in keyof T]: Immutable<T[K]> } : Immutable<T>;

export interface HistoryStates<T> {
    forward: TupleOfImmutable<T>[],
    backward: TupleOfImmutable<T>[],
    current: TupleOfImmutable<T> | null,
    move(howMuch: number): unknown,
    add: typeof addBase<T>,
};

export function moveBase<T>(this: HistoryStates<T>, howMuch: number): TupleOfImmutable<T>|null {

    const oldState = this.current!;
    let newState: TupleOfImmutable<T>|null;

    if (howMuch === 0) newState = oldState;
    else if (howMuch > 0) {
        if (this.forward.length < 1) return oldState;
        const lengthToSlice = Math.min(howMuch, this.forward.length);

        newState = this.forward.shift()!;
        this.backward = [...this.backward, oldState];
        this.forward = this.forward.slice(0, this.forward.length - lengthToSlice + 1);
    } else {
        if (this.backward.length < 1) return oldState;
        const lengthToSlice = Math.min(-howMuch, this.backward.length);

        newState = this.backward.pop()!;
        this.forward = [oldState, ...this.forward];
        this.backward = this.backward.slice(0, this.backward.length - lengthToSlice + 1);
    }

    this.current = newState;

    return newState;
}

export function addBase<T>(this: HistoryStates<T>, newState: TupleOfImmutable<T>) {
    if (this.current) this.backward = [...this.backward, this.current];
    this.current = newState;
    this.forward = [];
}
