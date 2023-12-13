import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { T } from '../../localization/index';


const tab: Tab = {
    name: 'tab_about',
    alwaysRendered: true,

    Page({licenseInfo}) {
        return <article style={{maxWidth: '8in'}}>
            <T tkey='tab_about_basics' />
            <T tkey='tab_about_more' />
            <br />
            <div style={{display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', gap: 8}}>
                <picture style={{marginTop: 4}}>
                    <source srcSet='/bell/bell.avif' type='image/avif' />
                    <source srcSet='/bell/bell.webp' type='image/webp' />
                    <img src='/bell/bell.png' loading='eager' alt='BellCube' width={96} height={96} />
                </picture>
                <div>
                    <h2 style={{marginTop: 0}}>BellCube</h2>
                    <p>
                        <T tkey='tab_about_bellcube' />
                    </p>
                </div>
            </div>
            <br />
            <T tkey='tab_about_licensing' />
            {licenseInfo}
        </article>;
    },

    icon: <FontAwesomeIcon icon={faCircleInfo} />,
};

export default tab;
