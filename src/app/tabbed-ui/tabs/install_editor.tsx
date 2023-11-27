import { Tab } from ".";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderTree } from "@fortawesome/free-solid-svg-icons";

const tab: Tab = {
    name: 'tab_install_editor',
    icon: <FontAwesomeIcon icon={faFolderTree} />,
    disabled: ({fomod: loader}) => !loader.loader,

    Page() {
        return <>Pardon our dust!</>;
    },

};

export default tab;
