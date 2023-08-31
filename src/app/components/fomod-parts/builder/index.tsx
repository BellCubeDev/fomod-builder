'use client';

import { useFomod } from '../../loaders/index';
import BuilderStep from './step/step';
import { Immutable, produce } from 'immer';
import { Step, SortingOrder } from 'fomod';
import React from 'react';
import { useSettings } from '../../SettingsContext';

export default function FomodEditor() {
    const {loader, eventTarget} = useFomod();

    const [,reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            console.log('reRender'); // TODO: Figure out why this event won't fire
            reRender_({});
        };

        eventTarget.addEventListener('module-update', reRender);
        return () =>  eventTarget.removeEventListener('module-update', reRender);

    }, [eventTarget]);

    const setting = useSettings();

    const addStep = React.useCallback(() => {
        if (!loader) return;

        loader.module = produce(loader.module, draft => {
            draft.steps.add(new Step('', setting?.defaultGroupSortingOrder ?? SortingOrder.Explicit));
        });
    }, [loader, setting]);

    const steps = loader ? Array.from(loader.module.steps) : null;

    if (!loader) return null;

    return <>
        {steps?.map((step, i) => <button key={i}>{step.name}</button> )} <button key={steps?.length} onClick={addStep}>+</button>
        {steps?.map((step, i) => <BuilderStep key={i} step={step as Immutable<Step>} /> )}
    </>;
}
