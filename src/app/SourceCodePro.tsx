import {Source_Code_Pro} from 'next/font/google';
export const SourceCodePro = Source_Code_Pro({
    weight: '400',
    display: 'swap',
    preload: false,
    subsets: ['cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese'],
    variable: '--code-font',
});
