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

    React.useEffect(() => {
        const div = divRef.current;
        if (!div) return;

        div.style.width = '0';
        console.log('Div after 0:', window.getComputedStyle(div).width);
        div.style.width = `${div.scrollWidth}px`;
        console.log('Div after scroll width:', window.getComputedStyle(div).width);
    }, [value, divRef, editing]);

    React.useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        input.style.width = '0';
        console.log('Input after 0:', window.getComputedStyle(input).width);
        input.style.width = `${input.scrollWidth}px`;
        console.log('Input after scroll width:', window.getComputedStyle(input).width);
    }, [value, inputRef, editing]);

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
        {editing
            ? <input data-header-like-input-input type="text" value={value} className={styles.header} onChange={handleChange} onBlur={stopEditing} onKeyDown={handleKeyDown} ref={inputRef} />
            : <div data-header-like-input-div onClick={startEditing} className={styles.header} ref={divRef}>{value || noValue}</div>
        }
    </div>;

}