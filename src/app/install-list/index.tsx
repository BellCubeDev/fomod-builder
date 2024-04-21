'use client';

import { useFomod } from '../loaders';
import React from 'react';
import { Install, InstallInstancesByDocument, InstallPattern } from 'fomod';
import { castDraft, current, produce } from '@/immer';
import { FomodFileExplorer } from './files';

export default function InstallList() {
    const {loader, eventTarget} = useFomod();

    const [reRenderRef, reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            reRender_({});
        };

        eventTarget.addEventListener('module-update', reRender);
        return () =>  eventTarget.removeEventListener('module-update', reRender);

    }, [eventTarget]);

    React.useEffect(() => {
        if (!loader) return;


    });

    if (!loader) return null;

    return <>
        <FomodFileExplorer installs={Array.from(loader.module?.installs ?? []).filter(i => i instanceof Install) as Install<false>[]} edit={installs => {
            console.log('edit() was called on a Fomod file list', installs);
        }}/>
    </>;
}
