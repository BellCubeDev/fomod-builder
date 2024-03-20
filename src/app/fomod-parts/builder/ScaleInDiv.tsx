'use client';

import React from 'react';
import styles from './builder.module.scss';
import { useSettings } from '@/app/components/SettingsContext';

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

export const ScaleInDiv = React.forwardRef(
    function ScaleInDiv(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, inputRef: React.Ref<HTMLDivElement>) {
        const ref = React.useRef<HTMLDivElement>(null);
        React.useImperativeHandle(inputRef, () => ref.current!);

        useScaleInX(ref);

        return <div {...props} ref={ref} />;
    }
);
export default ScaleInDiv;
