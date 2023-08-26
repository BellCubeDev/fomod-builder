import { Metadata } from 'next';
import { Languages, LocaleProvider } from './components/localization';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { SettingsProvider } from './components/SettingsContext';
import { FomodLoaderProvider } from './components/loaders/index';
import HistoryStateManager from './components/loaders/HistoryManager';
FontAwesomeConfig.autoAddCss = false;

import { Rubik } from 'next/font/google';
import { SourceCodePro } from './SourceCodePro';
const rubik = Rubik({
    display: 'block',
    weight: ['400', '600', '700'],
    subsets: ['latin-ext'],
});

// Exported directly in page.js as well to avoid a strange bugs or two
export const metadata: Metadata = {
    title: "Fomod Builder",
    description: "Build Fomod installers with ease, no download necessary!\n\nFomod is an XML-based installer format typically used for Bethesda game mods. This XML format is a little burdensome and a lot XML, so this tool exists to make it *not* that.",
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
    },
    twitter: {
        card: 'summary',
    },
    themeColor: '#0074a9',
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
            <body className={rubik.className + ' ' + SourceCodePro.variable}>
                <LocaleProvider><SettingsProvider><FomodLoaderProvider><HistoryStateManager>
                    {children}
                </HistoryStateManager></FomodLoaderProvider></SettingsProvider></LocaleProvider>
            </body>
    </html>;
}
