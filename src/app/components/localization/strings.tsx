import {TranslationTable} from '.';
import { GroupBehaviorType, Option, FlagSetter } from 'fomod';
import { Immutable } from 'immer';





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
    tab_settings: (selected: boolean) => React.ReactNode;

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

    // Fomod Lingo
    sorting_order_ascending: () => string;
    sorting_order_descending: () => string;
    sorting_order_explicit: () => string;
    behavior_type_selectany: () => string;
    behavior_type_selectatleastone: () => string;
    behavior_type_selectatmostone: () => string;
    behavior_type_selectexactlyone: () => string;
    behavior_type_selectall: () => string;

    // Steps
    steps_no_steps: () => React.ReactNode;
    step_add_button: () => React.ReactNode;
    step_button: (name: string) => React.ReactNode;
    step_header: (name: string) => React.ReactNode;

    // Groups
    groups_no_groups: () => React.ReactNode;
    group_add_button: () => React.ReactNode;
    group_button: (name: string) => React.ReactNode;
    group_header: (name: string) => React.ReactNode;

    // Options
    options_no_options: () => React.ReactNode;
    option_add_button: () => React.ReactNode;
    option_button: (name: string) => React.ReactNode;
    option_header: (name: string) => React.ReactNode;

    option_description_placeholder: (option: Immutable<Option>) => string;
    option_image_alt: (option: Immutable<Option>) => string;
    option_image_placeholder: (option: Immutable<Option>) => string;
    flag_value_placeholder: (setter: Immutable<FlagSetter>) => string;

    // Flags
    flags_no_flags: () => React.ReactNode;
    flag_add_button: () => React.ReactNode;
    flag_button: (name: string) => React.ReactNode;
    flag_header: (name: string) => React.ReactNode;
    
    flag_name_placeholder: (setter: Immutable<FlagSetter>) => string;
    flag_sentence: (setter: Immutable<FlagSetter>, nameInput: React.ReactNode, valueInput: React.ReactNode) => React.ReactNode;

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

    tab_settings: {
        en: ()=> 'Settings',
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

    sorting_order_ascending: {
        en: ()=> 'Alphabetical: Ascending (A–Z)',
    },

    sorting_order_descending: {
        en: ()=> 'Alphabetical: Descending (Z–A)',
    },

    sorting_order_explicit: {
        en: ()=> 'Explicit (As Specified)',
    },

    behavior_type_selectany: {
        en: ()=> 'No Restriction',
    },

    behavior_type_selectatleastone: {
        en: ()=> 'Require At Least One Selection',
    },

    behavior_type_selectatmostone: {
        en: ()=> 'Require One Or Empty Selection',
    },

    behavior_type_selectexactlyone: {
        en: ()=> 'Require One Selection (Radio Buttons)',
    },

    behavior_type_selectall: {
        en: ()=> 'Forcibly Select Everything (No Choice)',
    },

    steps_no_steps: {
        en: ()=> 'No Steps',
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

    groups_no_groups: {
        en: ()=> 'No Groups',
    },

    group_add_button: {
        en: ()=> '+',
    },

    group_button: {
        en: (name: string) => name || <i>Unnamed Group</i>,
    },

    group_header: {
        en: (name: string) => name ? <>Group &ldquo;{name}&rdquo;</> : <>Unnamed Group</>,
    },

    options_no_options: {
        en: ()=> 'No Options',
    },

    option_add_button: {
        en: ()=> '+',
    },

    option_button: {
        en: (name: string) => name || <i>Unnamed Option</i>,
    },

    option_header: {
        en: (name: string) => name ? <>Option &ldquo;{name}&rdquo;</> : <>Unnamed Option</>,
    },

    option_description_placeholder: {
        en: () => `Describe your option! Let people know what's happening!`,
    },

    option_image_alt: {
        en: () => `The image you specified for this option`,
    },

    option_image_placeholder: {
        en: () => `Path to the image for this option`,
    },

    flags_no_flags: {
        en: ()=> 'No Flags to be Set',
    },

    flag_add_button: {
        en: ()=> '+',
    },

    flag_button: {
        en: (name: string) => name || <i>Unnamed Flag</i>,
    },

    flag_header: {
        en: (name: string) => name ? <>Flag &ldquo;{name}&rdquo;</> : <>Unnamed Flag</>,
    },

    flag_value_placeholder: {
        en: () => `this value`,
    },

    flag_name_placeholder: {
        en: () => `this flag`,
    },

    flag_sentence: {
        en: (setter: Immutable<FlagSetter>, nameInput: React.ReactNode, valueInput: React.ReactNode) => {
            return <>Set {nameInput} to {valueInput}</>;
        },
    },

} as const satisfies TranslationTable;
