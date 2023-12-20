import React from 'react';
import styles from './DynamicWidthInput.module.scss';

export default function DynamicWidthInput({ value, onChange, className, ...props }: {onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'|'onChange'>) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const oldWidthStore = React.useRef(0);

    const hadOffsetParentLastRenderRef = React.useRef(false);
    const [hasOffsetParent, setHasOffsetParent] = React.useState(false);

    const widthShare = useWidthSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- it doesn't understand my GRAND PLAN 👿 Mwuahhahaha!
    const widthShareIndex = React.useMemo(() => widthShare?.fetchIndex() ?? 0, [widthShare?.indexMap]);

    React.useEffect(() => {
        const el = inputRef.current;
        if (!el) return;

        const keydownPropStopper = (e: KeyboardEvent) => {
            e.stopPropagation();
        };

        el.addEventListener('keydown', keydownPropStopper);
        return ()=> { el.removeEventListener('keydown', keydownPropStopper); };
    }, [inputRef]);

    React.useEffect(() => {
        const input = inputRef.current;
        if (!input || !hasOffsetParent) {
            hadOffsetParentLastRenderRef.current = false;
            return;
        }

        input.style.width = '0';
        input.style.transitionProperty = 'none';
        window.getComputedStyle(input);

        widthShare?.submitWidth(input.scrollWidth, widthShareIndex);
        const newWidth = widthShare?.width || input.scrollWidth;

        const hadOffsetParent = hadOffsetParentLastRenderRef.current;
        hadOffsetParentLastRenderRef.current = true;

        if (!hadOffsetParent) {
            input.style.width =  `calc(${newWidth}px + 1ch)`;
            input.style.padding = '';
            input.style.transitionProperty = '';
            window.getComputedStyle(input);
            oldWidthStore.current = newWidth;
        } else {
            input.style.width = oldWidthStore.current ? `calc(${oldWidthStore.current}px + 1ch)` : '';
            input.style.padding = '';
            window.getComputedStyle(input);
            oldWidthStore.current = newWidth;
            requestAnimationFrame(() => requestAnimationFrame(() =>{
                input.style.transitionProperty = '';
                requestAnimationFrame(() => requestAnimationFrame(() =>{
                    input.style.width = `calc(${newWidth}px + 1ch)`;
                    input.style.transitionProperty = '';
                }));
            }));
        }
    }, [value, inputRef, oldWidthStore, hasOffsetParent, hadOffsetParentLastRenderRef, widthShare, widthShareIndex]);

    const hasOffsetParentThisRender = !!inputRef.current?.offsetParent || !!inputRef.current?.parentElement?.offsetParent;
    if (hasOffsetParentThisRender !== hasOffsetParent) setHasOffsetParent(hasOffsetParentThisRender);

    return <input type="text" {...props} value={value} className={`${className} ${styles.input}`} onInput={handleChange} onChange={handleChange} ref={inputRef} />;
}



const sharedWidthContext = React.createContext<{
    submitWidth: (value: number, myIndex: number)=>unknown
    width: number

    fetchIndex: ()=>number
    indexMap: Map<number, number>
} | undefined>(undefined);

export function DynamicWidthInputWidthSharer({children}: {children: React.ReactNode}) {
    const [maxWidth, setMaxWidth] = React.useState(0);

    const indexMap = React.useRef(new Map<number, number>());
    const lastUsedIndex = React.useRef(0);

    const fetchIndex = React.useCallback(() => {
        const index = lastUsedIndex.current++;
        indexMap.current.set(index, 0);
        return index;
    }, [indexMap]);

    const submitWidth = React.useCallback((width: number, myIndex: number) => {
        indexMap.current.set(myIndex, width);

        let highest = 0;
        for (const width of indexMap.current.values()) {
            if (width > highest) highest = width;
        }

        if (highest !== maxWidth) setMaxWidth(highest);
    }, [maxWidth]);

    return <sharedWidthContext.Provider value={{
        submitWidth,
        width: maxWidth,

        fetchIndex,
        indexMap: indexMap.current
    }}>
        {children}
    </sharedWidthContext.Provider>;
}

export function useWidthSharing() {
    return React.useContext(sharedWidthContext);
}
