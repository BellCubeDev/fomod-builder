import React from 'react';
import styles from './HeaderLikeInput.module.scss';

export default function HeaderLikeInput({ value, noValue, onChange, className, ...props }: {value: string, noValue: React.ReactNode, onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [editing, setEditing] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const divRef = React.useRef<HTMLDivElement>(null);

    const startEditing = React.useCallback(() => {
        if (inputRef.current?.parentElement?.hasAttribute('debug')) return;
        if (divRef.current?.parentElement?.hasAttribute('debug')) return;
        setEditing(true);
    }, []);

    const stopEditing = React.useCallback(() => {
        if (inputRef.current?.parentElement?.hasAttribute('debug')) return;
        if (divRef.current?.parentElement?.hasAttribute('debug')) return;
        setEditing(false);
    }, []);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const oldWidthStore = React.useRef([0, false] as [width: number, wasInput: boolean]);

    const hadOffsetParentLastRenderRef = React.useRef(false);
    const [hasOffsetParent, setHasOffsetParent] = React.useState(false);

    function updateWidth(ref: React.RefObject<HTMLElement>) {
        const el = ref.current;
        if (el) {
            requestAnimationFrame(() => requestAnimationFrame(() =>{
                if (oldWidthStore.current[0] !== 0) return;
                oldWidthStore.current[0] = el.scrollWidth;
                oldWidthStore.current[1] = el === inputRef.current;
            }));
        }

        if (!el || !hasOffsetParent) {
            if (!inputRef.current?.offsetParent && !divRef.current?.parentElement?.offsetParent)
                hadOffsetParentLastRenderRef.current = false;

            return;
        }

        el.style.width = '0';
        el.style.transitionProperty = 'none';
        el.setAttribute('data-is-recalcing-width', 'true');
        window.getComputedStyle(el);

        const newWidth = el.scrollWidth;
        const newWidthString = el === inputRef.current ? `calc(${newWidth}px + 1ch)` : `${newWidth}px`;

        const hadOffsetParent = hadOffsetParentLastRenderRef.current;
        hadOffsetParentLastRenderRef.current = true;

        const [oldWidth, oldWidthWasInput] = oldWidthStore.current;

        if (!hadOffsetParent) {
            el.style.width =  newWidthString;
            el.style.padding = '';
            el.style.transitionProperty = '';
            el.removeAttribute('data-is-recalcing-width');
            window.getComputedStyle(el);
            oldWidthStore.current[0] = newWidth;
            oldWidthStore.current[1] = el === inputRef.current;
        } else {
            el.style.width = oldWidth ?
                oldWidthWasInput ? `calc(${oldWidth}px + 1ch)` : `${oldWidth}px`
            : '';
            el.style.padding = '';
            window.getComputedStyle(el);
            oldWidthStore.current[0] = newWidth;
            oldWidthStore.current[1] = el === inputRef.current;
            requestAnimationFrame(() => requestAnimationFrame(() =>{
                el.style.transitionProperty = '';
                el.removeAttribute('data-is-recalcing-width');
                requestAnimationFrame(() => requestAnimationFrame(() =>{
                    el.style.width = newWidthString;
                    el.style.transitionProperty = '';
                }));
            }));
        }
    };

    React.useEffect(() => {
        updateWidth(inputRef);
    }, [value, inputRef, oldWidthStore, editing]);

    React.useEffect(() => {
        updateWidth(divRef);
    }, [value, divRef, oldWidthStore, editing]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            stopEditing();
        }
    }, [stopEditing]);

    React.useEffect(() => {
        if (editing) inputRef.current?.focus();
        else inputRef.current?.blur();
    }, [editing]);

    const hasOffsetParentThisRender = !!inputRef.current?.offsetParent || !!divRef.current?.parentElement?.offsetParent;
    if (hasOffsetParentThisRender !== hasOffsetParent) setHasOffsetParent(hasOffsetParentThisRender);

    return <div data-header-like-input-wrapper className={className} {...props}>
        <span data-editing={editing} className={styles.underlineProvider}><span>
            {editing
                ? <input data-header-like-input-input type="text" value={value} className={styles.header} onChange={handleChange} onBlur={stopEditing} onKeyDown={handleKeyDown} ref={inputRef} />
                : <div data-editing={editing} data-has-input-after data-header-like-input-div onClick={startEditing} tabIndex={0} onFocus={startEditing} className={styles.header} ref={divRef}>{value || <i style={{opacity: 0.75}}>{noValue}</i>}</div>
            }
        </span></span>
    </div>;
}
