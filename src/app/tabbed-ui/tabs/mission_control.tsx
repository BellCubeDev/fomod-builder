import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAtom } from "@fortawesome/free-solid-svg-icons";
import FomodLoaderUI from '../../components/loaders/FomodLoaderUI';
import LocaleSelector from '../../components/localization/LocaleSelector';

const tab: Tab = {
    name: 'tab_mission_control',

    Page: MissionControl,

    icon: <FontAwesomeIcon icon={faAtom} />,
};

export default tab;

function MissionControl() {
    return <>
        <LocaleSelector />
        <FomodLoaderUI />
    </>;
}
