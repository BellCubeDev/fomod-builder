import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import FomodLoaderUI from '../../loaders/FomodLoaderUI';
import LocaleSelector from '../../localization/LocaleSelector';
import { T } from '../../localization/index';

const tab: Tab = {
    name: 'tab_mission_control',
    alwaysRendered: true,
    icon: <FontAwesomeIcon icon={faAtom} />,
    Page: MissionControl,
};

export default tab;

function MissionControl() {
    return <>
        <LocaleSelector />
        <h1><T tkey='tab_mission_control_title' /></h1>
        <T tkey='tab_mission_control_text' />
        <br />
        <FomodLoaderUI />
    </>;
}
