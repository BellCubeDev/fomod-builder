import React from 'react';
import styles from './HeaderLikeInput.module.scss';

export default function HeaderLikeInput({ value, noValue, onChange, className, ...props }: {value: string, noValue: React.ReactNode, onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => unknown} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [editing, setEditing] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);

    const startEditing = React.useCallback(() => {
        setEditing(true);
    }, []);

    const stopEditing = React.useCallback(() => {
        setEditing(false);
    }, []);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
    }, [onChange]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            stopEditing();
        }
    }, [stopEditing]);

    React.useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        } else {
            inputRef.current?.blur();
        }
    }, [editing]);

    return <div className={className} {...props}>
        {editing
            ? <input type="text" value={value} className={styles.header} onChange={handleChange} onBlur={stopEditing} onKeyDown={handleKeyDown} ref={inputRef} />
            : <div onClick={startEditing} className={styles.header}>{value || noValue}</div>
        }
    </div>;

}