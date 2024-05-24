'use client';

import React from 'react';
import styles from './DynamicWidthInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faHashtag, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function DynamicWidthInput({ value, onChange, className, doFancyWidth = false, onClickFilePicker, ...props }:
    {
        /** If enabled, will extend some when hovered and further when focused */
        doFancyWidth?: boolean,
        /** If provided, will show a file picker button. When this button is clicked, this event is fired.  */
        onClickFilePicker?: React.MouseEventHandler<HTMLButtonElement>,
        /** Event fired when the value changes (handles both input and change events) */
        onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown
    } & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'|'onChange'>
) {

    const [wasLastUpdateForced, forceUpdate] = React.useReducer((x) => !x, false);
    const [,eventBasedRerender] = React.useReducer((x) => !x, false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    value ??= inputRef.current?.value;

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const widthShare = useWidthSharing();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- it doesn't understand my GRAND PLAN 👿 Mwuahhahaha!
    const widthShareIndex = React.useMemo(() => widthShare?.fetchIndex() ?? 0, [widthShare?.indexMap]);

    const oldWidthStore = React.useRef(widthShare?.width ?? 0);
    const oldWidthPaddingStore = React.useRef('0px');

    const hadOffsetParentLastRenderRef = React.useRef(false);
    const [hasOffsetParent, setHasOffsetParent] = React.useState(false);

    const hasFocus = doFancyWidth && !!(inputRef.current && inputRef.current.matches(':focus, :focus-within'));
    const hasHover = doFancyWidth && !!(inputRef.current && inputRef.current.matches(':hover'));





    React.useEffect(() => {
        const el = inputRef.current;
        if (!el){
            if (wasLastUpdateForced) return;
            else return forceUpdate();
        }

        const keydownPropStopper = (e: KeyboardEvent) => {
            e.stopPropagation();
        };

        el.addEventListener('keydown', keydownPropStopper);



        const rerenderOnEvent = () => {
            eventBasedRerender();
        };

        el.addEventListener('focus', rerenderOnEvent);
        el.addEventListener('blur', rerenderOnEvent);

        el.addEventListener('mouseenter', rerenderOnEvent);
        el.addEventListener('mouseleave', rerenderOnEvent);

        return ()=> {
            el.removeEventListener('keydown', keydownPropStopper);

            el.removeEventListener('focus', rerenderOnEvent);
            el.removeEventListener('blur', rerenderOnEvent);

            el.removeEventListener('mouseenter', rerenderOnEvent);
            el.removeEventListener('mouseleave', rerenderOnEvent);
        };
    }, [inputRef, wasLastUpdateForced]);





    React.useEffect(() => {
        const input = inputRef.current;
        if (!input || (!widthShare?.width && !hasOffsetParent)) {
            hadOffsetParentLastRenderRef.current = false;
            if (wasLastUpdateForced) return;
            else return forceUpdate();
        }

        input.style.width = '0';
        input.style.transitionProperty = 'none';
        const computedStyle = window.getComputedStyle(input);

        widthShare?.submitWidth(input.scrollWidth, widthShareIndex);
        const newWidth = widthShare?.width || input.scrollWidth;

        const hadOffsetParent = hadOffsetParentLastRenderRef.current;
        hadOffsetParentLastRenderRef.current = true;

        const oldWidthPadding = oldWidthPaddingStore.current;
        const widthPadding = hasFocus ? `max(${computedStyle.getPropertyValue('--width-padding')}, 1ch)` : hasHover ? `max((calc(${computedStyle.getPropertyValue('--width-padding')} * 2/3)), 1ch)` : `1ch`;

        const newValue = `calc(${newWidth}px + ${widthPadding})`;
        const oldValue = oldWidthStore.current ? `calc(${oldWidthStore.current}px + ${oldWidthPadding})` : '';

        if (!hadOffsetParent || wasLastUpdateForced) {
            input.style.width = newValue;
            input.style.padding = '';

            requestAnimationFrame(() => requestAnimationFrame(() =>{ // have to let it realize that changes actually happened before we can animate them
                input.style.transitionProperty = '';
            }));

            oldWidthStore.current = newWidth;
            oldWidthPaddingStore.current = widthPadding;
        } else {
            input.style.width = oldValue;
            input.style.padding = '';

            window.getComputedStyle(input);
            oldWidthStore.current = newWidth;
            oldWidthPaddingStore.current = widthPadding;

            requestAnimationFrame(() => requestAnimationFrame(() =>{ // have to let it realize that changes actually happened before we can animate them
                input.style.transitionProperty = '';
                input.style.width = newValue;
                input.style.transitionProperty = '';
            }));
        }
    }, [value, inputRef, hasFocus, hasHover, oldWidthStore, oldWidthPaddingStore, hasOffsetParent, hadOffsetParentLastRenderRef, widthShare, widthShareIndex, wasLastUpdateForced]);

    const hasOffsetParentThisRender = !!inputRef.current?.offsetParent || !!inputRef.current?.parentElement?.offsetParent;
    if (hasOffsetParentThisRender !== hasOffsetParent) setHasOffsetParent(hasOffsetParentThisRender);

    const onClickFileClickerWithBlur = !onClickFilePicker ? undefined : React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.blur();
        onClickFilePicker(e);
    }, [onClickFilePicker]);

    return <div className={styles.wrapper}>
        <input type="text" {...props} value={value} className={`${className} ${styles.input}`} onInput={handleChange} onChange={handleChange} ref={inputRef} />
        {(()=>{
            if (!props.type || props.type === 'text') return <></>;

            switch (props.type) {
                case 'search': return <FontAwesomeIcon icon={faSearch} className={styles.icon} />;
                case 'number': return <FontAwesomeIcon icon={faHashtag} className={styles.icon} />;
                default: return <></>;
            }
        })()}
        {onClickFilePicker && <button type="button" className={styles.filePickerButton} onClick={onClickFileClickerWithBlur}>
            <FontAwesomeIcon icon={faFileImport} className={styles.icon} />
        </button>}
    </div>;
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
