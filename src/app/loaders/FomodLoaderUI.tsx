'use client';

// LOAD THIS WITH NO SSR

import { useFomod, FomodLoader as FomodLoaderClass } from '.';
import { T } from '../localization/index';
import styles from './FolderLoader.module.scss';
import FileSystemFolderLoader from './implementations/Folder';
import React from 'react';
import { FomodLoadRejectReason } from './index';

export default function FomodLoaderUI() {
    const core = useFomod();

    const clickEvent = React.useCallback(async (loader: Omit<typeof FomodLoaderClass, 'new'>, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        const loaderResult = await loader.LoaderUIClickEvent(core.eventTarget, e);

        if (loaderResult[0]) return console.error(FomodLoadRejectReason[loaderResult[0]]);

        core.load(loaderResult[1]);
    }, [core]);

    return <div className={styles.wrapper}>
        <h2>{
            core.loader
                ? <T tkey='loaders_header_loaded' params={[(core.loader.constructor as typeof FomodLoaderClass).Name]} />
                : <T tkey='loaders_header_unloaded' />
        }</h2>

        <div className={styles.loader}>
            <FileSystemFolderLoader.LoaderUI />
            {FileSystemFolderLoader.CanUse && <button type='button' onClick={(e) => clickEvent(FileSystemFolderLoader, e)}>Select Folder</button>}
        </div>
    </div>;
}
