import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { SettingsPage } from '../tab-pages/settings';

const tab: Tab = {
    name: 'tab_settings',
    alwaysRendered: true,
    icon: <FontAwesomeIcon icon={faGear} />,
    Page: SettingsPage,
};

export default tab;
