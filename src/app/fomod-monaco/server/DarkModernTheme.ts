import 'server-only';
import type {editor} from 'monaco-editor';

async function getReleaseVersion() {
    // get redirect URL

    const releaseData = await fetch('https://api.github.com/repos/microsoft/vscode/releases/latest').then(res => res.json()).catch(() => {});
    if (process.env.mock_releases_latest_tag_name) Object.assign(releaseData, {tag_name: process.env.mock_releases_latest_tag_name});
    //console.log('releaseData', releaseData);
    if (!('tag_name' in releaseData) )
        throw new Error('Failed to get latest VS Code release from GitHub');

    const tagData = await fetch (`https://api.github.com/repos/microsoft/vscode/git/ref/tags/${encodeURI(releaseData.tag_name)}`).then(res => res.json()).catch(() => {});
    if (process.env.mock_git_ref_tags_sha) Object.assign(tagData, {object: {sha: process.env.mock_git_ref_tags_sha}});
    //console.log('tagData', tagData);
    if (!tagData || !('object' in tagData) || typeof tagData.object !== 'object' || !('sha' in tagData.object) )
        throw new Error('Failed to get release version');

    return tagData.object.sha;
}

interface TokenColorDef {
    name: string,
    scope: string|string[],
    settings: {
        foreground?: string,
        fontStyle?: string,
        background?: string,
    },
}

function parseTokenColors(tokenColors?: TokenColorDef[]): editor.ITokenThemeRule[] {
    const tokens: editor.ITokenThemeRule[] = [];

    for (const tokenColor of (tokenColors || [])) {
        if (!tokenColor.scope) continue;

        const scopes = Array.isArray(tokenColor.scope) ? tokenColor.scope : [tokenColor.scope];

        for (const scope of scopes) {
            tokens.push({
                token: scope,
                foreground: tokenColor.settings.foreground,
                fontStyle: tokenColor.settings.fontStyle,
                background: tokenColor.settings.background,
            });
        }
    }

    return tokens;
}

/** Merge two objects. Like `Object.assign()` but it's recursive.
 *
 * Non-object keys in obg2 will overwrite those in obj1.
 */
function mergeObjects(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
    const obj: Record<string, any> = {};

    for (const key in obj1) {
        obj[key] = obj1[key];
    }

    for (const key in obj2) {
        if (key in obj && typeof obj[key] === 'object' && typeof obj2[key] === 'object')
            if (Array.isArray(obj[key]) && Array.isArray(obj2[key]))
                obj[key] = [...obj[key], ...obj2[key]];
            else
                obj[key] = mergeObjects(obj[key], obj2[key]);
        else
            obj[key] = obj2[key];
    }

    return obj;
}

interface RawTheme {
    $schema: "vscode://schemas/color-theme"
    colors: editor.IStandaloneThemeData['colors'],
    name: string,
    semanticHighlighting?: boolean,
    semanticTokenColors?: Record<string, `#${string}`>,
    tokenColors?: TokenColorDef[],
}

export async function getDarkModernTheme() {
    const release = await getReleaseVersion();

    const [dark, darkPlusRaw, darkModernRaw] = await Promise.all<Promise<RawTheme>>([
        fetch(`https://main.vscode-cdn.net/stable/${release}/extensions/theme-defaults/themes/dark_vs.json`),
        fetch(`https://main.vscode-cdn.net/stable/${release}/extensions/theme-defaults/themes/dark_plus.json`),
        fetch(`https://main.vscode-cdn.net/stable/${release}/extensions/theme-defaults/themes/dark_modern.json`),
    ].map(async p => p.then(res => res.text()).then(text => {
        try {
            return JSON.parse(text) as RawTheme;
        } catch (err) {
            console.error('Failed to parse theme', {err, text, release});
            throw err;
        }
    }
    ))) as [RawTheme, RawTheme, RawTheme];

    const darkModern = mergeObjects(mergeObjects(dark, darkPlusRaw), darkModernRaw) as RawTheme;

    const returnVal =  Object.assign(
        darkModern, {
            base: 'vs-dark',
            inherit: true,
            rules: parseTokenColors(darkModern.tokenColors),
        } satisfies Omit<editor.IStandaloneThemeData, keyof RawTheme>
    );

    return returnVal;
}
