'use client';

import FomodMonacoEditor from "@/app/components/fomod-monaco";
import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import ToggleSwitch from '../../components/toggle-switch/index';
import { useSettings } from '../../components/SettingsContext';

const tab: Tab = {
    name: 'tab_settings',

    Page() {
        const s = useSettings();
        if (!s) return null;

        return <>
            Pardon our dust!

            <ToggleSwitch value={s.reducedMotion} onChange={(v) => {s.update('reducedMotion', v);}} />
        </>;
    },

    icon: <FontAwesomeIcon icon={faGear} />,
};

export default tab;
