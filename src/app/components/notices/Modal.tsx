'use client';

import React from 'react';
import { useSettings } from '../SettingsContext';

import styles from './Modal.module.scss';

export default function Modal({open, ...props}: Omit<{open: boolean} & React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>, 'ref'>) {
    const dialogRef = React.useRef<HTMLDialogElement>(null);
    const settings = useSettings();

    const prefersReducedMotionRef = React.useRef(false);
    prefersReducedMotionRef.current = settings?.reducedMotion || (typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    React.useEffect(() => {
        if (!dialogRef.current) return;

        const dialog = dialogRef.current;

        if (open) dialog.showModal();
        else {
            if (!dialog.open) return;

            if (prefersReducedMotionRef.current) return dialog.close();

            dialog.classList.add(styles.closing!);

            const closeF = () => dialog.close();

            dialog.addEventListener('transitionend', closeF, {once: true});
            return () => dialog.removeEventListener('transitionend', closeF);
        }
    }, [dialogRef, open, prefersReducedMotionRef]);

    return <dialog {...props} ref={dialogRef}></dialog>;
}
