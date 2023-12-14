'use client';

import { T } from '../../localization/index';
import styles from './settingsGrid.module.scss';
import DynamicWidthInput from '@/app/components/dynamic-width-input';
import React from 'react';
import { useFomod } from '@/app/loaders';
import { produce } from 'immer';
import { FomodInfo } from 'fomod';

export function MetadataPage() {
    const {loader, eventTarget} = useFomod();
    const [reRenderRef, reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            reRender_({});
        };

        eventTarget.addEventListener('info-update', reRender);
        return () =>  eventTarget.removeEventListener('info-update', reRender);
    }, [eventTarget]);

    const edit = React.useCallback((recipe: (draft: Draft<FomodInfo>) => Draft<FomodInfo> | undefined | void) => {
        if (!loader) return console.error('Tried to edit with no loader! (this should not be possible)');
        loader.info = produce(loader.info, recipe) as Immutable<FomodInfo>;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loader, loader?.info, reRenderRef]);


    if (!loader) {
        console.warn('Tried to load metadata tab with no loader! (this should not be possible)');
        return null;
    }

    const info = loader.info;

    return <table className={styles.grid}>
        <tr>
            {
                // TODO: Use the entangled name thing here too
            }
            <td><T tkey='builder_info_name' params={[info.data.Name]} /></td>
            <td><DynamicWidthInput className={styles.metadata__input} value={info.data.Name} onChange={(value) => edit(draft => { draft.data.Name = value; })} /></td>
        </tr>
        <tr>
            <td><T tkey='metadata_author' params={[info.data.Author]} /></td>
            <td><DynamicWidthInput className={styles.metadata__input} value={info.data.Author} onChange={(value) => edit(draft => { draft.data.Author = value; })} /></td>
        </tr>
        <tr>
            <td><T tkey='metadata_version' params={[info.data.Version]} /></td>
            <td><DynamicWidthInput className={styles.metadata__input} value={info.data.Version} onChange={(value) => edit(draft => { draft.data.Version = value; })} /></td>
        </tr>
        <tr>
            <td><T tkey='metadata_website' params={[info.data.Website]} /></td>
            <td><DynamicWidthInput className={styles.metadata__input} value={info.data.Website} onChange={(value) => edit(draft => { draft.data.Website = value; })}
                type='url'
                data-validation-warn
                pattern='^(?:https?:\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$'
            /></td>
        </tr>
        <tr>
            <td><T tkey='metadata_id' params={[info.data.Id]} /></td>
            <td><DynamicWidthInput className={styles.metadata__input} value={info.data.Id} onChange={(value) => edit(draft => { draft.data.Id = value; })}
                type='text'
                data-validation-warn
                pattern='^[0-9]*$'
            /></td>
        </tr>
    </table>;
}
