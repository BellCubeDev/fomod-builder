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

    const [oldWidth, setOldWidth] = React.useState(0);

    React.useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        div.style.width = '0';
        div.parentElement!.style.width = `0`;
        window.getComputedStyle(div);

        const newWidth = div.scrollWidth;

        div.style.width = `${oldWidth}px`;
        div.parentElement!.style.width = `${oldWidth}px`;
        window.getComputedStyle(div);

        let canceled = false;

        requestAnimationFrame(() => requestAnimationFrame(() =>{
            if (canceled) return;
            div.style.width = `${newWidth}px`;
            div.parentElement!.style.width = `${div.scrollWidth}px`;
            setOldWidth(newWidth);
        }));

        return () => {canceled = true};
    }, [value, divRef, editing, oldWidth]);

    React.useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        input.style.width = '0';
        input.parentElement!.style.width = `0`;
        window.getComputedStyle(input);

        const newWidth = input.scrollWidth - 5;

        input.style.width = `${oldWidth}px`;
        input.parentElement!.style.width = `${oldWidth}px`;
        window.getComputedStyle(input);

        let canceled = false;

        requestAnimationFrame(() => requestAnimationFrame(() =>{
            if (canceled) return;
            input.style.width = `${newWidth}px`;
            input.parentElement!.style.width = `${input.scrollWidth}px`;
            setOldWidth(newWidth);
        }));

        return () => {canceled = true};
    }, [value, inputRef, editing, oldWidth]);

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
                : <div data-editing={editing} data-has-input-after data-header-like-input-div onClick={startEditing} className={styles.header} ref={divRef}>{value || <i style={{opacity: 0.75}}>{noValue}</i>}</div>
            }
        </span></span>
    </div>;
}
