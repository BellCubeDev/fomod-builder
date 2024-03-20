'use client';

import React from 'react';

import { Immutable, Draft, castDraft } from '@/immer';
import { Option, FlagSetter, FlagInstance, OptionType } from 'fomod';
import { T } from '@/app/localization';
import { useSettings, Settings } from '@/app/components/SettingsContext';
import styles from '../builder.module.scss';
import { useTranslate } from '../../../localization/index';
import DynamicImageDisplay from '../../DynamicImageDisplay';
import HeaderLikeInput from '@/app/components/header-like-input/index';
import BuilderChildren from '../BuilderChildren';

export default function BuilderOption({option, edit}: {option: Immutable<Option<false>>, edit: (recipe: (draft: Draft<Option<false>>) => Draft<Option<false>> | undefined | void) => void}) {
    const settings = useSettings();

    const {loader} = useFomod();

    const editName = React.useCallback((value: string) => {
        edit(draft => {
            draft.name = value;
        });
    }, [edit]);

    const editDescription = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        edit(draft => {
            draft.description = e.target.value;
        });
    }, [edit]);

    const editImage = React.useCallback((v: string) => {
        edit(draft => {
            draft.image = v || null;
        });
    }, [edit]);

    const optionFlagName = loader?.moduleDoc ? option.existingOptionFlagSetterByDocument.get(loader.moduleDoc)?.name : undefined;

    return <div>
        <div>
            <HeaderLikeInput value={option.name} noValue={<T tkey='option_header' params={[option.name]} />} onChange={editName} className={styles.stepName} />
            <textarea className={styles.optionDescription} value={option.description} onChange={editDescription} placeholder={useTranslate('option_description_placeholder', option)} />
        </div>
        <div>
            <DynamicImageDisplay path={option.image} alt={useTranslate('option_image_alt', option)} />
            <DynamicWidthInput value={option.image || ''} onChange={editImage} placeholder={useTranslate('option_image_placeholder', option)} />
        </div>
        <div>
            <BuilderChildren
                ChildComponent={BuilderFlag}
                childKey='flagsToSet'
                type='flag'
                edit={edit}
                createChildClass={createNewFlag.bind(null, settings)}
                className={styles.flagWrapper}
                showAll={true}

            >
                {option.flagsToSet}
            </BuilderChildren>
        </div>
        <div>
            Name of option flag: {optionFlagName}
        </div>
    </div>;
}

export function createNewFlag(settings: Settings | null) {
    return castDraft(new FlagSetter(new FlagInstance('', '', true)));
}

export function BuilderFlag({flag, edit}: {flag: Immutable<FlagSetter>, edit: (recipe: (draft: Draft<FlagSetter>) => Draft<FlagSetter> | undefined | void) => void}) {
    const editFlagName = React.useCallback((value: string) => {
        edit(draft => {
            draft.name = value;
        });
    }, [edit]);

    const editFlagValue = React.useCallback((value: string) => {
        edit(draft => {
            draft.value = value;
        });
    }, [edit]);

    return <div className={styles.flagToSet}>
        <T tkey='flag_sentence' params={[
            flag,
            <HeaderLikeInput style={{width: 'max-content'}} key='name' value={flag.name} noValue={<T tkey='flag_name_placeholder' params={[flag]} />} onChange={editFlagName} />,
            <HeaderLikeInput style={{width: 'max-content'}} key='value' value={flag.value} noValue={<T tkey='flag_value_placeholder' params={[flag]} />} onChange={editFlagValue} />,
        ]}/>
    </div>;
}

import Dropdown from '@/app/components/dropdown/index';
import DynamicWidthInput from '@/app/components/dynamic-width-input';
import { useFomod } from '@/app/loaders';

export const OptionBehaviorTypes = Object.values(OptionType).reverse() as OptionType[];

export function OptionBehaviorDropdown(props: Omit<Parameters<typeof Dropdown<string>>[0], 'options'>) {
    return <Dropdown<string>
        options={   OptionBehaviorTypes.map(order => ({
            value: order,
                   // eslint-disable-next-line react-hooks/rules-of-hooks -- This will always be called in the same order
            label: useTranslate(`behavior_type_${order.toLowerCase() as Lowercase<OptionType>}`),
        }))   }
        {...props}
    />;
}
