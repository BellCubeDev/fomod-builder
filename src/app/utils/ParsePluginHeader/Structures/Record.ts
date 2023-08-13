import type { BGSDataContainerWithVersionControlBase } from ".";

/** Record types
 *
 * Only includes types the Fomod Builder needs to know about.
 */
export enum RecordSignature {
    /** [Skyrim Mod:Mod File Format/AACT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/AACT) */
    Action = 'AACT',

    /** [Skyrim Mod:Mod File Format/ACHR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ACHR) */
    ActorReference = 'ACHR',

    /** [Skyrim Mod:Mod File Format/ACTI](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ACTI) */
    Activator = 'ACTI',

    /** [Skyrim Mod:Mod File Format/ADDN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ADDN) */
    AddonNode = 'ADDN',

    /** [Skyrim Mod:Mod File Format/ALCH](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ALCH) */
    Potion = 'ALCH',

    /** [Skyrim Mod:Mod File Format/AMMO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/AMMO) */
    Ammo = 'AMMO',

    /** [Skyrim Mod:Mod File Format/ANIO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ANIO) */
    AnimationObject = 'ANIO',

    /** [Skyrim Mod:Mod File Format/APPA](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/APPA) */
    Apparatus = 'APPA',

    /** [Skyrim Mod:Mod File Format/ARMA](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ARMA) */
    ArmorAddon = 'ARMA',

    /** [Skyrim Mod:Mod File Format/ARMO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ARMO) */
    Armor = 'ARMO',

    /** [Skyrim Mod:Mod File Format/ARTO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ARTO) */
    ArtObject = 'ARTO',

    /** [Skyrim Mod:Mod File Format/ASPC](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ASPC) */
    AcousticSpace = 'ASPC',

    /** [Skyrim Mod:Mod File Format/ASTP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ASTP) */
    AssociationType = 'ASTP',

    /** [Skyrim Mod:Mod File Format/AVIF](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/AVIF) */
    ActorValue = 'AVIF',

    /** [Skyrim Mod:Mod File Format/BOOK](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/BOOK) */
    Book = 'BOOK',

    /** [Skyrim Mod:Mod File Format/BPTD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/BPTD) */
    BodyPartData = 'BPTD',

    /** [Skyrim Mod:Mod File Format/CAMS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CAMS) */
    CameraShot = 'CAMS',

    /** [Skyrim Mod:Mod File Format/CELL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CELL) */
    Cell = 'CELL',

    /** [Skyrim Mod:Mod File Format/CLAS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CLAS) */
    Class = 'CLAS',

    /** [Skyrim Mod:Mod File Format/CLFM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CLFM) */
    Color = 'CLFM',

    /** [Skyrim Mod:Mod File Format/CLMT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CLMT) */
    Climate = 'CLMT',

    /** [Skyrim Mod:Mod File Format/COBJ](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/COBJ) */
    ConstructibleObject = 'COBJ',

    /** [Skyrim Mod:Mod File Format/COLL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/COLL) */
    CollisionLayer = 'COLL',

    /** [Skyrim Mod:Mod File Format/CONT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CONT) */
    Container = 'CONT',

    /** [Skyrim Mod:Mod File Format/CPTH](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CPTH) */
    CameraPath = 'CPTH',

    /** [Skyrim Mod:Mod File Format/CSTY](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/CSTY) */
    CombatStyle = 'CSTY',

    /** [Skyrim Mod:Mod File Format/DEBR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DEBR) */
    Debris = 'DEBR',

    /** [Skyrim Mod:Mod File Format/DIAL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DIAL) */
    DialogTopic = 'DIAL',

    /** [Skyrim Mod:Mod File Format/DLBR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DLBR) */
    DialogBranch = 'DLBR',

    /** [Skyrim Mod:Mod File Format/DLVW](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DLVW) */
    DialogView = 'DLVW',

    /** [Skyrim Mod:Mod File Format/DOBJ](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DOBJ) */
    DefaultObjectManager = 'DOBJ',

    /** [Skyrim Mod:Mod File Format/DOOR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DOOR) */
    Door = 'DOOR',

    /** [Skyrim Mod:Mod File Format/DUAL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/DUAL) */
    DualCastData = 'DUAL',

    /** [Skyrim Mod:Mod File Format/ECZN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ECZN) */
    EncounterZone = 'ECZN',

    /** [Skyrim Mod:Mod File Format/EFSH](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/EFSH) */
    EffectShader = 'EFSH',

    /** [Skyrim Mod:Mod File Format/ENCH](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/ENCH) */
    Enchantment = 'ENCH',

    /** [Skyrim Mod:Mod File Format/EQUP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/EQUP) */
    EquipSlot = 'EQUP',

    /** [Skyrim Mod:Mod File Format/EXPL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/EXPL) */
    Explosion = 'EXPL',

    /** [Skyrim Mod:Mod File Format/EYES](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/EYES) */
    Eyes = 'EYES',

    /** [Skyrim Mod:Mod File Format/FACT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FACT) */
    Faction = 'FACT',

    /** [Skyrim Mod:Mod File Format/FLOR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FLOR) */
    Flora = 'FLOR',

    /** [Skyrim Mod:Mod File Format/FLST](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FLST) */
    FormList = 'FLST',

    /** [Skyrim Mod:Mod File Format/FSTP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FSTP) */
    Footstep = 'FSTP',

    /** [Skyrim Mod:Mod File Format/FSTS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FSTS) */
    FootstepSet = 'FSTS',

    /** [Skyrim Mod:Mod File Format/FURN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/FURN) */
    Furniture = 'FURN',

    /** [Skyrim Mod:Mod File Format/GLOB](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/GLOB) */
    GlobalVariable = 'GLOB',

    /** [Skyrim Mod:Mod File Format/GMST](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/GMST) */
    GameSetting = 'GMST',

    /** [Skyrim Mod:Mod File Format/GRAS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/GRAS) */
    Grass = 'GRAS',

    /** [Skyrim Mod:Mod File Format/HAZD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/HAZD) */
    Hazard = 'HAZD',

    /** [Skyrim Mod:Mod File Format/HDPT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/HDPT) */
    HeadPart = 'HDPT',

    /** [Skyrim Mod:Mod File Format/IDLE](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IDLE) */
    IdleAnimation = 'IDLE',

    /** [Skyrim Mod:Mod File Format/IDLM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IDLM) */
    IdleMarker = 'IDLM',

    /** [Skyrim Mod:Mod File Format/IMAD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IMAD) */
    ImageSpaceModifier = 'IMAD',

    /** [Skyrim Mod:Mod File Format/IMGS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IMGS) */
    ImageSpace = 'IMGS',

    /** [Skyrim Mod:Mod File Format/INFO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/INFO) */
    DialogTopicInfo = 'INFO',

    /** [Skyrim Mod:Mod File Format/INGR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/INGR) */
    Ingredient = 'INGR',

    /** [Skyrim Mod:Mod File Format/IPCT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IPCT) */
    ImpactData = 'IPCT',

    /** [Skyrim Mod:Mod File Format/IPDS](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/IPDS) */
    ImpactDataSet = 'IPDS',

    /** [Skyrim Mod:Mod File Format/KEYM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/KEYM) */
    Key = 'KEYM',

    /** [Skyrim Mod:Mod File Format/KYWD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/KYWD) */
    Keyword = 'KYWD',

    /** [Skyrim Mod:Mod File Format/LAND](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LAND) */
    Landscape = 'LAND',

    /** [Skyrim Mod:Mod File Format/LCRT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LCRT) */
    LocationReferenceType = 'LCRT',

    /** [Skyrim Mod:Mod File Format/LCTN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LCTN) */
    Location = 'LCTN',

    /** [Skyrim Mod:Mod File Format/LGTM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LGTM) */
    LightingTemplate = 'LGTM',

    /** [Skyrim Mod:Mod File Format/LIGH](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LIGH) */
    Light = 'LIGH',

    /** [Skyrim Mod:Mod File Format/LSCR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LSCR) */
    LoadScreen = 'LSCR',

    /** [Skyrim Mod:Mod File Format/LTEX](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LTEX) */
    LandTexture = 'LTEX',

    /** [Skyrim Mod:Mod File Format/LVLI](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LVLI) */
    LeveledItem = 'LVLI',

    /** [Skyrim Mod:Mod File Format/LVLN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LVLN) */
    LeveledActor = 'LVLN',

    /** [Skyrim Mod:Mod File Format/LVSP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/LVSP) */
    LeveledSpell = 'LVSP',

    /** [Skyrim Mod:Mod File Format/MATO](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MATO) */
    MaterialObject = 'MATO',

    /** [Skyrim Mod:Mod File Format/MATT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MATT) */
    MaterialType = 'MATT',

    /** [Skyrim Mod:Mod File Format/MESG](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MESG) */
    Message = 'MESG',

    /** [Skyrim Mod:Mod File Format/MGEF](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MGEF) */
    MagicEffect = 'MGEF',

    /** [Skyrim Mod:Mod File Format/MISC](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MISC) */
    MiscObject = 'MISC',

    /** [Skyrim Mod:Mod File Format/MOVT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MOVT) */
    MovementType = 'MOVT',

    /** [Skyrim Mod:Mod File Format/MSTT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MSTT) */
    MovableStatic = 'MSTT',

    /** [Skyrim Mod:Mod File Format/MUSC](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MUSC) */
    MusicType = 'MUSC',

    /** [Skyrim Mod:Mod File Format/MUST](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/MUST) */
    MusicTrack = 'MUST',

    /** [Skyrim Mod:Mod File Format/NAVI](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/NAVI) */
    NavigationMasterData = 'NAVI',

    /** [Skyrim Mod:Mod File Format/NAVM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/NAVM) */
    NavMesh = 'NAVM',

    /** [Skyrim Mod:Mod File Format/NOTE](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/NOTE) */
    Note = 'NOTE',

    /** [Skyrim Mod:Mod File Format/NPC](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/NPC) */
    Actor = 'NPC_',

    /** [Skyrim Mod:Mod File Format/OTFT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/OTFT) */
    Outfit = 'OTFT',

    /** [Skyrim Mod:Mod File Format/PACK](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/PACK) */
    AIPackage = 'PACK',

    /** [Skyrim Mod:Mod File Format/PERK](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/PERK) */
    Perk = 'PERK',

    /** [Skyrim Mod:Mod File Format/PGRE](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/PGRE) */
    PlacedGrenade = 'PGRE',

    /** [Skyrim Mod:Mod File Format/PHZD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/PHZD) */
    Placedhazard = 'PHZD',

    /** [Skyrim Mod:Mod File Format/PROJ](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/PROJ) */
    Projectile = 'PROJ',

    /** [Skyrim Mod:Mod File Format/QUST](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/QUST) */
    Quest = 'QUST',

    /** [Skyrim Mod:Mod File Format/RACE](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/RACE) */
    RaceOrCreature = 'RACE',

    /** [Skyrim Mod:Mod File Format/REFR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/REFR) */
    ObjectReference = 'REFR',

    /** [Skyrim Mod:Mod File Format/REGN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/REGN) */
    Region = 'REGN',

    /** [Skyrim Mod:Mod File Format/RELA](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/RELA) */
    Relationship = 'RELA',

    /** [Skyrim Mod:Mod File Format/REVB](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/REVB) */
    ReverbParameters = 'REVB',

    /** [Skyrim Mod:Mod File Format/RFCT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/RFCT) */
    VisualEffect = 'RFCT',

    /** [Skyrim Mod:Mod File Format/SCEN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SCEN) */
    Scene = 'SCEN',

    /** [Skyrim Mod:Mod File Format/SCRL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SCRL) */
    Scroll = 'SCRL',

    /** [Skyrim Mod:Mod File Format/SHOU](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SHOU) */
    Shout = 'SHOU',

    /** [Skyrim Mod:Mod File Format/SLGM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SLGM) */
    SoulGem = 'SLGM',

    /** [Skyrim Mod:Mod File Format/SMBN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SMBN) */
    StoryManagerBranchNode = 'SMBN',

    /** [Skyrim Mod:Mod File Format/SMEN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SMEN) */
    StoryManagerEventNode = 'SMEN',

    /** [Skyrim Mod:Mod File Format/SMQN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SMQN) */
    StoryManagerQuestNode = 'SMQN',

    /** [Skyrim Mod:Mod File Format/SNCT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SNCT) */
    SoundCategory = 'SNCT',

    /** [Skyrim Mod:Mod File Format/SNDR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SNDR) */
    SoundReference = 'SNDR',

    /** [Skyrim Mod:Mod File Format/SOPM](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SOPM) */
    SoundOutputModel = 'SOPM',

    /** [Skyrim Mod:Mod File Format/SOUN](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SOUN) */
    Sound = 'SOUN',

    /** [Skyrim Mod:Mod File Format/SPEL](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SPEL) */
    Spell = 'SPEL',

    /** [Skyrim Mod:Mod File Format/SPGD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/SPGD) */
    ShaderParticleGeometry = 'SPGD',

    /** [Skyrim Mod:Mod File Format/STAT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/STAT) */
    Static = 'STAT',

    /** [Skyrim Mod:Mod File Format/TACT](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/TACT) */
    TalkingActivator = 'TACT',

    /** [Skyrim Mod:Mod File Format/TES4](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/TES4) */
    Header = 'TES4',

    /** [Skyrim Mod:Mod File Format/TREE](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/TREE) */
    Tree = 'TREE',

    /** [Skyrim Mod:Mod File Format/TXST](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/TXST) */
    TextureSet = 'TXST',

    /** [Skyrim Mod:Mod File Format/VTYP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/VTYP) */
    VoiceType = 'VTYP',

    /** [Skyrim Mod:Mod File Format/WATR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WATR) */
    WaterType = 'WATR',

    /** [Skyrim Mod:Mod File Format/WEAP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WEAP) */
    Weapon = 'WEAP',

    /** [Skyrim Mod:Mod File Format/WOOP](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WOOP) */
    WordOfPower = 'WOOP',

    /** [Skyrim Mod:Mod File Format/WRLD](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WRLD) */
    Worldspace = 'WRLD',

    /** [Skyrim Mod:Mod File Format/WTHR](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format/WTHR) */
    Weather = 'WTHR',


}

const RecordSignatureList = Object.values(RecordSignature);
export function isRecordSignature(signature: string): signature is RecordSignature {
    return RecordSignatureList.includes(signature as RecordSignature);
}


export interface BGSRecord<TSignature extends RecordSignature = RecordSignature> extends BGSDataContainerWithVersionControlBase<TSignature> {
    /** Record flags
     *
     * @type uint32
     */
    flagsRaw: number;

    /** Record flags, parsed into an object
     *
     * @type uint32
     */
    flags: RecordFlagsData<TSignature>;

    /** Form ID
     *
     * 0xFF000000 is the plugin index. 0x00 should nearly always be the base-game master, e.g. Skyrim.esm
     *
     * For light plugins, 0xFFF000 must be reserved for the engine. For SSE, add the 0x800 range.
     *
     * @type uint32
    */
    formId: number;

    /** The internal version of the record. This can be used to distinguish certain records that have different field layouts or sizes.
     *
     * @type uint16
    */
    version: number;

    /** Unknown. Values range between 0-15.
     *
     * @type uint16
    */
    unknown02: number;
}

/** NOTE: Comes from the UESP page. May not be fully up-to-date with the latest community findings. */
export enum GlobalRecordFlags {
    /** (bugged, see [Groups](https://en.uesp.net/wiki/Skyrim_Mod:Mod_File_Format#Groups)) */
    DeletedGroup =                      0b00000000000000000000000000010000,
    DeletedRecord =                     0b00000000000000000000000000100000,
    MustUpdateAnims =                   0b00000000000000000000000100000000,
    QuestItem =                         0b00000000000000000000010000000000,
    InitiallyDisabled =                 0b00000000000000000000100000000000,
    Ignored =                           0b00000000000000000001000000000000,
    VisibleWhenDistant =                0b00000000000000000010000000000000,
    DangerousOrOffLimits =              0b00000000000000100000000000000000,
    DataIsCompressed =                  0b00000000000001000000000000000000,
    CantWait =                          0b00000000000010000000000000000000,
    IsMarker =                          0b00000000100000000000000000000000,
    NavMeshGenFiller =                  0b00000100000000000000000000000000,
    NavMeshGenBoundingBox =             0b00001000000000000000000000000000,
    NavMeshOnGround =                   0b01000000000000000000000000000000,
    HasTreeLOD =                        0b00000000000000000000000001000000,
    NotOnLocalMap =                     0b00000000000000000000001000000000,
    HasDistantLOD =                     0b00000000000000001000000000000000,
    RandomAnimationStart =              0b00000000000000010000000000000000,
    Obstacle =                          0b00000010000000000000000000000000,
    ChildCanUse =                       0b00100000000000000000000000000000,
}

/** NOTE: Comes from the UESP page. May not be fully up-to-date with the latest community findings. */
export const RecordFlagsMap = {
    TES4: {
        Master:                         0b00000000000000000000000000000001,
        Localized:                      0b00000000000000000000000010000000,
        Light:                          0b00000000000000000000001000000000,
    },
    AACT: {},
    ACHR: {
        StartsDead:                     0b00000000000000000000001000000000,
        Persistent:                     0b00000000000000000000010000000000,
        NoAIAcquire:                    0b00000010000000000000000000000000,
        ReflectedByAutoWater:           0b00010000000000000000000000000000,
        DontHavokSettle:                0b00100000000000000000000000000000,
    },
    ACTI: {

    },
    ADDN: {},
    ALCH: {},
    AMMO: {},
    ANIO: {},
    APPA: {},
    ARMA: {},
    ARMO: {},
    ARTO: {},
    ASPC: {},
    ASTP: {},
    AVIF: {},
    BOOK: {},
    BPTD: {},
    CAMS: {},
    CELL: {
        Persistent:                     0b00000000000000000000010000000000,
        OffLimits:                      0b00000000000000100000000000000000,
    },
    CLAS: {},
    CLFM: {},
    CLMT: {},
    COBJ: {},
    COLL: {},
    CONT: {

    },
    CPTH: {},
    CSTY: {},
    DEBR: {},
    DIAL: {},
    DLBR: {},
    DLVW: {},
    DOBJ: {},
    DOOR: {},
    DUAL: {},
    ECZN: {},
    EFSH: {},
    ENCH: {},
    EQUP: {},
    EXPL: {},
    EYES: {},
    FACT: {},
    FLOR: {},
    FLST: {},
    FSTP: {},
    FSTS: {},
    FURN: {
        MustExitToTalk:                 0b00010000000000000000000000000000,
    },
    GLOB: {
        Constant:                       0b00000000000000000000000001000000,
    },
    GMST: {},
    GRAS: {},
    HAZD: {},
    HDPT: {},
    IDLE: {},
    IDLM: {},
    IMAD: {},
    IMGS: {},
    INFO: {},
    INGR: {},
    IPCT: {},
    IPDS: {},
    KEYM: {},
    KYWD: {},
    LAND: {},
    LCRT: {},
    LCTN: {},
    LGTM: {},
    LIGH: {
        PortalStrict:                   0b00000000000000100000000000000000,
    },
    LSCR: {},
    LTEX: {},
    LVLI: {},
    LVLN: {},
    LVSP: {},
    MATO: {},
    MATT: {},
    MESG: {},
    MGEF: {},
    MISC: {
        NotPlayable:                    0b00000000000000000000000000000100,
    },
    MOVT: {},
    MSTT: {
        HasCurrents:                    0b00000000000010000000000000000000,
        DoesNotRespawn:                 0b01000000000000000000000000000000,
    },
    MUSC: {},
    MUST: {},
    NAVI: {},
    NAVM: {},
    NOTE: {},
    NPC_: {},
    OTFT: {},
    PACK: {},
    PERK: {},
    PGRE: {},
    PHZD: {
        IsFullLOD:                      0b00000000000000010000000000000000,
        ReflectedByAutoWater:           0b00010000000000000000000000000000,
        DoesNotRespawn:                 0b01000000000000000000000000000000,
    },
    PROJ: {},
    QUST: {},
    RACE: {},
    REFR: {
        HiddenFromLocalMap:             0b00000000000000000000000000000001,
        /** Note from UESP:
         * > Needs Confirmation: Related to shields
        */
        HiddenFromLocalMapUnconfirmed:  0b00000000000000000000000001000000,
        Inaccessible:                   0b00000000000000000000000100000000,
        Persistent:                     0b00000000000000000000010000000000,
        ReflectedByAutoWater:           0b00010000000000000000000000000000,
        DontHavokSettle:                0b00100000000000000000000000000000,
        DoesNotRespawn:                 0b01000000000000000000000000000000,
    },
    REGN: {},
    RELA: {},
    REVB: {},
    RFCT: {},
    SCEN: {},
    SCRL: {},
    SHOU: {},
    SLGM: {
        CanHoldNPCSoul:                 0b00000000000000100000000000000000,
    },
    SMBN: {},
    SMEN: {},
    SMQN: {},
    SNCT: {},
    SNDR: {},
    SOPM: {},
    SOUN: {},
    SPEL: {},
    SPGD: {},
    STAT: {
        UsesHighDetailLODTexture:       0b00000000000000100000000000000000,
        HasCurrents:                    0b00000000000010000000000000000000,
        ShowInWorldMap:                 0b00010000000000000000000000000000,
    },
    TACT: {
        NotOnLocalMap:                  0b00000000000000000000001000000000,
        RadioStation:                   0b00000000000000100000000000000000,
    },
    TREE: {},
    TXST: {},
    VTYP: {},
    WATR: {},
    WEAP: {},
    WOOP: {},
    WRLD: {},
    WTHR: {},
} as const satisfies {[key in RecordSignature]: (Record<string, number>)};

/** A basic mapping of signatures to bits. Does not remove names overriden from GlobalRecordFlags (i.e. may contain duplicate bits) */
type PrimitiveRecordFlagsMapping<T extends RecordSignature = RecordSignature> = typeof GlobalRecordFlags & typeof RecordFlagsMap[T];

type RecordSpecificBits<T extends RecordSignature = RecordSignature> = typeof RecordFlagsMap[T][keyof typeof RecordFlagsMap[T]];

/** Retrieves valid flag bits for the specified signature */
export type RecordFlagBits<T extends RecordSignature = RecordSignature> = PrimitiveRecordFlagsMapping<T>[keyof PrimitiveRecordFlagsMapping<T>];

/** Retrieves the flags for the specified signature
 *
 * Masks flags out from GlobalRecordFlags where the same value exists in the RecordFlagsMap for the specified signature
*/
export type RecordFlagsMapping<T extends RecordSignature = RecordSignature> = {[key in keyof typeof GlobalRecordFlags as typeof GlobalRecordFlags[key] extends RecordSpecificBits<T> ? never : key]: typeof GlobalRecordFlags[key]} & typeof RecordFlagsMap[T];


/** Retrieves valid flag names for the specified signature */
export type RecordFlagNames<T extends RecordSignature = RecordSignature> = keyof RecordFlagsMapping<T>;

/** A map of record flags to their boolean values */
export type RecordFlagsData<T extends RecordSignature = RecordSignature> = { -readonly [key in keyof RecordFlagsMapping<T>]: boolean};
