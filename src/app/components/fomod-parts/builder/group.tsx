'use client';

import React from 'react';

import { Immutable, Draft, produce } from 'immer';
import { Group, Option, OptionType, TypeDescriptor, TypeNameDescriptor, GroupBehaviorType } from 'fomod';
import { T } from '@/app/components/localization';
import SortingOrderDropdown from './SortingOrderDropdown';
import { useSettings, defaultSettings, Settings } from '../../SettingsContext';
import styles from './builder.module.scss';
import HeaderLikeInput from '../../header-like-input';
import BuilderChildren from './BuilderChildren';
import BuilderOption from './option/index';

export default function BuilderGroup({group, edit}: {group: Immutable<Group<false>>, edit: (recipe: (draft: Draft<Group<false>>) => Draft<Group<false>> | undefined | void) => void}) {
    const settings = useSettings();

    const editName = React.useCallback((value: string) => {
        edit(draft => {
            draft.name = value;
        });
    }, [edit]);

    const editSortingOrder = React.useCallback((sortingOrder: string|null) => {
        const resolvedOrder = sortingOrder ?? settings?.defaultGroupSortingOrder ?? defaultSettings.defaultGroupSortingOrder;
        if (resolvedOrder === group.sortingOrder) return;

        edit(draft => { draft.sortingOrder = resolvedOrder; });
    }, [edit, group.sortingOrder, settings?.defaultGroupSortingOrder]);

    const editBehaviorType = React.useCallback((behaviorType: string|null) => {
        const resolvedBehaviorType = behaviorType ?? settings?.defaultGroupBehavior ?? defaultSettings.defaultGroupBehavior;
        if (resolvedBehaviorType === group.behaviorType) return;

        edit(draft => { draft.behaviorType = resolvedBehaviorType; });
    }, [edit, group.behaviorType, settings?.defaultGroupBehavior]);

    return <>
        <HeaderLikeInput value={group.name} noValue={<T tkey='group_header' params={[group.name]} />} onChange={editName} className={styles.stepName} />

        <SortingOrderDropdown className={`${styles.dropdown} ${styles.dropdownSortingOrder}`}
            value={group.sortingOrder}
            onChange={editSortingOrder}
        />

        <GroupBehaviorDropdown className={`${styles.dropdown} ${styles.dropdownBehavior}`}
            value={group.behaviorType}
            onChange={editBehaviorType}
        />

        <BuilderChildren
            ChildComponent={BuilderOption}
            childKey='options'
            type='option'
            edit={edit}
            createChildClass={createNewOption.bind(null, settings)}
            className={styles.optionWrapper}
        >
            {group.options}
        </BuilderChildren>

    </>;
}

export function createNewOption(settings: Settings | null) {
    const typeDescriptor = new TypeDescriptor(new TypeNameDescriptor('type', settings?.defaultOptionType ?? OptionType.Optional, false));
    return new Option('', '', '', typeDescriptor);
}

import Dropdown from '../../dropdown/index';
import { useTranslate } from '../../localization/index';

const orders = Object.values(GroupBehaviorType) as GroupBehaviorType[];

export function GroupBehaviorDropdown(props: Omit<Parameters<typeof Dropdown<string>>[0], 'options'>) {
    return <Dropdown<string>
        options={   orders.map(order => ({
            value: order,
                   // eslint-disable-next-line react-hooks/rules-of-hooks -- This will always be called in the same order
            label: useTranslate(`behavior_type_${order.toLowerCase() as Lowercase<GroupBehaviorType>}`),
        }))   }
        {...props}
    />;
}

