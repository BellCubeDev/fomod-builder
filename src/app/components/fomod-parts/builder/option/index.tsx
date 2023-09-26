'use client';

import React from 'react';

import { Immutable, Draft } from 'immer';
import { Option } from 'fomod';
import { T } from '@/app/components/localization';
import { useSettings } from '../../../SettingsContext';
import styles from '../builder.module.scss';
import HeaderLikeInput from '../../../header-like-input';

export default function BuilderOption({option, edit}: {option: Immutable<Option<false>>, edit: (recipe: (draft: Draft<Option<false>>) => Draft<Option<false>> | undefined | void) => void}) {
    const settings = useSettings();

    const editName = React.useCallback((value: string) => {
        edit(draft => {
            draft.name = value;
        });
    }, [edit]);

    return <>
        <HeaderLikeInput value={option.name} noValue={<T tkey='option_header' params={[option.name]} />} onChange={editName} className={styles.stepName} />
    </>;
}

