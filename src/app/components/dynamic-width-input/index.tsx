import React from 'react';
import styles from './DynamicWidthInput.module.scss';

export default function DynamicWidthInput({ value, onChange, className, ...props }: {onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'ref'|'onChange'>) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const oldWidthStore = React.useRef(0);

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
        if (!input) return;

        input.style.width = '0';
        input.style.transitionProperty = 'none';
        window.getComputedStyle(input);

        const newWidth = input.scrollWidth;

        input.style.width = oldWidthStore.current ? `calc(${oldWidthStore.current}px + 1ch)` : '';
        input.style.padding = '';
        window.getComputedStyle(input);
        oldWidthStore.current = newWidth;

        requestAnimationFrame(() => requestAnimationFrame(() =>{
            input.style.transitionProperty = '';
            requestAnimationFrame(() => requestAnimationFrame(() =>{
                input.style.width = `calc(${newWidth}px + 1ch)`;
            }));
        }));
    }, [value, inputRef, oldWidthStore]);

    return <input type="text" {...props} value={value} className={`${className} ${styles.input}`} onInput={handleChange} onChange={handleChange} ref={inputRef} />;
}
