import type monacoNS from 'monaco-editor';
import XsdManager from 'monaco-xsd-code-completion/src/XsdManager';
import XsdFeatures from 'monaco-xsd-code-completion/src/XsdFeatures';

export function applyXmlSchemasToMonaco(monaco: typeof monacoNS, editor: monacoNS.editor.IStandaloneCodeEditor, schemas: [info: string, modConfig: string]) {
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

    console.log('XSD Manager:', xsdManager);

    const xsdFeatures = new XsdFeatures(xsdManager, monaco, editor);

    xsdFeatures.addCompletion();
    xsdFeatures.addValidation();
    xsdFeatures.addGenerateAction();
    xsdFeatures.addReformatAction();
}
