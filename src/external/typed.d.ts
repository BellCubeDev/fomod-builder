interface ValidateXMLOptions {
    /** While the API docs don't say it, the value is coerced into an array if it isn't one already. Therefore, we can assume an array is accepted. */
    xml: string|string[];
    /** Schema(s) to validate against */
    schema: string|string[];
    /** Not quite sure what this does. Oh well 🤷‍♂️ */
    format?: 'rng'
}

declare module '@/external/xml.js/xmllint' {
    /** Validates the provided XML against the provided XSD schema */
    export function validateXML(options: ValidateXMLOptions): {
        errors: string[]|null;
    };
}