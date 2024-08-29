import path from 'path';

import styles from './FolderLoader.module.scss';
import { TranslationTableKeys } from '@/app/localization/strings';
import { T } from '@/app/localization';

import { FomodLoader, FomodSaveRejectReason, FomodLoadRejectReason, FomodEventTarget, reorganizeInstalls, fomodParseConfig } from '..';
import { parseInfoDoc, parseModuleDoc, Fomod, BlankModuleConfig, FomodInfo, BlankInfoDoc, getOrCreateElementByTagName } from 'fomod';
import { produce } from '@/immer';
import React from 'react';
import { downloadFile, downloadTextFile } from '../downloadFile';

export default class FileInputLoader extends FomodLoader {
    protected override _info: FomodInfo | null = null;
    protected override _infoDoc: Document | null = null;
    protected override _infoText: string | null = null;

    protected override _module: Fomod<false> | null = null;
    protected override _moduleDoc: Document | null = null;
    protected override _moduleText: string | null = null;

    constructor(eventTarget: FomodEventTarget, protected moduleFile: File, protected infoFile: File) {
        super(eventTarget);

    }

    async commission(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> > {
        const [infoText, moduleText] = await Promise.all([
            this.infoFile.text(),
            this.moduleFile.text(),
        ]);

        const infoResult = this.reloadInfoFromText(infoText);
        const moduleResult = this.reloadModuleFromText(moduleText);

        this.history.add([this.module!, this.info!]);

        return infoResult || moduleResult;
    }

    async decommission(): Promise<void> {
        if (this._moduleDoc && this._module) {
            produce(this._module!, (draft) => { draft.decommission(this._moduleDoc!); });
        }
    }

    async getFileByPath(path: string): Promise<File | null> {
        return null;
    }

    async pickFile(): Promise<[path: string, file: File, extraData: null] | null> {
        return null;
    }

    async save_(): Promise<false> {
        downloadTextFile(this.infoText, 'Info.xml', 'text/xml');
        downloadTextFile(this.moduleText, 'ModuleConfig.xml', 'text/xml');
        return false
    }

    static override CanUse = true; // You'd have to try real hard to find a browser that doesn't support type="file" for inputs.
    static override FileSystemCapability = false;
    static override readonly Name = 'loader_filesystem' satisfies keyof TranslationTableKeys;

    static override async LoaderUIClickEvent(eventTarget: FomodEventTarget, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<[false, FileInputLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]> {

        const moduleFileInput = FileInputLoader.loaderInputs.moduleConfig;
        if (!moduleFileInput) {
            console.warn('[loaders > FileInput > LoaderUIClickEvent] The ModuleConfig.xml <input> element was not found! This means the loader UI was once rendered but is no longer on the page!');
            return [FomodLoadRejectReason.MissingFiles];
        }
        const moduleFile = moduleFileInput.files?.[0];

        const infoFileInput = FileInputLoader.loaderInputs.info;
        if (!infoFileInput) {
            console.warn('[loaders > FileInput > LoaderUIClickEvent] The Info.xml <input> element was not found! This means the loader UI was once rendered but is no longer on the page!');
            return [FomodLoadRejectReason.MissingFiles];
        }
        const infoFile = infoFileInput.files?.[0];

        if (!infoFile || !moduleFile) return [FomodLoadRejectReason.MissingFiles];

        const loader = new FileInputLoader(eventTarget, moduleFile, infoFile);
        const commissionResult = await loader.commission();
        if (commissionResult) return [commissionResult];

        return [false, loader];
    }

    static loaderInputs: {
        info: HTMLInputElement | null;
        moduleConfig: HTMLInputElement | null;
    } = {
        info: null,
        moduleConfig: null,
    };

    static override LoaderUI({ onButtonClick }: { onButtonClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void }): JSX.Element {
        const infoInputId = React.useId();
        const moduleConfigInputId = React.useId();

        React.useEffect(() => {
            return () => {
                FileInputLoader.loaderInputs.info = null;
                FileInputLoader.loaderInputs.moduleConfig = null;
            };
        }, []);

        const [readyToSubmit, setReadyToSubmit] = React.useState(false);
        const calculateReadiness = React.useCallback(() => {
            if (!FileInputLoader.loaderInputs.info) return setReadyToSubmit(false);
            if (!FileInputLoader.loaderInputs.moduleConfig) return setReadyToSubmit(false);

            const infoFile = FileInputLoader.loaderInputs.info.files?.[0];
            if (!infoFile) return setReadyToSubmit(false);

            const moduleFile = FileInputLoader.loaderInputs.moduleConfig.files?.[0];
            if (!moduleFile) return setReadyToSubmit(false);

            setReadyToSubmit(true);
        }, []);


        // This technique goes to https://dev.to/code_rabbi/programmatically-setting-file-inputs-in-javascript-2p7i

        const createBlankInfoFile = React.useCallback(() => {
            if (!FileInputLoader.loaderInputs.info) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([BlankInfoDoc], '[New] Info.xml'));

            FileInputLoader.loaderInputs.info.files = dataTransfer.files;
            calculateReadiness();
        }, []);

        const createBlankModuleConfigFile = React.useCallback(() => {
            if (!FileInputLoader.loaderInputs.moduleConfig) return;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(new File([BlankModuleConfig], '[New] ModuleConfig.xml'));

            FileInputLoader.loaderInputs.moduleConfig.files = dataTransfer.files;
            calculateReadiness();
        }, []);

        return <div className={styles.fsLoaderError}>
            <h3><T tkey='loader_file_input' params={[true]} /></h3>

            <label htmlFor={infoInputId}><T tkey='loader_file_input_header_info' /></label>
            <input type='file' id={infoInputId} accept='application/xml' ref={(r) => {FileInputLoader.loaderInputs.info = r}} onChange={calculateReadiness} />
            <button onClick={createBlankInfoFile}><T tkey='loader_file_input_button_create_info' /></button>

            <br /><br />

            <label htmlFor={moduleConfigInputId}><T tkey='loader_file_input_header_module_config' /></label>
            <input type='file' id={moduleConfigInputId} accept='application/xml' ref={(r) => {FileInputLoader.loaderInputs.moduleConfig = r}} onChange={calculateReadiness} />
            <button onClick={createBlankModuleConfigFile}><T tkey='loader_file_input_button_create_module_config' /></button>

            { readyToSubmit && <>
                <br /><br />

                <button onClick={onButtonClick}><T tkey='loader_file_input_button_load' /></button>
            </> }
        </div>;
    }

}
