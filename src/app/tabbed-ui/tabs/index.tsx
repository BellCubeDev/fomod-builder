import {TranslationTableKeys} from '@/app/components/localization';
import { FomodLoaderContext } from '../../components/loaders/index';

export interface TabDisabledContext {
    fomod: FomodLoaderContext
}

export interface Tab {
    name: Extract<keyof TranslationTableKeys, TabName>;
    Page: React.FunctionComponent;
    icon: JSX.Element,
    disabled?: (context: TabDisabledContext) => boolean;
}

import tab_mission_control from './mission_control';
import tab_install_editor from './install_editor';
import tab_step_builder from './builder';
import tab_xml_editor from './xml_editor';
import tab_settings from './settings';

const tabs = {
    tab_mission_control,
    tab_step_builder,
    tab_install_editor,
    tab_xml_editor,
    tab_settings,
};

export default tabs;

export type Tabs = typeof tabs;
export type TabName = keyof Tabs;
