'use client';

import { useSelect } from "downshift";
import { Languages, useLocale } from ".";
import React from "react";

const languageEntries = Object.entries(Languages) as [keyof typeof Languages, Languages][];

export default function LocaleSelector() {
    const loc = useLocale();

    const menuReference = React.useRef<HTMLUListElement>(null);

    const closeMenuF = React.useCallback(async () => {
        if (!menuReference.current) return;
        menuReference.current.setAttribute('data-closing', '');

        await new Promise<void|{}>((resolve) => {
            // resolve instantly if prefers-reduced-motion is set
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) resolve();
            else addEventListener('transitionend', resolve, { once: true });
        });

    }, [menuReference]);

    const menu = useSelect({
        items: languageEntries,
        itemToString(item) {
            return item ? item[1] : '';
        },
        onStateChange(changes) {
            if (!changes.selectedItem) return;
            loc.setLocale(changes.selectedItem[0]);
        },
    });

    return <div hidden={languageEntries.length < 2}>
        <button {...menu.getToggleButtonProps()}>{loc.locale ? Languages[loc.locale] : 'Loading...'} 🌐</button>
        <ul {...menu.getMenuProps({ref: menuReference})}>
            {!menu.isOpen ? null :
            languageEntries.map(
                // eslint-disable-next-line react/jsx-key
                (item, i) => <li {...menu.getItemProps({item})} key={i}>
                    <button type='button'>{item[1]}</button>
                </li>)}
        </ul>
    </div>;
}