'use client';

import { useFomod } from '@/app/loaders';
import BuilderStep from './step';
import { Immutable, produce, Draft, castDraft } from 'immer';
import { Fomod, Step, SortingOrder } from 'fomod';
import React from 'react';
import { useSettings, Settings, defaultSettings } from '@/app/components/SettingsContext';
import BuilderChildren from './BuilderChildren';
import styles from './builder.module.scss';
import { createNewGroup } from './step';
import SortingOrderDropdown from './SortingOrderDropdown';
import { T } from '@/app/localization/index';
import ToggleSwitch from '@/app/components/toggle-switch';

export default function FomodEditor() {
    const {loader, eventTarget} = useFomod();

    const [reRenderRef, reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            reRender_({});
            //console.log('marking for re-render...');
        };

        eventTarget.addEventListener('module-update', reRender);
        return () =>  eventTarget.removeEventListener('module-update', reRender);
    }, [eventTarget]);

    //console.log('rendering the whole thing...', loader?.module);

    const edit = React.useCallback((recipe: (draft: Draft<Fomod<false>>) => Draft<Fomod<false>> | undefined | void) => {
        if (!loader) return console.error('Tried to edit with no loader! (this should not be possible)');
        //console.log('editing...');
        loader.module = produce(loader.module, recipe) as Immutable<Fomod<false>>;

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loader, loader?.module, reRenderRef]);

    const settings = useSettings() ?? defaultSettings;

    const [namesAreEntangled, setNamesEntangled] = React.useState(false);

    const editName = React.useCallback((value: string, isModule = true) => {
        if (!loader) return console.error('Tried to change name with no loader! (this should not be possible)');

        if (isModule || namesAreEntangled) edit(draft => {
            draft.moduleName = value;
        });

        if (!isModule || namesAreEntangled) loader.info = produce(loader.info, draft => {
            draft.data.Name = value;
        });
    }, [edit, loader, namesAreEntangled]);

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
        <label>
            {namesAreEntangled ? <T tkey='builder_module_name' params={[loader.module.moduleName]} /> : <T tkey='builder_module_name_entangled' params={[loader.module.moduleName, loader.info.data.Name]} />}
            <input type='text' value={loader.module.moduleName} onChange={e => editName(e.target.value)} />
            <ToggleSwitch value={namesAreEntangled} onChange={setNamesEntangled} />
        </label>
        {!namesAreEntangled || (loader.info.data.Name && loader.module.moduleName !== loader.info.data.Name) && <label>
            <T tkey='builder_info_name' params={[loader.info.data.Name]} />
            <input type='text' value={loader.info.data.Name} onChange={e => editName(e.target.value, false)} />
            {!namesAreEntangled && <T tkey='builder_module_name_conflict_warning' />}
        </label>}

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
