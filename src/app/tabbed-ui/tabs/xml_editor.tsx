import FomodMonacoEditor from "@/app/fomod-monaco";
import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { getDarkModernTheme } from "@/app/fomod-monaco/server/DarkModernTheme";

const tab: Tab = {
    name: 'tab_xml_editor',
    icon: <FontAwesomeIcon icon={faCode} />,
    disabled: ({fomod: loader}) => !loader.loader,
    alwaysRendered: true, // TODO: Render until the editor is ready so we can lazy-load the editor; use an event prop

    Page({rerenderTabContainer}) {
        return <>
            <FomodMonacoEditor onEditorLoaded={()=>{
                const oldAlwaysRendered = tab.alwaysRendered;
                tab.alwaysRendered = false;
                rerenderTabContainer();
            }} />
        </>;
    },

};

export default tab;
