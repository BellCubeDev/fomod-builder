'use client';

import Select, { GroupBase } from 'react-select';
import styles from './Dropdown.module.scss';
import React from 'react';
import { useTranslate } from '../localization/index';

type ParamsBase = Parameters<typeof Select>[0];

export interface DropdownOption<T extends string> {
    value: T;
    label: string;
}
export default function Dropdown<T extends string>({options, value, onChange, className, ...props}: Omit<ParamsBase, 'className'|'value'|'options'|'onChange'|'classNames'|'unstyled'> & {className?: string, value: T, options: readonly DropdownOption<T>[], onChange: (value: T|null) => unknown}) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const keydownPropStopper = (e: KeyboardEvent) => {
            e.stopPropagation();
        };

        el.addEventListener('keydown', keydownPropStopper);
        return ()=> { el.removeEventListener('keydown', keydownPropStopper); };
    }, [ref]);

    return <div ref={ref} className={styles.keydownPropStopper}><Select
        {...props}
        className={[styles.dropdown, className].join(' ')}
        options={options}
        value={options.find(option => option.value === value)}
        onChange={option => onChange((option as DropdownOption<T>|null)?.value ?? null)}
        isSearchable={true}
        closeMenuOnSelect={true}
        captureMenuScroll={true}
        blurInputOnSelect={true}
        // eslint-disable-next-line react-hooks/rules-of-hooks
        noOptionsMessage={()=>useTranslate('dropdown_no_options')}  loadingMessage={()=>useTranslate('dropdown_loading')}
        classNames={{
            container(props) { return styles.container!; },
            control(props) { return styles.control!; },
            dropdownIndicator(props) { return styles.dropdownIndicator!; },
            group(props) { return styles.group!; },
            groupHeading(props) { return styles.groupHeading!; },
            indicatorsContainer(props) { return styles.indicatorsContainer!; },
            indicatorSeparator(props) { return styles.indicatorSeparator!; },
            input(props) { return styles.input!; },
            menu(props) { return styles.menu!; },
            menuList(props) { return styles.menuList!; },
            menuPortal(props) { return styles.menuPortal!; },
            option(props) {
                const classes = [styles.option];
                if (props.isFocused) classes.push(styles['option--focused']);
                if (props.isSelected) classes.push(styles['option--selected']);
                if (props.isDisabled) classes.push(styles['option--disabled']);
                return classes.join(' ');
            },
            placeholder(props) { return styles.placeholder!; },
            singleValue(props) { return styles.singleValue!; },
            valueContainer(props) { return styles.valueContainer!; },
        }}
        unstyled={true}
    /></div>;
}
