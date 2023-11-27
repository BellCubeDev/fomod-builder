import React from 'react';

export interface Keybind {
    /** Case-insensitive key to check against */
    key: string;
    control?: boolean;
    shift?: boolean;
    altOrOption?: boolean;
    windowsOrCommand?: boolean;
    action: (e: KeyboardEvent & { currentTarget: HTMLSpanElement}) => unknown;
    doNotPreventDefault?: boolean;
    doNotBreak?: boolean;

    /** WARNING!
     *
     * React calls `useEffect` cleanups when a component unmounts. If this KeybindManager is unmounted for any reason, the global keybinds will be removed.
    */
    global?: boolean;
}

//function stringifyKeybind(keybind: Keybind) {
//    return `${keybind.control ? 'Ctrl + ' : ''}${keybind.shift ? 'Shift + ' : ''}${keybind.alt ? 'Alt + ' : ''}${keybind.meta ? 'Option + ' : ''}${keybind.key}`;
//}
//
//function stringifyKeybindFromEvent(e: KeyboardEvent) {
//    return `${e.ctrlKey ? 'Ctrl + ' : ''}${e.shiftKey ? 'Shift + ' : ''}${e.altKey ? 'Alt + ' : ''}${e.metaKey ? 'Option + ' : ''}${e.key}`;
//}

export default function KeybindManager({keybinds, ...props}: {keybinds: Keybind[]} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, 'ref'>) {
    const spanRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        keybinds.forEach(k => k.key = k.key.toLowerCase());
    }, [keybinds]);

    const globalKeybinds = React.useMemo(() => keybinds.filter(keybind => keybind.global), [keybinds]);
    const localKeybinds = React.useMemo(() => keybinds.filter(keybind => !keybind.global), [keybinds]);

    const handleKeybind = React.useCallback((providedKeybinds: Keybind[], e: KeyboardEvent) => {
        const span = spanRef.current;
        if (!span) return;

        for (const keybind of providedKeybinds) {
            //console.log(`Evaluating keybind ${stringifyKeybind(keybind)} against ${stringifyKeybindFromEvent(e)}`);
            if (keybind.key !== e.key.toLowerCase() || !!keybind.control !== e.ctrlKey || !!keybind.shift !== e.shiftKey || !!keybind.altOrOption !== e.altKey || !!keybind.windowsOrCommand !== e.metaKey)
                continue;

            //console.log(`Executing keybind ${stringifyKeybind(keybind)}`);

            if (e.currentTarget !== (keybind.global ? span.ownerDocument : span)) throw new Error(`KeybindManager: Keybinds should only be attached to the KeybindManager's root span or, for global commands, the document.`);


            keybind.action(e as KeyboardEvent & { currentTarget: HTMLSpanElement});
            if (!keybind.doNotPreventDefault) e.preventDefault();
            if (!keybind.doNotBreak) e.stopPropagation();
        }
    }, [spanRef]);

    const handleGlobalKeybinds = React.useCallback((e: KeyboardEvent) => handleKeybind(globalKeybinds, e), [globalKeybinds, handleKeybind]);
    const handleLocalKeybinds = React.useCallback((e: KeyboardEvent) => handleKeybind(localKeybinds, e), [localKeybinds, handleKeybind]);

    React.useEffect(() => {
        const span = spanRef.current;
        if (!span) return;

        span.addEventListener('keydown', handleLocalKeybinds);
        span.ownerDocument.addEventListener('keydown', handleGlobalKeybinds);

        return () => {
            span.removeEventListener('keydown', handleLocalKeybinds);
            span.ownerDocument.removeEventListener('keydown', handleGlobalKeybinds);
        };
    }, [spanRef, handleGlobalKeybinds, handleLocalKeybinds]);

    return <span {...props} ref={spanRef} />;
}
