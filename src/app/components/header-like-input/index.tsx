import React from 'react';
import styles from './HeaderLikeInput.module.scss';

export default function HeaderLikeInput({ value, noValue, onChange, className, ...props }: {value: string, noValue: React.ReactNode, onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [editing, setEditing] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const divRef = React.useRef<HTMLDivElement>(null);

    const startEditing = React.useCallback(() => {
        setEditing(true);
    }, []);

    const stopEditing = React.useCallback(() => {
        setEditing(false);
    }, []);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const oldWidthStore = React.useRef(0);

    function updateWidth(ref: React.RefObject<HTMLElement>) {
        const el = ref.current;
        if (!el) return;

        el.style.width = '0';
        el.parentElement!.style.width = '0';
        el.style.transitionProperty = 'none';
        el.parentElement!.style.transitionProperty = 'none';
        window.getComputedStyle(el);

        const newWidth = el.scrollWidth;

        el.style.width = oldWidthStore.current ? `calc(${oldWidthStore.current}px + 1ch)` : '';
        el.parentElement!.style.width = oldWidthStore.current ? `calc(${oldWidthStore.current}px + 1ch)` : '';
        el.style.padding = '';
        el.parentElement!.style.padding = '';
        window.getComputedStyle(el);
        oldWidthStore.current = newWidth;

        requestAnimationFrame(() => requestAnimationFrame(() =>{
            el.style.transitionProperty = '';
            el.parentElement!.style.transitionProperty = '';
            requestAnimationFrame(() => requestAnimationFrame(() =>{
                el.style.width = `calc(${newWidth}px + 1ch)`;
                el.parentElement!.style.width = `calc(${newWidth}px + 1ch)`;
            }));
        }));
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

    return <div data-header-like-input-wrapper className={className} {...props}>
        <span data-editing={editing} className={styles.underlineProvider}><span>
            {editing
                ? <input data-header-like-input-input type="text" value={value} className={styles.header} onChange={handleChange} onBlur={stopEditing} onKeyDown={handleKeyDown} ref={inputRef} />
                : <div data-editing={editing} data-has-input-after data-header-like-input-div onClick={startEditing} tabIndex={0} onFocus={startEditing} className={styles.header} ref={divRef}>{value || <i style={{opacity: 0.75}}>{noValue}</i>}</div>
            }
        </span></span>
    </div>;
}
