import {TranslationTableKeys} from '@/app/localization';
import { FomodLoaderContext } from '@/app/loaders/index';
import type licenseChecker from 'license-checker-rseidelsohn';

export interface TabDisabledContext {
    fomod: FomodLoaderContext
}

export interface Tab {
    name: Extract<keyof TranslationTableKeys, TabName>;
    Page: React.FunctionComponent<{licenseInfo: React.ReactNode, rerenderTabContainer: () => unknown}>;
    icon: JSX.Element,
    disabled?: (context: TabDisabledContext) => boolean;

    /** If true, this tab will always be present in the HTML of the page. Useful for SEO purposes. */
    alwaysRendered?: boolean;
}

import tab_mission_control from './mission_control';
import tab_metadata from './metadata';
import tab_step_builder from './builder';
import tab_install_editor from './install_editor';
import tab_xml_editor from './xml_editor';

import tab_about from './about';
import tab_settings from './settings';

const tabs = {
    tab_mission_control,
    tab_metadata,
    tab_step_builder,
    tab_install_editor,
    tab_xml_editor,


    tab_about,
    tab_settings,
};

export default tabs;

export type Tabs = typeof tabs;
export type TabName = keyof Tabs;
