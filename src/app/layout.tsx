import { Metadata } from 'next';
import { Languages, LocaleProvider } from './components/localization';
import './global.scss';

import { config as FontAwesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
FontAwesomeConfig.autoAddCss = false;

import { SettingsProvider } from './components/SettingsContext';
import { FomodLoaderProvider } from './components/loaders/index';
import GlobalKeybinds from './GlobalKeybinds';

import { Rubik } from 'next/font/google';
import { SourceCodePro } from './SourceCodePro';
const rubik = Rubik({
    display: 'block',
    weight: ['400', '600', '700'],
    subsets: ['latin-ext'],
});

import Head from "next/head";

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

    generator: 'Next.js',

    referrer: 'strict-origin',
    other: {
        'opener': 'noopener',
        'darkreader-lock': 'true',
    },

};



export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
            <head>
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(
                    {
                        "@context": "http://schema.org",
                        "@type": "SoftwareApplication",
                        name: "Fomod Builder",
                        image: "https://fomod.bellcube.dev/logo/logo.webp",
                        url: "https://fomod.bellcube.dev/",
                        author: {
                            "@type": "Person",
                            name: "BellCube",
                            givenName: "Zack",
                        },
                        applicationCategory: "BrowserApplication",
                        applicationSubCategory: "WebApp",
                        dateModified: new Date().toISOString(),
                        isAccessibleForFree: true,
                        license: 'MIT',
                        maintainer: {
                            "@type": "Person",
                            name: "BellCube",
                            givenName: "Zack",
                        },
                        offers: {
                            "@type": "Offer",
                            price: 0,
                            priceCurrency: "USD",
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: 5,
                            reviewCount: 0,
                        },
                        operatingSystem: "Windows, Mac, Linux"//, Android, iOS",
                    }
                ) }} />
            </head>
            <body className={rubik.className + ' ' + SourceCodePro.variable}>
                <LocaleProvider><SettingsProvider><FomodLoaderProvider><GlobalKeybinds>
                    {children}
                </GlobalKeybinds></FomodLoaderProvider></SettingsProvider></LocaleProvider>
            </body>
    </html>;
}
