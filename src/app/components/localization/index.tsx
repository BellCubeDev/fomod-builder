'use client';

import styles from './localizationFadeIn.module.scss';

import React, { useEffect } from "react";

import {TranslationTableKeys, Languages, translationTable} from './strings';
export * from './strings';

/** Denotes the current locale code and provides a function to change it */
interface LocalizationContext {
    locale: keyof typeof Languages;
    setLocale: (locale: keyof typeof Languages) => void;
}

export const localization = React.createContext<LocalizationContext>({
    locale: 'en',
    setLocale: () => {throw new Error('Cannot call setLocale on default localization context!');},
});

/** Provides the current locale code and a function to change it */
export function useLocale() {
    return React.useContext(localization);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocale] = React.useState<keyof typeof Languages | null>(null);

    useEffect(() => {
        const storedLocale = localStorage.getItem('locale');

        if (storedLocale && storedLocale in Languages)  setLocale(storedLocale as keyof typeof Languages);
        else setLocale('en');
    }, []);

    useEffect(() => {
        if (locale) localStorage.setItem('locale', locale);
    }, [locale]);

    return <localization.Provider value={{ locale: locale || 'en', setLocale }}>
        {children}
    </localization.Provider>;
}


type ParamOptionForKey<T extends keyof TranslationTableKeys> = Parameters<TranslationTableKeys[T]> extends [somethingRequired: any] ? {
    /** Parameters passed to the translation function */
    params: Parameters<TranslationTableKeys[T]>
} : Parameters<TranslationTableKeys[T]> extends [somethingOptional?: any] ? {
    /** Parameters passed to the translation function */
    params?: Parameters<TranslationTableKeys[T]>
} : {
    /** Parameters passed to the translation function */
    params?: Parameters<TranslationTableKeys[T]>
};

/** Provides a translation for the specified key. Requires both the key and the function parameters.
 *
 * Due to a limitation of Typescript, keys must be specified in the `tkey` property. Otherwise, I'd have them set as the children of the component.
 */
export function T<TKey extends keyof TranslationTableKeys>({ tkey, params }: {
    /** The translation key to use */
    tkey: TKey
} & ParamOptionForKey<TKey>) {
    const { locale } = useLocale();

    // @ts-expect-error: There's no reason it shouldn't work (and, in fact, the error only comes up sometimes when the compiler is run).
    //                   What I know is that it works in practice. TypeScript just hates me.
    return <span className={`${styles.translated}`}>{translationTable[tkey][locale](...params ?? [])}</span>;
}
/** Provides a translation for the specified key. Requires the key as the first parameter and the translation function's parameters as the rest.
 *
 * Hook version of <T />.
 */
export function useTranslate<T extends keyof TranslationTableKeys>(key: T, ...params: Parameters<TranslationTableKeys[T]>) {
    const { locale } = useLocale();

    // @ts-expect-error: There's no reason it shouldn't work (and, in fact, the error only comes up sometimes when the compiler is run).
    //                   What I know is that it works in practice. TypeScript just hates me.
    return locale ? translationTable[key][locale](...params ?? []) : '';
}





export type TranslationTable = {[T in keyof TranslationTableKeys]: Record<keyof typeof Languages, TranslationTableKeys[T]>};

