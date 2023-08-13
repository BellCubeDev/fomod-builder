import type monacoNS from 'monaco-editor';

import x from '@/external/xml.js/xmllint';

import XsdManager from '@/external/monaco-xsd-code-completion/src/XsdManager';
import XsdFeatures from '@/external/monaco-xsd-code-completion/src/XsdFeatures';

async function getInfoSchema() {
    let response = await fetch('/info.xsd');
    return await response.text();
}

// Because a new schema was made for FO3, they used <xs:redefine> to redefine the dependencyTypesGroup
// Problem: most client-side XML parsers don't support xs:redefine
// ...and neither does monaco-xsd-code-completion
async function getModConfigSchema() {
    const [base, extended] = await Promise.all([
        fetch('https://corsproxy.io/?https://qconsulting.ca/gemm/ModConfig5.0.xsd').then(r => r.text()),
        fetch('https://corsproxy.io/?https://qconsulting.ca/fo3/ModConfig5.0.xsd').then(r => r.text()),
    ]) as [string, string];

    // merge because of xs:redifine

    const domParser = new DOMParser();

    const baseDocWithNewGroupName = domParser.parseFromString(base.replace('name="dependencyTypesGroup"', 'name="dependencyTypesGroup___"'), 'text/xml');
    const extendedDocWithNewGroupName =domParser.parseFromString(extended.replace('ref="dependencyTypesGroup"', 'ref="dependencyTypesGroup___"'), 'text/xml');

    baseDocWithNewGroupName.documentElement.append(...extendedDocWithNewGroupName.documentElement.children);

    return new XMLSerializer().serializeToString(baseDocWithNewGroupName);
}

export const SchemaPromise = Promise.all([getInfoSchema(), getModConfigSchema()]);

export default function applyXmlSchemasToMonaco(monaco: typeof monacoNS, editor: monacoNS.editor.IStandaloneCodeEditor, schemas: Awaited<typeof SchemaPromise>) {
    const xsdManager = new XsdManager(editor);

    const [infoSchema, modConfig] = schemas;

    xsdManager.set({
        path: 'fomod.bellcube.dev/info.xsd',
        value: infoSchema,
        includeIfRootTag: ['fomod'],
        nonStrictPath: true,
    });

    xsdManager.set({
        path: 'qconsulting.ca/fo3/ModConfig5.0.xsd',
        value: modConfig,
        includeIfRootTag: ['config'],
        nonStrictPath: true,
    });

    console.log('MANAGER:', xsdManager);

    const xsdFeatures = new XsdFeatures(xsdManager, monaco, editor);

    xsdFeatures.addCompletion();
    xsdFeatures.addValidation();
    xsdFeatures.addGenerateAction();
    xsdFeatures.addReformatAction();
}

//export default async function getXmlCompletionProvider(monaco: typeof monacoNS, info?: boolean): Promise<monacoNS.languages.CompletionItemProvider> {
//    return {
//        provideCompletionItems(model, position, context, token) {
//            // get editor content before the pointer
//            let textUntilPosition = getTextBeforePointer();
//            // get content info - are we inside of the area where we don't want suggestions,
//            // what is the content without those areas
//            let info = getAreaInfo(textUntilPosition); // isCompletionAvailable, clearedText
//            // if we don't want any suggestions, return empty array
//            if (!info.isCompletionAvailable) {
//                return [];
//            }
//            // if we want suggestions, inside of which tag are we?
//            let lastTag = getLastOpenedTag(info.clearedText);
//            // parse the content (not cleared text) into an xml document
//            let xmlDoc = stringToXml(textUntilPosition);
//            // get opened tags to see what tag we should look for in the XSD schema
//            let openedTags;
//            // get the elements/attributes that are already mentioned in the element we're in
//            let usedItems;
//            // find the last opened tag in the schema to see what elements/attributes it can have
//            let currentItem;
//
//            // return available elements/attributes if the tag exists in the schema or an empty
//            // array if it doesn't
//
//
//            return [];
//
//        },
//    };
//}
