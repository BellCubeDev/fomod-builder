'use client';

import React from 'react';

import { Immutable, Draft, produce } from 'immer';
import { Step, Group, SortingOrder, TypeDescriptor, TypeNameDescriptor, OptionType, Option, GroupBehaviorType } from 'fomod';
import { T } from '@/app/components/localization';
import SortingOrderDropdown from './SortingOrderDropdown';
import { useSettings, defaultSettings, Settings } from '../../SettingsContext';
import styles from './builder.module.scss';
import HeaderLikeInput from '../../header-like-input';
import BuilderChildren from './BuilderChildren';
import BuilderGroup from './group';
import { createNewOption } from './group';

export default function BuilderStep({step, edit}: {step: Immutable<Step<false>>, edit: (recipe: (draft: Draft<Step<false>>) => Draft<Step<false>> | undefined | void) => void}) {
    const settings = useSettings();

    const editName = React.useCallback((value: string) => {
        edit(draft => {
            draft.name = value;
        });
    }, [edit]);

    const editSortingOrder = React.useCallback((sortingOrder: string|null) => {
        const resolvedOrder = sortingOrder ?? settings?.defaultGroupSortingOrder ?? defaultSettings.defaultGroupSortingOrder;
        if (resolvedOrder === step.sortingOrder) return;

        edit(draft => { draft.sortingOrder = resolvedOrder; });
    }, [edit, settings?.defaultGroupSortingOrder, step.sortingOrder]);

    return <>
        <HeaderLikeInput value={step.name} noValue={<T tkey='step_header' params={[step.name]} />} onChange={editName} className={styles.stepName} />

        <SortingOrderDropdown className={`${styles.dropdown} ${styles.dropdownSortingOrder}`}
            value={step.sortingOrder}
            onChange={editSortingOrder}
        />

        <BuilderChildren
            ChildComponent={BuilderGroup}
            childKey='groups'
            type='group'
            edit={edit}
            createChildClass={() => {
                const group = new Group('', settings?.defaultGroupBehavior ?? GroupBehaviorType.SelectAny, settings?.defaultOptionSortingOrder ?? SortingOrder.Explicit);

                const typeDescriptor = new TypeDescriptor(new TypeNameDescriptor('type', OptionType.Optional, false));
                group.options.add(new Option('', '', '', typeDescriptor));

                return group;
            }}
            className={styles.groupWrapper}
        >
            {step.groups}
        </BuilderChildren>

    </>;
}

export function createNewGroup(settings: Settings | null) {
    const group = new Group('', settings?.defaultGroupBehavior ?? GroupBehaviorType.SelectAny, settings?.defaultOptionSortingOrder ?? SortingOrder.Explicit);
    group.options.add(createNewOption(settings));

    return group;
}

