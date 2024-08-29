import { Tab } from ".";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { T } from '../../localization/index';
import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from 'react';

// A sort of cache so we don't have to run that dreaded 1.5-second delay EVERY SINGLE TIME the tab is revealed
let licenseData: ReturnType<Awaited<typeof LicenseInfoDynamicImport>> | null = null;

const LicenseInfoDynamicImport = dynamic(() => import('../tab-pages/about-license-data').then((res=> {
    return res;
})), {
    ssr: true,

    loading(loadingProps) {
        if (loadingProps.error) return <pre><code>
            {loadingProps.error.stack}
        </code></pre>;

        if (loadingProps.timedOut) loadingProps.retry?.();

        if (loadingProps.isLoading) return <p>Loading license data...</p>;

        return <p>Loading license data...</p>;
    },
}) as React.FunctionComponent;


async function LicenseInfoDynamicImportDelayed() {
    await new Promise(resolve => setTimeout(resolve, 800));
    licenseData = <LicenseInfoDynamicImport />;
    return licenseData!;
}

function LicenseData() {
    licenseData ||= LicenseInfoDynamicImportDelayed();
    return <Suspense fallback={<p>Loading license data...</p>}>
        {licenseData}
    </Suspense>;
}


const tab: Tab = {
    name: 'tab_about',
    alwaysRendered: true,

    Page() {
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
            <LicenseData />
        </article>;
    },

    icon: <FontAwesomeIcon icon={faCircleInfo} />,
};

export default tab;
