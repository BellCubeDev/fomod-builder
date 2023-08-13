import { BGSDataContainer, BGSDataMetasize, BGSField, BGSGroup, BGSRecord, DataSignature, FieldSignature, GlobalRecordFlags, GroupSignature, RecordFlagBits, RecordFlagNames, RecordFlagsData, RecordFlagsMap, RecordFlagsMapping, RecordSignature, isFieldSignature, isGroupSignature, isRecordSignature } from "./Structures";


/** Parses the next item in provided readable stream.
 *
 * @param stream Stream to continue reading from
 * @returns An array containing the next item and the remaining stream
 */
export async function getNextItemAndDataFromStream(stream: ReadableStream<Uint8Array>): Promise<BGSDataContainer> {
    let signature = '';

    const reader = stream.getReader({ mode: 'byob' });

    // Read the record signature
    let headerRaw = await reader.read(new Uint8Array(4));
    if (headerRaw.done) throw new Error('Stream ended before data size could be read!');
    signature = new TextDecoder().decode(headerRaw.value);

    console.debug('Got signature:', signature);

    reader.releaseLock();

    const isField = isFieldSignature(signature);
    const isGroup = isGroupSignature(signature);
    const isRecord = isRecordSignature(signature);

    if (isField)  return await parseFieldFromStream(signature as FieldSignature, stream);
    if (isGroup)  return await parseGroupFromStream(signature as GroupSignature, stream);

    // @ts-expect-error: Looks like my enums are too large for TypeScript to grasp
    // Error is cryptic and does not occur with a smaller record enum
    if (isRecord) return await parseRecordFromStream(signature as RecordSignature, stream);

    throw new Error(`Unknown signature: ${signature}`);
}


/** Parses the next item in provided Uint8Array.
 *
 * @param data Data to read from
 * @param offset Offset to start reading from
 */
export function getNextItemsAndDataFromData(data: Uint8Array, offset: number): [BGSDataContainer, number] {
    let signature = '';

    // Read the record signature
    signature = new TextDecoder().decode(data.slice(offset, offset + 4));
    offset += 4;

    console.debug('Got signature:', signature);

    const isField = isFieldSignature(signature);
    const isGroup = isGroupSignature(signature);
    const isRecord = isRecordSignature(signature);

    if (isField)  return parseFieldFromData(signature as FieldSignature, data, offset);
    if (isGroup)  return parseGroupFromData(signature as GroupSignature, data, offset);

    // @ts-expect-error: Looks like my enums are too large for TypeScript to grasp
    // Error is cryptic and does not occur with a smaller record enum
    if (isRecord) return parseRecordFromData(signature as RecordSignature, data, offset);

    console.debug('Unknown signature:', {signature, data, offset});
    throw new Error(`Unknown signature: ${signature}`);
}

async function parseGroupFromStream(signature: GroupSignature, stream: ReadableStream<Uint8Array>): Promise<BGSGroup> {
    throw new Error('Groups (GRUP-signature data items) are not implemented!', {cause: {signature, stream}});
}

function parseGroupFromData(signature: GroupSignature, data: Uint8Array, offset: number): [BGSGroup, number] {
    throw new Error('Groups (GRUP-signature data items) are not implemented!', {cause: {signature, data, offset}});
}

async function parseFieldFromStream(signature: FieldSignature, stream: ReadableStream<Uint8Array>): Promise<BGSField> {
    const reader = stream.getReader({ mode: 'byob' });

    const sizeRaw = await reader.read(new Uint8Array(BGSDataMetasize.Field));
    if (sizeRaw.done) throw new Error(`Stream ended before field data could be read!`);
    const size = new DataView(sizeRaw.value.buffer).getUint16(0, true);

    const dataRaw = await reader.read(new Uint8Array(size));
    if (dataRaw.done) throw new Error(`Stream ended before field data could be read!`);

    reader.releaseLock();

    // If this isn't a large data field, we can call it a day here.
    // Otherwise, we have some work to do...
    if (signature !== FieldSignature.LargeData) return {
        signature,
        dataRaw: dataRaw.value,
        size,
    };

    // Handling for large data (XXXX) fields

    const nextField = await getNextItemAndDataFromStream(stream);
    if (!isFieldSignature(nextField.signature)) throw new Error(`Large Data field was not followed by a valid field signature!`);

    const newData = new Uint8Array(dataRaw.value.length + nextField.size + 4);
    newData.set(dataRaw.value);
    newData.set(nextField.dataRaw, dataRaw.value.length);

    return {
        signature: nextField.signature,
        size: newData.length,
        dataRaw: newData,
    };
}

function parseFieldFromData(signature: FieldSignature, data: Uint8Array, offset: number): [BGSField, number] {
    const size = new DataView(data.buffer).getUint16(offset, true);
    offset += 2;

    const dataRaw = data.slice(offset, size + offset);

    // If this isn't a large data field, we can call it a day here.
    // Otherwise, we have some work to do...
    if (signature !== FieldSignature.LargeData) return [{
        signature,
        size,
        dataRaw,
    }, offset + size];

    // Handling for large data (XXXX) fields

    const nextFieldSignature = new TextDecoder().decode(data.slice(offset + size, offset + size + 4));
    if (!isFieldSignature(nextFieldSignature)) throw new Error(`Large Data field was not followed by a valid field signature!`);
    const nextFieldResult = parseFieldFromData(nextFieldSignature, data, offset + size + 4);

    const newData = new Uint8Array(dataRaw.length + nextFieldResult[0].size + 4);
    newData.set(dataRaw);
    newData.set(nextFieldResult[0].dataRaw, dataRaw.length);

    return [{
        signature: nextFieldSignature,
        size: newData.length,
        dataRaw: newData,
    }, offset + size + 4 + nextFieldResult[0].size];
}


function computeFlag<TSignature extends RecordSignature>(flagsObject: Partial<RecordFlagsData<TSignature>>, flagName: keyof RecordFlagsData<TSignature>, bit: string|number, flagsRaw: number) {
    if (typeof flagName !== 'string') return; // fix for a strange bug where the bits leak into the keys array
    if (typeof bit !== 'number') return; // fix for a strange bug where the bits leak into the keys array
    flagsObject[flagName] = (flagsRaw & bit) !== 0;
}

function computeFlagsForFlagMap<TSignature extends RecordSignature>(map: Record<string, string|number>, obj: RecordFlagsData<TSignature>, flagsRaw: number) {
    for (const [name, bit] of (Object.entries(map) as [RecordFlagNames<TSignature>, string|RecordFlagBits][])) computeFlag(obj, name, bit, flagsRaw);
}

function computeFlagsForRecord<TSignature extends RecordSignature>(signature: RecordSignature, flagsRaw: number): RecordFlagsData<TSignature> {
    const flags = {} as RecordFlagsData<TSignature>;

    // So you don't have to read this whole thing:
    // Creates a merged map of GlobalRecordFlags and RecordFlagsMap[signature], resolving any bit conflicts using RecordFlagsMapping[signature]'s name.
    const signatureSpecificFlagBits = Object.values(RecordFlagsMap[signature]);
    const flagMap = Object.entries(GlobalRecordFlags).reduce((acc, [key, value]) => {
        if (signatureSpecificFlagBits.includes(value as any)) return acc;
        else acc[key] = value;
        return acc;
    }, {} as Record<string, string|number>);
    Object.assign(flagMap, RecordFlagsMap[signature]);

    computeFlagsForFlagMap(flagMap, flags, flagsRaw);

    return flags;
}

async function parseRecordFromStream(signature: RecordSignature, stream: ReadableStream<Uint8Array>): Promise<BGSRecord> {
    const reader = stream.getReader({ mode: 'byob' });

    const sizeRaw = await reader.read(new Uint8Array(BGSDataMetasize.Record));
    if (sizeRaw.done) throw new Error(`Stream ended before record flags could be read!`);
    const size = new DataView(sizeRaw.value.buffer).getUint32(0, true);

    const flagsRawRaw = await reader.read(new Uint8Array(4));
    if (flagsRawRaw.done) throw new Error(`Stream ended before record Form ID could be read!`);
    const flagsRaw = new DataView(flagsRawRaw.value.buffer).getUint32(0, true);
    const flags = computeFlagsForRecord(signature, flagsRaw);

    const formIdRaw = await reader.read(new Uint8Array(4));
    if (formIdRaw.done) throw new Error(`Stream ended before record timestamp could be read!`);
    const formId = new DataView(formIdRaw.value.buffer).getUint32(0, true);

    const timestampRaw = await reader.read(new Uint8Array(2));
    if (timestampRaw.done) throw new Error(`Stream ended before record version control data could be read!`);
    const timestamp = new DataView(timestampRaw.value.buffer).getUint16(0, true);

    const versionControlDataRaw = await reader.read(new Uint8Array(2));
    if (versionControlDataRaw.done) throw new Error(`Stream ended before record version could be read!`);
    const versionControlData = new DataView(versionControlDataRaw.value.buffer).getUint16(0, true);

    const versionRaw = await reader.read(new Uint8Array(2));
    if (versionRaw.done) throw new Error(`Stream ended before record data (and [[unknown]]) could be read!`);
    const version = new DataView(versionRaw.value.buffer).getUint16(0, true);

    const unknown02Raw = await reader.read(new Uint8Array(2));
    if (unknown02Raw.done) throw new Error(`Stream ended before record data could be read!`);
    const unknown02 = new DataView(unknown02Raw.value.buffer).getUint16(0, true);

    const dataRawRaw = await reader.read(new Uint8Array(size));
    if (dataRawRaw.done) throw new Error(`Stream ended before record data could be read!`);
    const dataRaw = dataRawRaw.value;

    reader.releaseLock();

    return {
        signature,
        size,
        flagsRaw,
        flags,
        formId,
        timestamp,
        versionControlData,
        version,
        unknown02,
        dataRaw,
    };
}

function parseRecordFromData(signature: RecordSignature, data: Uint8Array, offset: number): [BGSRecord, number] {
    const size = new DataView(data.buffer).getUint32(0, true);
    const flagsRaw = new DataView(data.buffer.slice(4, 8)).getUint32(0, true);

    return [{
        signature,
        size,
        flagsRaw,
        flags: computeFlagsForRecord(signature, flagsRaw),
        formId: new DataView(data.buffer.slice(8, 12)).getUint32(0, true),
        timestamp: new DataView(data.buffer.slice(12, 14)).getUint16(0, true),
        versionControlData: new DataView(data.buffer.slice(14, 16)).getUint16(0, true),
        version: new DataView(data.buffer.slice(16, 18)).getUint16(0, true),
        unknown02: new DataView(data.buffer.slice(18, 20)).getUint16(0, true),
        dataRaw: data.slice(20, size),
    }, offset + size + 20];
}

interface PluginMetadata {
    author?: string;
    description?: string;
    masters: string[];
}

export default async function ParseModTES4RecordFromStream(stream: ReadableStream<Uint8Array>): Promise<PluginMetadata> {
    console.debug('Parsing plugin metadata from stream', stream);

    const headTemp = await getNextItemAndDataFromStream(stream);
    if (headTemp.signature !== RecordSignature.Header) throw new Error('First record in a plugin must have a TES4 signature!');
    const head: BGSDataContainer<RecordSignature.Header> = headTemp;

    console.debug('Got metadata:', head);

    let offset = 0;

    let headerTemp: BGSDataContainer;
    [headerTemp, offset] = getNextItemsAndDataFromData(head.dataRaw, offset);
    if (headerTemp.signature !== FieldSignature.Header) throw new Error('First field in the TES4 record must have a HEDR signature!');

    console.debug('Got header:', headerTemp);

    let authorField: BGSDataContainer<FieldSignature.Author> | undefined;
    let descriptionField: BGSDataContainer<FieldSignature.Description> | undefined;
    let masterFields: BGSDataContainer<FieldSignature.Master>[] = [];

    while (true) {
        let next: BGSDataContainer;

        if (offset >= head.dataRaw.length) break;

        [next, offset] = getNextItemsAndDataFromData(head.dataRaw, offset);
        console.debug('Got next item:', next);
        if (next.signature === FieldSignature.Author) authorField = next;
        else if (next.signature === FieldSignature.Description) descriptionField = next;
        else if (next.signature === FieldSignature.Master) masterFields.push(next);
        else if (next.signature === FieldSignature.Data) continue;
        else break;
    }

    const returnVal: PluginMetadata = {
        author: decodeString(authorField?.dataRaw),
        description: decodeString(descriptionField?.dataRaw),
        masters: masterFields.map(field => decodeString(field.dataRaw)),
    };

    console.debug('Parsed plugin metadata:', { returnVal, authorField, descriptionField, masterFields });

    return returnVal;
}

function decodeString<TInput extends Uint8Array|undefined = undefined>(data?: TInput): (TInput extends undefined ? undefined : never) | (TInput extends Uint8Array ? string : never) {
    // @ts-ignore: The logic is valid; TypeScript just doesn't get it
    if (!data) return undefined;
    // @ts-ignore: The logic is valid; TypeScript just doesn't get it
    return new TextDecoder().decode(data.slice(0, -1)).replace(/\r\n?/g, '\n');
}
