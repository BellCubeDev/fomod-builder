# Fomod Builder

The Fomod Builder is a static Next.js project developed alongside the [`fomod`](https://npmjs.com/package/fomod) library. It provides a simple and intuitive web interface for editing and building Fomod installers.

## Browser Support

Supports all modern browsers. An Electron version may be down the road.

> [!IMPORTANT]
> **Chromium-based browsers are recommended** because they provide [an API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) to access user-selected folders on the local file system with user consent.
>
> Firefox supports most of the underlying API but, critically, does *not* support access to the *local* file system—rather, they limit it to virtualized file systems (which are, in every regard, useless to the Fomod Builder).
>
> The Fomod Builder checks if it can use the API methods directly and will therefore automatically support Firefox and Safari if/when they choose to support the required API features.

## Using

> [!WARNING]
> The Fomod Builder is still in early development. Some features may be broken or outright missing. You may not be able to complete a full Fomod installer. That said, if you encounter any issues, please [report any issues you find](https://github.com/bellcubeDev/fomod-builder/issues/new/)!

Head over to [fomod.bellcube.dev](https://fomod.bellcube.dev) to use the builder! Have fun!

## Local Copy

Open the project repository. Run:
```bash
npm i
npm run dev
```

# FIXME
* Dynamic Length Inputs can stretch so far they push everything off of the screen

# TODO
* Migrate `edit` functions to simply transform; do not use Immer's `produce()` function so we can benefit from multi-ref editing

### Needs Styling
* Option Editor
  * Add a fade on sides of the scroll box with more step/group/option buttons

### Roadmap

* [X] ***Loader*** **API** - load files/folders from arbitrary and changing sources
* [X] **Folder Loader** - load a fomod installer from a folder on the user's computer. Allows for autosaving and image previews. Not supported in Firefox.
* [X] **Step/Group/Option Editing**
  * [ ] Style the Option editor better
  * [ ] (for Folder Loader) autocomplete image paths (assume any file can be an image but prioritize Chromium-supported file extensions)
* [ ] Blank loader - Load a completely blank installer. Used for playing around with the tool.
* [ ] **File/Folder Installation Tab** - edit both conditional and "required" installs
  * Note: don't try to render the conditions until the condition editor component is created
  * [ ] Button to merge duplicate condition trees
  * [ ] Button to remove empty install groups
  * [ ] If 3 or more files from the same folder are referenced, suggest using a folder for maintainability
  * [ ] (for the Folder Loader) If each file in the folder is referenced, suggest using a folder for maintainability
* [ ] **Drag-n-Drop Reordering**
  * [ ] Step/Group/Option
  * [ ] Installs
  * [ ] Also add buttons to reorder
* [ ] **Condition Editor Component** - a reusable component to show and edit conditions
  * [X] Detect ESM/L/P dependencies
  * [ ] Autocomplete for previously-used flag names/values
  * [ ] Warn when checking for non-plugin files (mod managers usually won't detect them)
  * [ ] Reordering Mechanics
  * [ ] Add to Options for behavior type conditions
  * [ ] Add to the Metadata tab for installer prerequisites (include a big disclaimer that this shouldn't be used to enforce mod-to-mod or mod-to-self dependencies because this leads to awful installation UX)
  * [ ] Add to Installation tab
* [ ] **Text Input loader** - paste your XML in. Should show two basic code font textareas (not Monaco editors) and a button to continue into loading. Saving will require downloading files and saving them manually.
* [ ] **Single-File Input Loader** - use HTML `<input>` elements to get *Info.xml* and *ModuleConfig.xml*. Saving will require downloading files and saving them manually as a limitation of the API.
* [ ] **Collapsing Side Navigation** - show users tab names by default and collapse the sidebar at their request
* [ ] **Universal Mod Manager Implementation Testing** - create a fomod installer w/ integrated instructions with the goal of probing all of the quirks from a mod manager. A user should be able to follow the instructions, provide a screen capture, and send an archive to provide all of the possibly-desired information about a mod manager.
* [ ] Create some sort of system to let users know about bad practices / anti-patterns not strictly related to the installer
  * Using ESP plugins. These make their references persistent. Prefer using ESM/L plugins instead.
* [ ] **Tooltips for Everything** - review every single component to see if a tooltip should be present. <!-- Check the [GitHub Readme](https://github.com/BellCubeDev/fomod-builder) for some of the tooltips I've made an explicit note to include. -->
<br />
  Here's some tooltips we need:
  * [ ] Differences Between Mod Manager Implementations
    * [ ] `SelectAtLeastOne` Groups <!-- TODO: Figure out what I meant by this -->
    * [ ] What's In A Name
      * Info.xml `<Name>`: MO2
      * ModuleConfig.xml `<ModuleName>`: Vortex
    * [ ] MO2's `CouldBeUsable` extra space at start (needs further investigation)
  * [ ] Pseudo-Deprecated Features
    * [ ] `CouldBeUsable` Options
  * [ ] Problematic Features
    * [ ] `NotUsable` and `Required` Options
      * Can lead to bad UX if used improperly
      * Prefer SelectAll groups for documentation and core files
    * [ ] `fommDependency`
      * Version is greatly inconsistent between mod managers
  * [ ] Disambiguation of Ambiguity
    * [ ] First matching `pattern` determines Option behavior type (top wins)
    * [ ] `fommDependency`, `foseDependency`, and `gameDependency` match game versions GTE the specified value using semver

### Potential Warnings
* Using an ESP module at all. ESM/L modules are preferred as they are handled more gracefully by the game engine.
* Importing more 3 or more files from a single folder in an option. Encourage using folders instead for maintainability.

### Testing New Mod Managers for Admittance
TODO: Actually make this a real thing
Use the [test installer](https://fomod.bellcube.dev/test-installer.zip) to discover the mod manager's behavior.

### Tools To Evaluate For Cool Features To ~~Steal~~ Take Inspiration From
* [X] [Fomod Creation Tool](https://www.nexusmods.com/fallout4/mods/6821)
* [ ] [Fomod Creator](https://www.nexusmods.com/fallout4/mods/14679)
* [ ] [Fomod Designer](https://github.com/GandaG/fomod-designer)
* [ ] [Kortex's Fomod Module (?)](https://www.nexusmods.com/skyrim/mods/90868)
