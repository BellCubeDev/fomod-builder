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


# TODO

* [ ] Loader APIs
* [ ] Step/Group/Option Editing
* [ ] Dependency Editing
  * [X] Read ESP/L/M dependencies automatically
* [ ] Install Editing

### Important Tooltips

Listed here so I don't forget to add these later

* [ ] Differences Between Mod Manager Implementations
  * [ ] `SelectAtLeastOne` Groups
  * [ ] (MO2) Name from Info.xml `<Name>` vs (Vortex) ModuleConfig.xml's `<ModuleName>`
* [ ] Pseudo-Deprecated Features
  * [ ] `CouldBeUsable` Options
* [ ] Problematic Features
  * [ ] `NotUsable` and `Required` Options
  * [ ] `fommDependency`
