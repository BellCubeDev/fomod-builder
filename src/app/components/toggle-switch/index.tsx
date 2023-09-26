'use client';

import styles from './ToggleSwitch.module.scss';
import React from 'react';

// TOTO: Wants below
// Follow cursor
// Use css transitions
// Do a toggle switch similar to MDL's
// yeah

export default function ToggleSwitch({ value, onChange, disabled, className, style }: {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) {
    const [focused, setFocused] = React.useState(false);

    // TODO: useEffect to add and remove the classes for the values

    return <label
        className={`${className ?? ''} ${styles.wrapper} ${styles.wrapper}--${value ? 'checked' : 'unchecked'}`}
        style={style}
    >
        <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            hidden={true}
            aria-hidden={false}
        />
        <div className={`${styles.tray} ${styles.tray}--${value ? 'checked' : 'unchecked'} ${styles.tray}--${focused ? 'focused' : 'unfocused'}`} />
        <div className={`${styles.thumb} ${styles.thumb}--${value ? 'checked' : 'unchecked'} ${styles.thumb}--${focused ? 'focused' : 'unfocused'}`}
        />
    </label>;
}
