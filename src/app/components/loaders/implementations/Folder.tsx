import path from 'path';

import styles from './FolderLoader.module.scss';
import { TranslationTableKeys } from '../../localization/strings';
import { T } from '@/app/components/localization';
import { FomodLoader, FomodSaveRejectReason, FomodLoadRejectReason } from '..';

import { parseInfoDoc, parseModuleDoc, Fomod, BlankModuleConfig, FomodInfo, BlankInfoDoc, getOrCreateElementByTagName } from 'fomod';
import { FomodEventTarget } from '../index';

// TODO: Test that any of this actually does what I want it to

export default class FileSystemFolderLoader extends FomodLoader {
    protected override _info: FomodInfo | null = null;
    protected override _infoDoc: Document | null = null;
    protected override _infoText: string | null = null;

    protected override _module: Fomod<false> | null = null;
    protected override _moduleDoc: Document | null = null;
    protected override _moduleText: string | null = null;

    constructor(eventTarget: FomodEventTarget, folder: FileSystemDirectoryHandle | BCDFolder) {
        if (folder instanceof FileSystemDirectoryHandle) folder = new BCDFolder(folder);

        super(eventTarget);

        this.folder = folder;
    }

    public folder: BCDFolder;

    async commission(): Promise<false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> > {
        const [infoFile, moduleFile] = await Promise.all([
            this.folder.getBypath('fomod/Info.xml', true),
            this.folder.getBypath('fomod/ModuleConfig.xml', true),
        ]);

        if (infoFile instanceof BCDFolder || moduleFile instanceof BCDFolder) return FomodLoadRejectReason.FileFolderMismatch;

        const [infoText, moduleText] = await Promise.all([
            infoFile.handle.getFile().then(v => v.text()),
            moduleFile.handle.getFile().then(v => v.text()),
        ]);

        const [infoResult, moduleResult] = await Promise.all([
            this.reloadInfoFromText(infoText),
            this.reloadModuleFromText(moduleText),
        ]);

        this.history.add([this.module, this.info]);

        return infoResult || moduleResult;
    }

    async decommission(): Promise<void> {
        if (this.moduleDoc) this._module?.decommission(this.moduleDoc);
    }

    async getFileByPath(path: string): Promise<File | null> {
        const file = await this.folder.getBypath(path);

        if (file && file instanceof BCDFile) return await file.handle.getFile();
        else return null;
    }

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
        text ||= BlankInfoDoc;

        let doc: Document;

        try {
            doc = new DOMParser().parseFromString(text, 'application/xml');
            if (doc.body?.firstElementChild?.tagName === 'parsererror' || doc.documentElement?.firstElementChild?.tagName === 'parsererror') return FomodLoadRejectReason.InvalidXML;
        } catch (e) {
            if (e instanceof Error && e.name === 'SyntaxError') return FomodLoadRejectReason.InvalidXML;
            else throw e;
        }

        let result = parseInfoDoc(doc);
        if (!result) {
            if (doc.documentElement.getElementsByTagName(FomodInfo.tagName).length) return FomodLoadRejectReason.UnsalvageableInfoDoc;
            result = new FomodInfo();
            result.assignElement(getOrCreateElementByTagName(doc.documentElement, FomodInfo.tagName));
        }

        const asElement = result.asElement(doc);

        this._info = result;
        this._infoDoc = asElement.ownerDocument!;
        this._infoText = asElement.outerHTML;

        return false;
    }

    reloadModuleFromText(text: string): false | Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges> {
        text ||=  BlankModuleConfig;

        let doc: Document;

        try {
            doc = new DOMParser().parseFromString(text, 'application/xml');
            if (doc.body?.firstElementChild?.tagName === 'parsererror' || doc.documentElement?.firstElementChild?.tagName === 'parsererror') return FomodLoadRejectReason.InvalidXML;
        } catch (e) {
            if (e instanceof Error && e.name === 'SyntaxError') return FomodLoadRejectReason.InvalidXML;
            else throw e;
        }


        let result = parseModuleDoc(doc);
        if (!result) {
            if (doc.documentElement.getElementsByTagName(Fomod.tagName).length) return FomodLoadRejectReason.UnsalvageableModuleDoc;
            result = new Fomod();
            result.assignElement(getOrCreateElementByTagName(doc.documentElement, Fomod.tagName));
        }

        const asElement = result.asElement(doc);

        this._module = result;
        this._moduleDoc = asElement.ownerDocument!;
        this._moduleText = asElement.outerHTML;

        return false;
    }

    async save(): Promise<false | Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader> > {
        const [infoFile, moduleFile] = await Promise.all([
            this.folder.getBypath('fomod/Info.xml', true),
            this.folder.getBypath('fomod/ModuleConfig.xml', true),
        ]);
        if (infoFile instanceof BCDFolder || moduleFile instanceof BCDFolder) return FomodSaveRejectReason.FileFolderMismatch;

        const [infoResult, moduleResult] = await Promise.all([
            infoFile.write(this.infoText),
            moduleFile.write(this.moduleText),
        ]);

        return infoResult || moduleResult;
    }

    static override CanUse = typeof FileSystemDirectoryHandle !== 'undefined' && !!window.showDirectoryPicker; // Firefox and Safari sadly don't not support this...
    static override readonly Name = 'loader_filesystem' satisfies keyof TranslationTableKeys;
    static override async LoaderUIClickEvent(eventTarget: FomodEventTarget, e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<[false, FileSystemFolderLoader] | [Exclude<FomodLoadRejectReason, FomodLoadRejectReason.UnsavedChanges>]> {
        let folder = await window.showDirectoryPicker().catch((e) => e instanceof DOMException && e.name === 'AbortError' ? null : Promise.reject(e));
        if (!folder) return [FomodLoadRejectReason.NoFolderSelected];

        const loader = new FileSystemFolderLoader(eventTarget, folder);
        const commissionResult = await loader.commission();
        if (commissionResult) return [commissionResult];

        return [false, loader];
    }
    static override LoaderUI() {
        return <div className={styles.fsLoader}>
            <h2><T tkey='loader_filesystem' params={[true]} /></h2>
            <p><T tkey='loader_filesystem_description' /></p>
        </div>;
    }

}

export type BCDFileSystemObject = BCDFile|BCDFolder

abstract class BCDFileSystemObjectBase {
    abstract handle: FileSystemDirectoryHandle|FileSystemFileHandle;
    abstract parent: BCDFolder | null;

    protected _thisIsExplicitlyWritable: boolean = false;
    set thisIsExplicitlyWritable(value: boolean) { this._thisIsExplicitlyWritable = value; }
    get writable(): boolean { return this._thisIsExplicitlyWritable || (this.parent?.writable ?? false); }

    async requestWritePermission(): Promise<boolean> {
        if (this.writable) return true;
        const permissionQueryResult =  await this.handle.queryPermission({ mode: 'readwrite' });

        if (permissionQueryResult === 'denied') return false;
        if (permissionQueryResult === 'granted') return true;

        if (this.parent) return await this.parent.requestWritePermission();

        const permissionRequestResult = (await this.handle.requestPermission({ mode: 'readwrite' })) === 'granted';
        this.thisIsExplicitlyWritable = permissionRequestResult;
        return permissionRequestResult ;
    }
}

export class BCDFolder extends BCDFileSystemObjectBase {
    handle: FileSystemDirectoryHandle;
    parent: BCDFolder | null;

    children: Record<string, BCDFileSystemObject> = {};

    constructor(handle: FileSystemDirectoryHandle, parent: BCDFolder | null = null) {
        super();
        this.handle = handle;
        this.parent = parent;
        handle.queryPermission({ mode: 'readwrite' }).then(v => this.thisIsExplicitlyWritable = v === 'granted');
    }

    async getDirectChild(name: string, create: true, directory: boolean): Promise<BCDFileSystemObject>
    async getDirectChild(name: string, create?: false, directory?: boolean): Promise<BCDFileSystemObject | null>
    async getDirectChild(name: string, create?: boolean, directory?: boolean): Promise<BCDFileSystemObject | null>
    async getDirectChild(name: string, create = false, directory = false): Promise<BCDFileSystemObject | null> {
        if (name in this.children) return this.children[name]!;

        try {
            const nextHandle = await this.handle[directory ? 'getDirectoryHandle' : 'getFileHandle'](name, { create });
            this.children[name] = nextHandle instanceof FileSystemFileHandle ? new BCDFile(nextHandle, this) : new BCDFolder(nextHandle, this);
            return this.children[name]!;
        } catch (e) {
            if (e && e instanceof Error && e.name === 'NotFoundError') return null;
            else throw e;
        }
    }

    async getBypath(relativePath: string, create?: false): Promise<BCDFileSystemObject | null>
    async getBypath(relativePath: string, create: true): Promise<BCDFileSystemObject>
    async getBypath(relativePath: string, create = false): Promise<BCDFileSystemObject | null> {
        const parsed = path.parse(path.normalize(relativePath));

        if (!parsed.dir) return await this.getDirectChild(parsed.base, create);

        const items = parsed.dir.split(path.sep);
        items.push(parsed.base);

        let current: BCDFolder = this;
        for (let i = 0; i < items.length; i++) {
            const item = items[i]!;

            if (item === '.') continue;
            if (item === '..') {
                if (current.parent === null) return null;
                current = current.parent;
                continue;
            }

            const next = await current.getDirectChild(item, create, i !== items.length - 1);
            if (next === null) return null;

            if (next instanceof BCDFile) {
                if (i !== items.length - 1) throw new Error('Expected folder while in middle of path; got file');
                return next;
            }

            current = next;
        }

        return current;
    }
}

export class BCDFile extends BCDFileSystemObjectBase {
    handle: FileSystemFileHandle;
    parent: BCDFolder | null;

    protected _writeCloseTimeout: NodeJS.Timeout | null = null;
    protected _writeStream: FileSystemWritableFileStream | null = null;
    protected set newWriteStream(value: FileSystemWritableFileStream | null) {
        this._writeStream = value;
        this.createWriteCloseTimeout();
    }


    private createWriteCloseTimeout() {
        const stream = this._writeStream;
        if (!stream) return;

        if (this._writeCloseTimeout) clearTimeout(this._writeCloseTimeout);
        this._writeCloseTimeout = setTimeout((async () => {
            if (stream?.locked) return this.createWriteCloseTimeout();


            const latestWriteStream = this._writeStream;

            await stream.close();
            this._writeStream = null;
            this._writeCloseTimeout = null;

            if (latestWriteStream !== stream)
                throw new Error('Cached stream was changed while waiting to close -- this should NOT be possible!');
        }).bind(this), 1000);
    }

    async getWriteStream(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream> {
        if (this._writeStream) return this._writeStream;

        const newStream = await this.handle.createWritable(options);
        this.newWriteStream = newStream;

        return newStream;
    }

    async write(content: FileSystemWriteChunkType): Promise<false|Exclude<FomodSaveRejectReason, FomodSaveRejectReason.NoLoader>> {
        const hasPermission = this.writable || await this.requestWritePermission();
        if (!hasPermission) return FomodSaveRejectReason.PermissionDenied;

        try {
            this.newWriteStream = this.newWriteStream || await this.handle.createWritable();
        } catch (e) {
            return FomodSaveRejectReason.CouldNotCreateWritable;
        }

        await this._writeStream!.write(content);

        return false;
    }

    constructor(handle: FileSystemFileHandle, parent: BCDFolder | null = null) {
        super();
        this.handle = handle;
        this.parent = parent;
    }
}
