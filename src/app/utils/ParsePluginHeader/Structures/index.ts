import { BGSField, FieldSignature, BGSRecord, RecordSignature, BGSGroup, GroupSignature } from ".";
export * from "./Field";
export * from "./Group";
export *  from "./Record";

export type DataSignature = RecordSignature|GroupSignature|FieldSignature;
export type BGSDataContainer<TSignature = DataSignature> = (TSignature extends FieldSignature ? BGSField<TSignature> : never) | (TSignature extends RecordSignature ? BGSRecord<TSignature> : never) | (TSignature extends GroupSignature ? BGSGroup : never);

/** The Uint8Array size of each data type's size field (the size of the size; the *metasize*) */
export enum BGSDataMetasize {
    Group = 4,
    Record = 4,
    Field = 2,
}

export interface BGSDataContainerBase<TSignature extends DataSignature = DataSignature> {
    /** The signature of this data type
     *
     * @type char[4]
    */
    signature: TSignature;

    /** The size of the data. If this is a group, this the 24-byte group data type. For records and fields, this is the size of the data exclusively.
     *
     * @type uint32
     * @type uint16 `for fields`
    */
    size: number; // A uint32 can be safely represented as a `number` in JavaScript.

    /** A Uint8Array containing the data in this object. Its size is equal to the size property.
     *
     * @type uint8[size]
     * @type uint8[size - 24] `for groups`
    */
    dataRaw: Uint8Array;
}

export interface BGSDataContainerWithVersionControlBase<TSignature extends RecordSignature|GroupSignature = RecordSignature|GroupSignature> extends BGSDataContainerBase<TSignature> {
    /** * Skyrim: The low byte is the day of the month and the high byte is a combined value representing the month number and last digit of the year times 12. That value is offset, however, so the range is nominally 13-132, representing dates from January 20x4 through December 20x3. Lower values can be seen in Skyrim.esm, likely corresponding to older records held over from Oblivion where values of 1-12 represented 2003 (see [the Oblivion version of this page](https://en.uesp.net/wiki/Oblivion_Mod:Mod_File_Format#Groups) for specifics).
     *
     *     To derive the correct values, use the following formulae, where Y is the single-digit year, M is the month number, and HB is the high byte of the value:
     *     ```
     *     Y = ((HB - 1) / 12 + 3) MOD 10
     *     M = ((HB - 1) MOD 12) + 1
     *     HB = (((Y - 4) MOD 10) + 1) * 12 + M
     *     ```
     * <br />
     *
     * * Skyrim SE: Bits are used to represent each part, with a two-digit year: `0bYYYYYYYMMMMDDDDD`. Thus, January 25, 2021 would be (spaces added for clarity): `0b 0010101 0001 11001` or `0x2A39`.
     *
     * @type uint16
    */
    timestamp: number,

    /**Version Control Info
     * * The low byte is the user id that last had the form checked out.
     * * The high byte is the user id (if any) that currently has the form checked out.
     *
     * @type uint16
     */
    versionControlData: number,
}
