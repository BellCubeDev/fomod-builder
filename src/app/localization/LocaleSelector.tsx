'use client';

import { Languages, useLocale } from ".";
import React from "react";
import Dropdown from '@/app/components/dropdown/index';

const languageEntries = Object.entries(Languages) as [keyof typeof Languages, Languages][];

export default function LocaleSelector() {
    const loc = useLocale();

    return <label hidden={languageEntries.length <= 1} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1em' }}>
        <span style={{ fontSize: '1.1em' }}>Locale</span>
        <span style={{ fontSize: '1.1em' }}> 🌐</span>
        <Dropdown
            options={languageEntries.map((i)=> ({label: i[1], value: i[0]}))}
            value={loc.locale || 'en'}
            onChange={(value) => value && loc.setLocale(value)}
        />
    </label>;
}
