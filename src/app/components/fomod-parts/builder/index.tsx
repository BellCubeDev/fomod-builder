'use client';

import { useFomod } from '../../loaders/index';
import BuilderStep from './step';
import { Immutable, produce, Draft, castDraft } from 'immer';
import { Fomod, Step, SortingOrder } from 'fomod';
import React from 'react';
import { useSettings, Settings, defaultSettings } from '../../SettingsContext';
import BuilderChildren from './BuilderChildren';
import styles from './builder.module.scss';
import { createNewGroup } from './step';
import SortingOrderDropdown from './SortingOrderDropdown';
import { T } from '../../localization/index';

export default function FomodEditor() {
    const {loader, eventTarget} = useFomod();

    const [reRenderRef, reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            reRender_({});
            console.log('marking for re-render...');
        };

        eventTarget.addEventListener('module-update', reRender);
        return () =>  eventTarget.removeEventListener('module-update', reRender);
    }, [eventTarget]);

    console.log('rendering the whole thing...', loader?.module);

    const edit = React.useCallback((recipe: (draft: Draft<Fomod<false>>) => Draft<Fomod<false>> | undefined | void) => {
        if (!loader) return;
        console.log('editing...');
        loader.module = produce(loader.module, recipe) as Immutable<Fomod<false>>;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loader, loader?.module, reRenderRef]);

    const settings = useSettings() ?? defaultSettings;

    const editName = React.useCallback((value: string) => {
        edit(draft => {
            draft.moduleName = value;
        });
    }, [edit]);

    const editSortingOrder = React.useCallback((sortingOrder: string|null) => {
        if (!loader) return;
        const resolvedOrder = sortingOrder ?? settings.defaultGroupSortingOrder;
        if (resolvedOrder === loader.module.sortingOrder) return;

        edit(draft => { draft.sortingOrder = resolvedOrder; });
    }, [edit, loader, settings?.defaultGroupSortingOrder]);

    if (!loader) return null;

    return <>
        <label>
            <T tkey='builder_step_sorting_order' />
            <SortingOrderDropdown
                value={loader.module.sortingOrder}
                onChange={editSortingOrder}
                className={styles.sortingOrderDropdown}
            />
        </label>
        <BuilderChildren
            createChildClass={createNewStep.bind(null, settings)}
            edit={edit}
            className={styles.builderBody}
            childKey='steps'
            ChildComponent={BuilderStep}
            type='step'
        >{loader.module.steps}</BuilderChildren>
    </>;
}

export function createNewStep(settings: Settings | null) {
    const step = castDraft(new Step('', SortingOrder.Explicit));
    step.groups.add(createNewGroup(settings));

    return step;
}
