import React from 'react';

export interface Keybind {
    /** Case-insensitive key to check against */
    key: string;
    control?: boolean;
    shift?: boolean;
    altOrOption?: boolean;
    windowsOrCommand?: boolean;
    action: (e: KeyboardEvent) => unknown;
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

export default function KeybindManager({keybinds, ...props}: {keybinds: Keybind[]} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'ref'>) {
    const divRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        keybinds.forEach(k => k.key = k.key.toLowerCase());
    }, [keybinds]);

    const globalKeybinds = React.useMemo(() => keybinds.filter(keybind => keybind.global), [keybinds]);
    const localKeybinds = React.useMemo(() => keybinds.filter(keybind => !keybind.global), [keybinds]);

    const handleKeybind = React.useCallback((providedKeybinds: Keybind[], e: KeyboardEvent) => {
        for (const keybind of providedKeybinds) {
            //console.log(`Evaluating keybind ${stringifyKeybind(keybind)} against ${stringifyKeybindFromEvent(e)}`);
            if (keybind.key !== e.key.toLowerCase() || !!keybind.control !== e.ctrlKey || !!keybind.shift !== e.shiftKey || !!keybind.altOrOption !== e.altKey || !!keybind.windowsOrCommand !== e.metaKey)
                continue;

            //console.log(`Executing keybind ${stringifyKeybind(keybind)}`);

            keybind.action(e);
            if (!keybind.doNotPreventDefault) e.preventDefault();
            if (!keybind.doNotBreak) e.stopPropagation();
        }
    }, []);

    const handleGlobalKeybinds = React.useCallback((e: KeyboardEvent) => handleKeybind(globalKeybinds, e), [globalKeybinds, handleKeybind]);
    const handleLocalKeybinds = React.useCallback((e: KeyboardEvent) => handleKeybind(localKeybinds, e), [localKeybinds, handleKeybind]);

    React.useEffect(() => {
        if (!divRef.current) return;
        const div = divRef.current;

        div.addEventListener('keydown', handleLocalKeybinds);
        div.ownerDocument.addEventListener('keydown', handleGlobalKeybinds);

        return () => {
            div.removeEventListener('keydown', handleLocalKeybinds);
            div.ownerDocument.removeEventListener('keydown', handleGlobalKeybinds);
        };
    }, [handleGlobalKeybinds, handleLocalKeybinds]);

    return <div {...props} ref={divRef} />;
}