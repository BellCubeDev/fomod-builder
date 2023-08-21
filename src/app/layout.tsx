import { Metadata } from 'next';
import { Languages, LocaleProvider } from './components/localization';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SettingsProvider } from './components/SettingsContext';
import { FomodLoaderProvider } from './components/loaders/index';
FontAwesomeConfig.autoAddCss = false;

// Exported directly in page.js as well to avoid a strange bugs or two
export const metadata: Metadata = {
    title: "Fomod Builder",
    description: "A tool for building Fomod mod installers. Fomod is a format associated with Bethesda games.",
    applicationName: "Fomod Builder",
    authors: [{
        name: "BellCube",
        url: "https://bellcube.dev",
    }],
    category: "Tool",
    colorScheme: "dark",
    classification: "Development",
    formatDetection: {
        address: false,
        date: false,
        email: false,
        telephone: false,
        url: true,
    },
    generator: 'Next.js',
    icons: undefined, // TODO: Create icon
    keywords: [
        'Fomod',
        'mod',
        'installer',
        'creator',
        'builder',
        'designer',
        'vortex',
        'mo2',
        'mod installer',
        'Fomod installer',
        'BellCube',
    ],
    manifest: undefined, // TODO: Add manifest for PWA
    metadataBase: new URL('https://fomod.bellcube.dev'),
    openGraph: {
        type: 'website',
        siteName: 'Fomod Builder',
        url: 'https://fomod.bellcube.dev',
        images: undefined, // TODO: Create icon
        determiner: 'the',
        alternateLocale: Object.keys(Languages) as (keyof typeof Languages)[],
        locale: 'en',
    }
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
            <body>
                <LocaleProvider><SettingsProvider><FomodLoaderProvider>
                    {children}
                </FomodLoaderProvider></SettingsProvider></LocaleProvider>
            </body>
    </html>;
}
