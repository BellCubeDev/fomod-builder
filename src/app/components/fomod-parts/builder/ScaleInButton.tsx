'use client';

import React from 'react';
import styles from './builder.module.scss';
import { useSettings } from '../../SettingsContext';

export function useScaleInX(ref: React.RefObject<HTMLElement>) {
    const settings = useSettings();

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (settings?.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        el.classList.add(styles.scaleInX!);

        const clearClass = () => {
            el.classList.remove(styles.scaleInX!);
        };

        el.addEventListener('animationend', clearClass);

        return () => {
            clearClass();
            el.removeEventListener('animationend', clearClass);
        };
    }, [ref, settings]);

}

export const ScaleInButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    function ScaleInButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>, inputRef: React.ForwardedRef<HTMLButtonElement>|null) {
        const ref = React.useRef<HTMLButtonElement>(null);
        React.useImperativeHandle(inputRef, () => ref.current!);

        useScaleInX(ref);

        return <button {...props} ref={ref} />;
    }
);
export default ScaleInButton;
