type TranslationTableKeys = import('./src/app/components/localization/strings').TranslationTableKeys;
type Draft<T> = import('immer').Draft<T>;
type Immutable<T> = import('immer').Immutable<T>;

type ValidTypeString = keyof {[TKey in keyof TranslationTableKeys as TKey extends `${infer T}_add_button` ? `${T}s_no_${T}s` extends keyof TranslationTableKeys ? `${T}_button` extends keyof TranslationTableKeys ? T : never : never : never]: any};
type KeyForType<TObject extends Record<any, any>, TTargetType extends any> = keyof TObject & keyof {[TKey in keyof TObject as TObject[TKey] extends TTargetType ? TKey : never]: never};

type TrueImmutable<T> = Immutable<{a: T}>['a'];
type TrueDraft<T> = Draft<{a: T}>['a'];
