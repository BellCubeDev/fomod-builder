import { Tab } from ".";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature } from "@fortawesome/free-solid-svg-icons";
import { MetadataPage } from '../tab-pages/metadata';

const tab: Tab = {
    name: 'tab_metadata',

    Page: MetadataPage,

    disabled: ({fomod: loader}) => !loader.loader,

    icon: <FontAwesomeIcon icon={faSignature} />
};

export default tab;
