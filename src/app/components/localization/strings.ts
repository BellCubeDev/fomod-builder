import {TranslationTable} from '.';





/** Languages supported by the Fomod Builder. Requires 100% coverage for use, sorry 🙁
 *
 * Formatted as {code: name}
 */
export enum Languages {
    en = 'English',
}







/** A list of functions that, when called, provide a translation for a given key.
 *
 * The same function parameters are required across all languages but may always be ignored. Any context that can be provided to the function should be provided.
 *
 * For instance, a function may be called with a number to be inserted into the string. Because languages have different semantics regarding numbers, this is left entirely up to the translator. Not every language is as simple as `n === 1 ? 'n thing' : 'n things'`.
 */
export interface TranslationTableKeys {
    // Title
    fomod_builder: () => string;

    // Tabs
    tab_mission_control: (selected: boolean) => string;
    tab_install_editor: (selected: boolean) => string;
    tab_xml_editor: (selected: boolean) => string;
    tab_step_builder: (selected: boolean) => string;


}





/** A list of keys that must be translated for each supported language.
 *
 * @see TranslationTableKeys
 */
export const translationTable = {


    fomod_builder: {
        en: ()=> 'Fomod Builder',
    },


    tab_mission_control: {
        en: ()=> 'Mission Control',
    },


    tab_install_editor: {
        en: ()=> 'Install Editor',
    },


    tab_xml_editor: {
        en: ()=> 'XML Editor',
    },


    tab_step_builder: {
        en: ()=> 'Step Builder',
    },


} as const satisfies TranslationTable;
