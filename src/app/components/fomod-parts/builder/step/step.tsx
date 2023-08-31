'use client';

import { Immutable } from 'immer';
import { Step } from 'fomod';

export default function BuilderStep({step}: {step: Immutable<Step>}) {
    return <>
        <h2>{step.name}</h2>
    </>;
}

