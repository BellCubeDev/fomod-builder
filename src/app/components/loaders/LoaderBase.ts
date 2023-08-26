'use client';

import React from "react";
import xmlFormat from 'xml-formatter';
import { XmlParserElementNode }from 'xml-parser-xo';
import { Fomod, FomodInfo } from 'fomod';
import { useImmer } from 'use-immer';
import { Immutable, enableMapSet } from 'immer';
enableMapSet();

import { TranslationTableKeys } from '../localization/strings';
import { FomodLoadRejectReason, FomodSaveRejectReason } from '.';
import { metadata } from '../../layout';


// TODO: Test that any of this actually does what I want it to

export abstract class FomodLoader {
    abstract getFileByPath(path: string): Promise<File|null>;

    static CanUse: boolean;
    static Name: keyof TranslationTableKeys & `loader_${string}`;
    static LoaderUI: React.FunctionComponent<{}>;
    static LoaderUIClickEvent: (...params: Parameters<React.MouseEventHandler<HTMLButtonElement>>) => Promise<[false, FomodLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]>;

    abstract commission?(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> >;
    abstract decommission(): Promise<void>;

    abstract save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> >;

    abstract reloadFromText(text: string, info?: boolean): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>;



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

    private reloadInfoIfNeeded() {
        const el = this._infoDoc ? this._info?.asElement(this._infoDoc) : null;
        if (this._infoText !== el?.outerHTML ?? '')
            this.reloadFromText(this._infoText ?? '', false);
    }

    private reloadModuleIfNeeded() {
        const el = this._moduleDoc ? this._module?.asElement(this._moduleDoc) : null;
        if (this._moduleText !== el?.outerHTML ?? '')
            this.reloadFromText(this._moduleText ?? '', false);
    }




    protected abstract _infoDoc: Document | null;
    protected abstract _info: Immutable<FomodInfo> | null;
    protected abstract _infoText: string | null;

    get infoDoc(): Document | null {
        this.reloadInfoIfNeeded();
        return this._infoDoc;
    }

    get info(): Immutable<FomodInfo> {
        this.reloadInfoIfNeeded();
        if (!this._info) throw new Error('Info has not been initialized on this loader!');

        return this._info;
    }

    set info(val: Immutable<FomodInfo>) {
        this.history.add([this.module, val]);
    }

    get infoText(): string {
        this.reloadInfoIfNeeded();
        return this.formatXMLForEditing(this._infoText || '<ERROR />');
    }

    set infoText(text: string) {
        this._infoText = text;
    }

    get infoTextForSaving(): string {
        return this.formatXMLForSaving(this.infoText);
    }






    protected abstract _moduleDoc: Document | null;
    protected abstract _module: Immutable<Fomod<false>> | null;
    protected abstract _moduleText: string | null;

    get moduleDoc(): Document | null {
        this.reloadModuleIfNeeded();
        return this._moduleDoc;
    }

    get module(): Immutable<Fomod<false>> {
        this.reloadModuleIfNeeded();
        if (!this._module) throw new Error('ModuleConfig has not been initialized on this loader!');

        return this._module;
    }

    set module(val: Immutable<Fomod<false>>) {
        this.history.add([val, this.info]);
    }




    get moduleText(): string {
        this.reloadModuleIfNeeded();
        return this.formatXMLForEditing(this._moduleText || '<ERROR />');
    }

    set moduleText(text: string) {
        this._moduleText = text;
    }

    get moduleDocForSaving(): string {
        return this.formatXMLForSaving(this.moduleText);
    }




    protected history: HistoryStates<[Fomod<false>, FomodInfo]> = (()=>{
        const this_ = this as FomodLoader;

        const item: HistoryStates<[Fomod<false>, FomodInfo]> = {
            add: add<[Fomod<false>, FomodInfo]>,
            move: moveBase<[Fomod<false>, FomodInfo]>,
            moveBase: moveBase<[Fomod<false>, FomodInfo]>,
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
    move(howMuch: number): void,
    moveBase: typeof moveBase<T>,
    add: typeof add<T>,
};

export function moveBase<T>(this: HistoryStates<T>, howMuch: number): TupleOfImmutable<T>|null {

    let newState: TupleOfImmutable<T>|null;
    if (howMuch === 0) newState = this.current;
    else if (howMuch > 0) {
        newState = this.forward[howMuch - 1] || this.current;
        this.backward = [...this.backward, ...(this.current ? [this.current] : []), ...this.forward.slice(0, howMuch - 1)];
    }
    else {
        newState = this.backward[Math.abs(howMuch) - 1] || this.current;
        this.forward = [...this.forward.slice(Math.abs(howMuch) - 1), ...(this.current ? [this.current] : []), ...this.backward];
    }

    return newState;
}

export function add<T>(this: HistoryStates<T>, newState: TupleOfImmutable<T>) {
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

