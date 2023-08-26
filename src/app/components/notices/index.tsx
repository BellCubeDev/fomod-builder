'use client';

import React from 'react';

import styles from './Notice.module.scss';

export interface NoticeContext {
    addNotice: (notice: Notice) => unknown;
    removeNotice: (notice: Notice) => unknown;
    clear: () => unknown;
}

function cannotCallOnDefaultContext() {
    throw new Error('Cannot call load on the default context; add a NoticeProvider to the tree first!');
}

const context = React.createContext<NoticeContext>({
    addNotice: cannotCallOnDefaultContext,
    removeNotice: cannotCallOnDefaultContext,
    clear: cannotCallOnDefaultContext,
});

export function useNotice() {
    return React.useContext(context);
}

export type NoticeType = 'info' | 'warning' | 'error';
export type Notice = CliclableNotice | ForcedNotice;

export interface CliclableNotice {
    notification: React.FunctionComponent;
    detail?: React.FunctionComponent;
    type: NoticeType;
}

export interface ForcedNotice {
    detail: React.FunctionComponent;
    type: NoticeType;
}

export default function NoticeProvider(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    const [notices] = React.useState<Set<Notice>>(new Set());

    const addNotice = React.useCallback((notif: Notice) => {
        notices.add(notif);
    }, [notices]);

    const removeNotice = React.useCallback((notif: Notice) => {
        notices.delete(notif);
    }, [notices]);

    const clear = React.useCallback(() => {
        notices.clear();
    }, [notices]);

    const [popupQueue] = React.useState<Required<Notice>[]>([]);
    const [CurrentPopup, setCurrentPopup] = React.useState<React.FunctionComponent | null>(null);

    React.useEffect(() => {
        if (popupQueue.length === 0) return;

        const nextPopup = popupQueue.shift()!;
        setCurrentPopup(nextPopup.detail);
    }, [popupQueue]);


    return <context.Provider value={{ addNotice, removeNotice, clear, }}>
        <div className={styles.noticeWrapper}>
            <div className={styles.overlay}>
                {CurrentPopup && <CurrentPopup />}
            </div>

            <div className={styles.notices}>
                {[...notices].map((notice, i) => 'notification' in notice ? <notice.notification key={i} /> : undefined)}
            </div>

            <div {...props} />
        </div>
    </context.Provider>;
}
