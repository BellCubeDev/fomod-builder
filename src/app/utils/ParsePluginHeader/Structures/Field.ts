import type { BGSDataContainerBase } from ".";

export enum FieldSignature {
    /** The header of the plugin file.
     *
     * @see HeaderStruct
    */
    Header = 'HEDR',

    /** The author of the file */
    Author = 'CNAM',

    /** The author-provided description of the file */
    Description = 'SNAM',

    /** The name of a master file
     *
     * @see MasterWithData
    */
    Master = 'MAST',

    /** The DATA associated with the master file. uint64. Included so it can be skipped.
     *
     * In Morrowind and times past, this was the size of the master file. Since then, it's been a uint64 of 0.
    */
    Data = 'DATA',

    /** Overridden forms
     * *This record only appears in ESM flagged files which override their masters' cell children.
     * *An ONAM subrecord will list, exclusively, FormIDs of overridden cell children (ACHR, LAND, NAVM, PGRE, PHZD, REFR).
     * *Observed in Update.esm as of Patch 1.5.24.
     * *Number of records is based solely on field size.
    */
    OverriddenForms = 'ONAM',

    /** Number of strings that can be tagified (used only for TagifyMasterfile command-line option of the CK). */
    TagifiableCount = 'INTV',

    /** Signature used for holding large data */
    LargeData = 'XXXX'
}

export const FieldSignatureList = Object.values(FieldSignature);
export function isFieldSignature(signature: string): signature is FieldSignature {
    return FieldSignatureList.includes(signature as FieldSignature);
}



/** A field attached to a record
 *
 * Provides no types of its own.
*/
export interface BGSField<TSignature extends FieldSignature = FieldSignature> extends BGSDataContainerBase<TSignature> {}
