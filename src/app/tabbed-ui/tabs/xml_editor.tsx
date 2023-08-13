import FomodMonacoEditor from "@/app/components/fomod-monaco";
import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const tab: Tab = {
    name: 'tab_xml_editor',

    Page() {
        return <>
            <FomodMonacoEditor />
        </>;
    },

    icon: <FontAwesomeIcon icon={faCode} />,
};

export default tab;
