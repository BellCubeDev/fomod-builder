import { Tab } from ".";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderTree } from "@fortawesome/free-solid-svg-icons";
import InstallList from "@/app/install-list";

const tab: Tab = {
    name: 'tab_install_editor',
    icon: <FontAwesomeIcon icon={faFolderTree} />,
    disabled: ({fomod: loader}) => !loader.loader,

    Page() {
        return <>
        Pardon our dust!

            <InstallList />

        </>;
    },

};

export default tab;
