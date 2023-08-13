import { Tab } from ".";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderTree } from "@fortawesome/free-solid-svg-icons";

const tab: Tab = {
    name: 'tab_install_editor',

    Page() {
        return <></>;
    },

    icon: <FontAwesomeIcon icon={faFolderTree} />
};

export default tab;
