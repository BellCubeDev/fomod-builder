import {JSDOM} from 'jsdom';

export async function getInfoSchema() {
    let schema = await import('../../../../public/schemas/Info.xsd');
    return schema.default;
}

// Because a new schema was made for FO3, they used <xs:redefine> to redefine the dependencyTypesGroup
// Problem: most client-side XML parsers don't support xs:redefine
// ...and neither does monaco-xsd-code-completion
export async function getModConfigSchema() {
    const [base, extended] = await Promise.all([
        fetch('https://qconsulting.ca/gemm/ModConfig5.0.xsd').then(r => r.text()),
        fetch('https://qconsulting.ca/fo3/ModConfig5.0.xsd').then(r => r.text()),
    ]) as [string, string];

    // merge because of xs:redifine

    const baseDocWithNewGroupName = new JSDOM(base.replace('name="dependencyTypesGroup"', 'name="dependencyTypesGroup___"'), {contentType: 'text/xml'}).window.document;
    const extendedDocWithNewGroupName =new JSDOM(extended.replace('ref="dependencyTypesGroup"', 'ref="dependencyTypesGroup___"'), {contentType: 'text/xml'}).window.document;

    baseDocWithNewGroupName.documentElement.append(...extendedDocWithNewGroupName.documentElement.children);

    return baseDocWithNewGroupName.documentElement.outerHTML;
}