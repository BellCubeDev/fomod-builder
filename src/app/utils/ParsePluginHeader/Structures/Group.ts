import type { BGSDataContainerWithVersionControlBase } from ".";

export enum GroupSignature {
    /** A group of records.
     *
     * @see BGSGroup
    */
    Group = 'GRUP',
}

export const GroupSignatureList = Object.values(GroupSignature);
export function isGroupSignature(signature: string): signature is GroupSignature {
    return GroupSignatureList.includes(signature as GroupSignature);
}

export enum BGSGroupType {
    Top,
    WorldChildren,
    InteriorCellBlock,
    InteriorCellSubBlock,
    ExteriorCellBlock,
    ExteriorCellSubBlock,
    CellChildren,
    TopicChildren,
    CellPersistentChildren,
    CellTemporaryChildren,
}

export interface BGSGroup extends BGSDataContainerWithVersionControlBase<GroupSignature> {
    /** Label. Format depends on group type.
     *
     * * In the CK Details view, you can mark a group as ignored, but the CK ignores this setting and reads the group anyway. The ignore flag interferes with what should ordinarily be in the label field (e.g., "HAIR" becomes "HQIR"). This mislabeling has no effect on record loading. __In short, the label field of a group is not reliable.__ If you subsequently save, the group will be written without the ignore markings.
     *
     * @type uint8[4]
    */
    label: Uint8Array,

    /** Determines what the group label should be interpreted as. Can also be used to determine the group's function.
     *
     * @type int32
     */
    groupType: BGSGroupType,

    /** Unknown. The values stored here are significantly different than those used in records and appear to be a 32-bit value rather than two 16-bit values. Values break out by group type:
     * * All top-level groups have a 0 here, with the exception of CELL, which can have a 1 in some add-ons.
     * * Topic children have single-byte values or 0xCCCCCCCC.
     * * Interior cells have a value of either 0 or 0xCCCCCCCC. Some add-ons have a value of 1.
     * * Other cell/world-related groups have a wide array of small to large values that are not Form IDs. Again, 0xCCCCCCCC is a possible value.
     *
     * @type uint32
     */
    unknown01: number,
}
