'use client';

import { useFomod } from '../loaders';
import React from 'react';
import { InstallInstancesByDocument, InstallPattern } from 'fomod';
import { castDraft, current, produce } from 'immer';

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
}
