'use client';

import { Keybind } from './components/KeybindManager';
import React from 'react';
import { useFomod } from './components/loaders/index';
import KeybindManager from './components/KeybindManager';

export default function GlobalKeybinds(props: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'>) {
    const {loader} = useFomod();

    const keybinds = React.useMemo<Keybind[]>(() => ([
        {key: 's', control: true, action: loader?.save.bind(loader)},

        {key: 'z', control: true, action: loader?.undo.bind(loader)},

        {key: 'y', control: true, action: loader?.redo.bind(loader)},
        {key: 'z', control: true, shift: true, action: () => loader?.redo()},
    ] as Keybind[]).map(k => (k.global = true) && k ), [loader]);

    console.log(keybinds);

    return <KeybindManager keybinds={keybinds} {...props} />;
}