'use client';

import React from 'react';

import { Immutable, Draft } from 'immer';
import { Step } from 'fomod';
import { T } from '@/app/components/localization';

export default function BuilderStep({step, edit}: {step: Immutable<Step>, edit: (recipe: (draft: Draft<Step>) => Step | undefined | void) => void}) {
    const editName = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        edit(draft => {
            draft.name = e.target.value;
        });
    }, [edit]);


    return <>
        <h2><T tkey='step_header' params={[step.name]} /></h2>

        <input type="text" value={step.name} onInput={editName} onChange={editName} />
    </>;
}

