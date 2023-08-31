'use client';

import { useFomod } from '.';
import React from 'react';

export default function HistoryStateManager(props: Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'>) {
    const {loader: fomod} = useFomod();

    const divRef = React.useRef<HTMLDivElement>(null);

    const undoOnKey = React.useCallback((e: KeyboardEvent) => {
        if (!fomod) return;

        const k = e.key.toLowerCase();
        if (  !(k === 'z' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey)  ) return;

        fomod.undo();
    }, [fomod]);

    const redoOnKey = React.useCallback((e: KeyboardEvent) => {
        if (!fomod) return;

        const k = e.key.toLowerCase();
        if (  !((k === 'z' && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) || (k === 'y' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey))  ) return;

        fomod.redo();
    }, [fomod]);

    React.useEffect(() => {
        if (!divRef.current) return;
        const div = divRef.current;

        div.ownerDocument.addEventListener('keydown', undoOnKey);
        div.ownerDocument.addEventListener('keydown', redoOnKey);

        return () => {
            div.ownerDocument.removeEventListener('keydown', undoOnKey);
            div.ownerDocument.removeEventListener('keydown', redoOnKey);
        };
    }, [divRef, undoOnKey, redoOnKey]);

    return <div {...props} ref={divRef}></div>;
}

