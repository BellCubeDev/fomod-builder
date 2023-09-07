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
    fomod_builder: () => React.ReactNode;

    // Tabs
    tab_mission_control: (selected: boolean) => React.ReactNode;
    tab_install_editor: (selected: boolean) => React.ReactNode;
    tab_xml_editor: (selected: boolean) => React.ReactNode;
    tab_step_builder: (selected: boolean) => React.ReactNode;

    // Loaders
    loaders_header_unloaded: () => React.ReactNode;
    loaders_header_loaded: (type: keyof TranslationTableKeys & `loader_${string}`) => React.ReactNode;

    loader_filesystem: (inPopup: boolean) => React.ReactNode;
    loader_filesystem_description: () => React.ReactNode;
    loader_filesystem_select_folder: () => React.ReactNode;


    loader_file_input: (inPopup: boolean) => React.ReactNode;
    loader_file_input_description: () => React.ReactNode;
    loader_file_input_create_module_config: () => React.ReactNode
    loader_file_input_select_module_config: () => React.ReactNode
    loader_file_input_create_info: () => React.ReactNode
    loader_file_input_select_info: () => React.ReactNode


    loader_text_input: (inPopup: boolean) => React.ReactNode;
    loader_text_input_description: () => React.ReactNode;

    // Settings

    // Steps
    step_add_button: () => React.ReactNode;
    step_button: (name: string) => React.ReactNode;
    step_header: (name: string) => React.ReactNode;
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

    loaders_header_loaded: {
        en: ()=> 'You Have A Loaded Fomod',
    },

    loaders_header_unloaded: {
        en: ()=> 'No Fomod Is Currently Loaded',
    },

    loader_filesystem: {
        en: ()=> 'Folder Selection',
    },

    loader_filesystem_description: {
        en: ()=> <>
            Select the root folder of your project. If it&lsquo;s not already a Fomod, we&lsquo;ll create one for you.
            <br/>
            If it is already set up for a Fomod, select the folder above the <code>fomod</code> folder.
            <br />
            Note that this is a very new and shiny technique. If you run into issues, you may either need to update your browser or try a different method.
        </>,
    },

    loader_filesystem_select_folder: {
        en: ()=> 'Select Folder',
    },

    loader_file_input: {
        en: ()=> 'Manual File Selection',
    },

    loader_file_input_description: {
        en: ()=> <>Select or create ModuleConfig.xml and Info.xml in a folder named <code>fomod</code> and place that folder at the root of your archive</>
    },

    loader_file_input_create_module_config: {
        en: ()=> 'Create ModuleConfig.xml',
    },

    loader_file_input_select_module_config: {
        en: ()=> 'Select ModuleConfig.xml',
    },

    loader_file_input_create_info: {
        en: ()=> 'Create Info.xml',
    },

    loader_file_input_select_info: {
        en: ()=> 'Select Info.xml',
    },

    loader_text_input: {
        en: ()=> 'Manual Text Input',
    },

    loader_text_input_description: {
        en: ()=> <>Enter the contents of ModuleConfig.xml and Info.xml below. We&lsquo;ll use that text for your editing session.</>
    },

    step_add_button: {
        en: ()=> '+',
    },

    step_button: {
        en: (name: string) => name || <i>Unnamed Step</i>,
    },

    step_header: {
        en: (name: string) => name ? <>Step &ldquo;{name}&rdquo;</> : <>Unnamed Step</>,
    },

} as const satisfies TranslationTable;
