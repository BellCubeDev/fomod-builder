'use client';

import styles from './ToggleSwitch.module.scss';
import React from 'react';
import KeybindManager from '../KeybindManager';
import { Keybind } from '../KeybindManager';

export default function ToggleSwitch({ value, onChange, disabled, className, style }: {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) {
    const [focused, setFocused] = React.useState(false);

    return <KeybindManager keybinds={React.useMemo(()=> [{
        action(e) {
            onChange(!value);
            e.preventDefault();
        },
        key: ' ',
        doNotPreventDefault: true,
    }, {
        action(e) {
            onChange(!value);
            e.preventDefault();
        },
        key: 'Enter',
        doNotPreventDefault: true,
    }] satisfies Keybind[], [onChange, value])}><label
        className={`${className ?? ''} ${styles.wrapper} ${styles.wrapper}--${value ? 'checked' : 'unchecked'}`}
        style={style}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        tabIndex={0}
    >
        <input
            type="checkbox"
            checked={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            hidden={true}
            aria-hidden={false}
        />
        <div className={`${styles.tray} ${value ? styles.checked : styles.unchecked} ${focused ? styles.focused : styles.unfocused} ${disabled ? styles.disabled : styles.enabled}`} />
        <div className={`${styles.thumb} ${value ? styles.checked : styles.unchecked} ${focused ? styles.focused : styles.unfocused} ${disabled ? styles.disabled : styles.enabled}`} />
    </label></KeybindManager> ;
}
