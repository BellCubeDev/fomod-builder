'use client';

import React from "react";
import {default as tabs, Tab, TabName} from "./tabs/index";
import styles from './Tabs.module.scss';
import { T } from "@/app/localization";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useSettings } from '../components/SettingsContext';
import { Keybind } from '../components/KeybindManager';
import KeybindManager from '../components/KeybindManager';
import { useFomod } from '../loaders/index';

type TabEntry<T extends TabName> = [T, (typeof tabs)[T]];

// TODO: Implement `alt+num`/`option+num` for tab switching

const tabsForKeybinds = Object.entries(tabs) as TabEntry<TabName>[];

export default function FomodBuilderTabbedUI({licenseInfo}: {licenseInfo: React.ReactNode}) {
    const settings = useSettings();

    const [, rerender_] = React.useState({});
    const rerender = React.useCallback(() => rerender_({}), [rerender_]);

    const [activeTab, setActiveTab] = React.useState<TabName>('tab_mission_control');
    const activeTabButtonRef = React.useRef<HTMLButtonElement|null>(null);
    const activeTabIndicatorRef = React.useRef<SVGSVGElement|null>(null);
    const activeTabPanelRef = React.useRef<HTMLDivElement|null>(null);
    const [isNearlyTransitioningIn, setIsNearlyTransitioningIn] = React.useState(false);

    const [transitioningFromTab, setTransitioningFromTab] = React.useState<TabName|null>(null);
    const transitioningFromTabRef = React.useRef<HTMLDivElement|null>(null);

    React.useEffect(() => {
        if (!activeTabButtonRef.current || !activeTabIndicatorRef.current) return;

        const activeTabButton = activeTabButtonRef.current;
        const activeTabIndicator = activeTabIndicatorRef.current;

        const activeTabButtonRect = activeTabButton.getBoundingClientRect();
        const activeTabIndicatorRect = activeTabIndicator.getBoundingClientRect();

        activeTabIndicator.style.top = `${activeTabButtonRect.top + activeTabButtonRect.height / 2 - activeTabIndicatorRect.height / 2}px`;
        activeTabIndicator.style.opacity = '1';

        if (!transitioningFromTab || !transitioningFromTabRef.current) return;

        if (settings?.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return setTransitioningFromTab(null);
        }

        const fromTab = transitioningFromTabRef.current;

        const transitionEndHandler = () => {
            setTransitioningFromTab(null);
            fromTab.removeEventListener('transitionend', transitionEndHandler);
        };

        fromTab.addEventListener('transitionend', transitionEndHandler, {once: true});

        return () => {  fromTab.removeEventListener('transitionend', transitionEndHandler);  };
    }, [activeTabButtonRef, transitioningFromTabRef, transitioningFromTab, settings?.reducedMotion]);

    const [firstRenderCountdown, setFirstRenderCountdown] = React.useState(2);

    React.useEffect(() => {
        const activeTab = activeTabPanelRef.current;
        if (!activeTab) return;

        if (firstRenderCountdown) return setFirstRenderCountdown(firstRenderCountdown - 1);

        activeTab.focus();

        setIsNearlyTransitioningIn(true);
        requestAnimationFrame(() =>  requestAnimationFrame(() =>requestAnimationFrame(() => {
            setIsNearlyTransitioningIn(false);
        })));

        // eslint-disable-next-line react-hooks/exhaustive-deps -- It's literally wrong; it doesn't update, at least on my machine, without .current
    }, [activeTabPanelRef, activeTabPanelRef.current]);

    const fomod = useFomod();

    const keybinds = React.useMemo(() => tabsForKeybinds.map<Keybind>(([tabName, tab], i) => {
        return {
            key: (i + 1).toString(),
            altOrOption: true,
            action(e) {
                if (activeTab === tabName) return;
                if (tab.disabled?.({fomod}) ?? false) return;
                e.currentTarget.blur();
                setTransitioningFromTab(activeTab); setActiveTab(tabName); setIsNearlyTransitioningIn(true);
            },
        };
    }), [activeTab, fomod]);

    const reducedMotionClassName = (settings?.reducedMotion || (typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion)').matches)) ? styles.reducedMotion : '';

    const tabButtons = Object.values(tabs).map((tab: Tab, i) => {
        const active = activeTab === tab.name;
        return <button  key={i} className={`${styles.tabButton} ${reducedMotionClassName}`}
                        disabled={tab.disabled?.({fomod}) ?? false}
                        onClick={active ? (e) => e.currentTarget.blur() : (e) => {
                            e.currentTarget.blur();
                            setTransitioningFromTab(activeTab); setActiveTab(tab.name); setIsNearlyTransitioningIn(true);
                        }}
                        ref={active ? activeTabButtonRef : undefined}
                        role='tab' aria-selected={active} aria-expanded={active} aria-controls={`panel-${tab.name}`} id={`tab-${tab.name}`}
                >
                    <span className={styles.icon}>
                        {tab.icon}
                    </span>
                    <span className={styles.label}>
                        <T tkey={tab.name} params={[active]} />
                    </span>
        </button>;
    });

    const tabPanels = Object.values(tabs).map((tab: Tab, i) => {
        const active = activeTab === tab.name;
        const transitioningFrom = transitioningFromTab === tab.name;
        return <div key={i} className={`${styles.tabPanel}`}
                    ref={transitioningFrom ? transitioningFromTabRef : active ? activeTabPanelRef : undefined}
                    role='tabpanel' aria-hidden={!active && !transitioningFrom} id={`panel-${tab.name}`} aria-labelledby={`tab-${tab.name}`}
                    style={{
                        display: active || transitioningFrom || isNearlyTransitioningIn ? 'block' : 'none',
                        marginLeft: transitioningFrom ? '-100vw' : active && !isNearlyTransitioningIn ? '0' : '100vw',
                        opacity: transitioningFrom ? '0' : active && !isNearlyTransitioningIn ? '1' : '0',
                    }}
                    tabIndex={active ? 0 : -1}
                >
            {transitioningFrom || active || tab.alwaysRendered ? <tab.Page licenseInfo={licenseInfo} rerenderTabContainer={rerender} /> : null}
        </div> ;
    });

    return <KeybindManager keybinds={keybinds} className={styles.tabbedUI}>
        <div className={styles.tabBar}>
            <div className={styles.tabBarTitle}>
                <picture>
                    <source srcSet='/logo/logo.avif' type='image/avif' />
                    <source srcSet='/logo/logo.webp' type='image/webp' />
                    <img src='/logo/logo.png' loading='eager' alt='Fomod Builder Logo' width={40} height={40} />
                </picture>

                <h1><T tkey='fomod_builder'/></h1>
            </div>

            <div className={styles.tabButtons} role='tablist'>
                {tabButtons}
            </div>

            <FontAwesomeIcon icon={faCaretRight} className={`${styles.tabIndicator} ${reducedMotionClassName}`} ref={activeTabIndicatorRef} width={16} height={16} />
        </div>

        <div className={styles.tabPanels}>
            {tabPanels}
        </div>
    </KeybindManager>;

}
