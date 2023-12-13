import {TranslationTable} from '.';
import { GroupBehaviorType, Option, FlagSetter, FomodInfo, Fomod } from 'fomod';
import { Immutable } from 'immer';
import tab from '@/app/tabbed-ui/tabs/about';
import { Settings } from '@/app/components/SettingsContext';





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
    tab_mission_control_title: () => React.ReactNode;
    tab_mission_control_text: () => React.ReactNode;

    tab_install_editor: (selected: boolean) => React.ReactNode;
    tab_xml_editor: (selected: boolean) => React.ReactNode;
    tab_step_builder: (selected: boolean) => React.ReactNode;

    tab_documentation: (selected: boolean) => React.ReactNode;

    // About Tab
    tab_about: (selected: boolean) => React.ReactNode;
    tab_about_basics: () => React.ReactNode;
    tab_about_more: () => React.ReactNode;
    tab_about_created_by: () => React.ReactNode;
    tab_about_bellcube: () => React.ReactNode;
    tab_about_licensing: () => React.ReactNode;

    // UI Stuff
    dropdown_no_options: () => React.ReactNode;
    dropdown_loading: () => React.ReactNode;

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
    tab_settings: (selected: boolean) => React.ReactNode;
    tab_settings_header: () => React.ReactNode;
    tab_settings_note: () => React.ReactNode;
    setting_defaultOptionType: (value: Settings['defaultOptionType']) => React.ReactNode;
    setting_defaultGroupBehavior: (value: Settings['defaultGroupBehavior']) => React.ReactNode;
    setting_defaultOptionSortingOrder: (value: Settings['defaultOptionSortingOrder']) => React.ReactNode;
    setting_defaultGroupSortingOrder: (value: Settings['defaultGroupSortingOrder']) => React.ReactNode;
    setting_defaultStepSortingOrder: (value: Settings['defaultStepSortingOrder']) => React.ReactNode;
    setting_autoSave: (value: Settings['autoSave']) => React.ReactNode;
    setting_autoSaveInterval: (value: Settings['autoSaveInterval']) => React.ReactNode;
    setting_reducedMotion: (value: Settings['reducedMotion']) => React.ReactNode;

    // Metadata
    tab_metadata: () => React.ReactNode;
    metadata_id: (value: FomodInfo['data']['Id']) => React.ReactNode;
    metadata_author: (value: FomodInfo['data']['Author']) => React.ReactNode;
    metadata_website: (value: FomodInfo['data']['Website']) => React.ReactNode;
    metadata_version: (value: FomodInfo['data']['Version']) => React.ReactNode;

    // Fomod Lingo
    sorting_order_ascending: () => string;
    sorting_order_descending: () => string;
    sorting_order_explicit: () => string;

    behavior_type_selectany: () => string;
    behavior_type_selectatleastone: () => string;
    behavior_type_selectatmostone: () => string;
    behavior_type_selectexactlyone: () => string;
    behavior_type_selectall: () => string;

    behavior_type_required: () => string;
    behavior_type_recommended: () => string;
    behavior_type_optional: () => string;
    behavior_type_couldbeusable: () => string;
    behavior_type_notusable: () => string;

    // Builder-Specific Labels
    builder_step_sorting_order: () => React.ReactNode;
    builder_module_name: (value: Fomod['moduleName']) => React.ReactNode;
    builder_module_name_entangled: (moduleName: Fomod['moduleName'], infoName: FomodInfo['data']['Name']) => React.ReactNode;
    builder_info_name: (value: FomodInfo['data']['Name']) => React.ReactNode;
    builder_module_name_conflict_warning: (moduleName: Fomod['moduleName'], infoName: FomodInfo['data']['Name']) => React.ReactNode;

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

    option_description_placeholder: (option: Immutable<Option<false>>) => string;
    option_image_alt: (option: Immutable<Option<false>>) => string;
    option_image_placeholder: (option: Immutable<Option<false>>) => string;
    flag_value_placeholder: (setter: Immutable<FlagSetter>) => string;

    // Flags
    flags_no_flags: () => React.ReactNode;
    flag_add_button: () => React.ReactNode;
    flag_button: (name: string) => React.ReactNode;
    flag_header: (name: string) => React.ReactNode;

    flag_name_placeholder: (setter: Immutable<FlagSetter>) => string;
    flag_sentence: (setter: Immutable<FlagSetter>, nameInput: React.ReactNode, valueInput: React.ReactNode) => React.ReactNode;

}

type RecursiveReadonly<T extends Record<any, any>> = { readonly [P in keyof T]: T[P] extends (...args: any[]) => any ? T[P] : T[P] extends Record<any, any> ? RecursiveReadonly<T[P]> : T[P] };


/** A list of keys that must be translated for each supported language. */
export const translationTable: RecursiveReadonly<TranslationTable> = {


    fomod_builder: {
        en: ()=> 'Fomod Builder',
    },



    tab_mission_control: {
        en: ()=> 'Mission Control',
    },

    tab_mission_control_title: {
        en: ()=> 'Welcome to the Fomod Builder!',
    },

    tab_mission_control_text: {
        en: ()=> <>
            <p>
                Go make you a Fomod installer!
            </p>
            <p>
                This tool is still in development, so expect bugs and missing features.
            </p>
            {translationTable.tab_about_basics.en()}
        </>,
    },


    tab_step_builder: {
        en: ()=> 'Step Builder',
    },


    tab_install_editor: {
        en: ()=> 'Install Editor',
    },


    tab_xml_editor: {
        en: ()=> 'XML Editor',
    },



    tab_documentation: {
        en: ()=> 'Documentation',
    },


    tab_about: {
        en: ()=> 'About',
    },

    tab_about_basics: {
        en: ()=> <p>
            The Fomod Builder is an open-source Next.js website built on my <a href='https://npmjs.com/package/fomod' target='_blank'><code>fomod</code></a> library
            . <a href="https://github.com/BellCubeDev/fomod-builder" target="_blank">Source code available on GitHub.</a>
        </p>
    },

    tab_about_more: {
        en: ()=> <>
            <p>
                I was initially frustrated by the lack of options for creating Fomod installers.
                Your choices were either a dumbed-down UI that didn&rsquo;t give you all of the options (or tooltips), what amounts to an XML editor UI, and literally just writing the XML yourself.
            </p>
            <p>
                So, I decided to make my own.
            </p>
            <p>
                The Fomod Builder is a web app that lets you create Fomod installers with a simple, intuitive UI.
                It gives you full access to every capability of the Fomod format, gives you tooltips where tooltips are needed, warnings about bad practices, and even gives you a built-in editor for the XML.

            </p>
        </>
    },

    tab_about_created_by: {
        en: ()=> <>Created by <a href='https://github.com/BellCubeDev/'>BellCube</a></>,
    },

    tab_about_bellcube: {
        en: ()=> <>
            I&rsquo;m BellCube, a self-taught modder and web developer. I&rsquo;ve been modding since 2021 and learning web development since 2022. Yes, I <i>am</i> a nerd.
        </>
    },

    tab_about_licensing: {
        en: ()=> <>
            <p>
                The Fomod Builder is licensed under the MIT license.
            </p>
            <p>
                The Fomod Builder <u><b>would not be possible</b></u> without the following open-source projects:
            </p>
        </>,
    },

    tab_metadata: {
        en: ()=> <>Metadata</>
    },





    tab_settings: {
        en: ()=> 'Settings',
    },

    tab_settings_header: {
        en: ()=> 'Settings',
    },

    tab_settings_note: {
        en: ()=> <>These settings are saved to your browser&rsquo;s local storage. If you clear your browser&rsquo;s local storage, these settings will be lost.</>,
    },



    setting_autoSave: {
        en: ()=> 'Auto-Save',
    },

    setting_autoSaveInterval: {
        en: ()=> 'Auto-Save Interval',
    },

    setting_defaultOptionType: {
        en: ()=> 'Default Option Type',
    },

    setting_defaultGroupBehavior: {
        en: ()=> 'Default Group Behavior',
    },

    setting_defaultOptionSortingOrder: {
        en: ()=> 'Default Option Sorting Order',
    },

    setting_defaultGroupSortingOrder: {
        en: ()=> 'Default Group Sorting Order',
    },

    setting_defaultStepSortingOrder: {
        en: ()=> 'Default Step Sorting Order',
    },

    setting_reducedMotion: {
        en: ()=> 'Prefer Reduced Motion',
    },


    // Loaders


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
            Select the root folder of your project. If it&rsquo;s not already set up for a Fomod, we&rsquo;ll handle that for you.
            <br/>
            If it is already set up for a Fomod, there should be a <code>fomod</code> folder.
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
        en: ()=> <>Enter the contents of ModuleConfig.xml and Info.xml below. We&rsquo;ll use that text for your editing session.</>
    },


    // UI stuff


    dropdown_no_options: {
        en: ()=> 'No Options',
    },

    dropdown_loading: {
        en: ()=> 'Loading...',
    },


    // Fomod Lingo


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

    behavior_type_required: {
        en: ()=> 'Force-Select This Option (No Choice)',
    },

    behavior_type_recommended: {
        en: ()=> 'Selected by Default',
    },

    behavior_type_optional: {
        en: ()=> 'Unselected by Default',
    },

    behavior_type_couldbeusable: {
        en: ()=> 'Show a warning before selecting',
    },

    behavior_type_notusable: {
        en: ()=> 'Disable This Option (No Choice)',
    },


    // Builder-Specific Labels

    builder_step_sorting_order: {
        en: ()=> <>Step Sorting Order:</>
    },

    builder_module_name_entangled: {
        en: ()=> <>Mod/Installer Name</>
    },

    builder_module_name: {
        en: ()=> <>Installer Name (Module.xml):</>
    },

    metadata_author: {
        en: ()=> <>Author:</>
    },

    metadata_id: {
        en: ()=> <>(Nexus Mods) ID:</>
    },

    metadata_version: {
        en: ()=> <>Version:</>
    },

    metadata_website: {
        en: ()=> <>Website:</>
    },


    builder_info_name: {
        en: ()=> <>Mod Name (Info.xml):</>
    },

    builder_module_name_conflict_warning: {
        en: ()=> <>The names in Module.xml and Info.xml conflict. As soon as they align, they will no longer be entangled.</>
    },

    // Steps


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

};
