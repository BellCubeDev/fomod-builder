'use client';

import React from "react";
import xmlFormat from 'xml-formatter';
import { Fomod, FomodInfo } from 'fomod';
import { useImmer } from 'use-immer';
import { Immutable, immerable, createDraft } from 'immer';

import { TranslationTableKeys } from '../localization/strings';
import { FomodLoadRejectReason, FomodSaveRejectReason } from '.';

import * as fomodLib from 'fomod';
import { FomodEventTarget } from './index';

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

export abstract class FomodLoader {
    abstract getFileByPath(path: string): Promise<File|null>;

    static CanUse: boolean;
    static Name: keyof TranslationTableKeys & `loader_${string}`;
    static LoaderUI: React.FunctionComponent<{}>;
    static LoaderUIClickEvent: (eventTarget: FomodEventTarget, ...params: Parameters<React.MouseEventHandler<HTMLButtonElement>>) => Promise<[false, FomodLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]>;

    abstract commission?(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;
    abstract decommission(): Promise<unknown>;

    abstract save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> >;

    /** This MUST set the _x, _xDoc, and _xText properties. MUST! */
    abstract reloadFromText(text: string, info?: boolean): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>;


    protected eventTarget: FomodEventTarget;
    constructor(eventTarget: FomodEventTarget) {
        this.eventTarget = eventTarget;
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
            this._moduleText = this.formatXMLForEditing(createDraft(this._module).asElement(new DOMParser().parseFromString('', 'application/xml')).outerHTML);
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
            this._infoText = this.formatXMLForEditing(createDraft(this._info).asElement(new DOMParser().parseFromString('', 'application/xml')).outerHTML);
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

        return this.formatXMLForEditing(createDraft(this.module).asElement(this.moduleDoc!).outerHTML);
    }

    set moduleText(text: string) {
        this._moduleText = text;
        this._lastModuleEdit = 'text';
    }

    get moduleDocForSaving(): string {

        return this.formatXMLForSaving(createDraft(this.module).asElement(this.moduleDoc!).outerHTML);
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

export function useProducer<T>(initialState: TupleOfImmutable<T>, history: HistoryStates<T>) {
    const [val, setter] = useImmer(initialState);

    React.useEffect(() => {
        history.add(val);
    }, [val, history]);

    return [val, setter] as const;
}
