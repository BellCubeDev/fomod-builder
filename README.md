# Fomod Builder

The Fomod Builder is a static Next.js project developed alongside the [`fomod`](https://npmjs.com/package/fomod) library. It provides a simple and intuitive web interface for editing and building Fomod installers. Supports all modern browsers. An Electron version may be down the road...

## Using

~~Head over to [fomod.bellcube.dev](https://fomod.bellcube.dev) to use the builder! Have fun!~~ The `fomod` library is not yet public. Sorry!

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
