'use client';

import { useFomod } from '.';
import React from 'react';

export default function HistoryStateManager(props: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'>) {
    const {loader: fomod} = useFomod();

    const divRef = React.useRef<HTMLDivElement>(null);

    const undoOnKey = React.useCallback((e: KeyboardEvent) => {
        if (!fomod) return;

        if (!(e.key === 'z' && e.ctrlKey && !e.shiftKey)) return;

        fomod.undo();
    }, [fomod]);

    const redoOnKey = React.useCallback((e: KeyboardEvent) => {
        if (!fomod) return;

        if (!(e.ctrlKey && e.shiftKey && e.key === 'z' && e.shiftKey) && !(e.ctrlKey && e.key === 'y')) return;

        fomod.redo();
    }, [fomod]);

    React.useEffect(() => {
        if (!divRef.current) return;

        const div = divRef.current;

        div.addEventListener('keydown', undoOnKey);
        div.addEventListener('keydown', redoOnKey);

        return () => {
            div.removeEventListener('keydown', undoOnKey);
            div.removeEventListener('keydown', redoOnKey);
        };
    }, [divRef, undoOnKey, redoOnKey]);

    return <div {...props} ref={divRef}></div>;
}