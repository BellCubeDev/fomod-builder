/** Replaces a particular index in a set by its index. Edits the set in-place for compatibility with Immer.
 *
 * Automatically resolves recursive drafts.
 * @see resolveRecursiveDrafts
*/
export function editSetByIndex<T>(set: Set<T>, index: number, value: T) {
    if (index < 0 || index >= set.size) throw new RangeError(`Index ${index} is out of range for set of size ${set.size}`);

    const array = Array.from(set);
    array[index] = value;

    set.clear();
    array.forEach(item => {
        while (isDraft(item)) item = current(item);
        set.add(item);
    });
}

/** Moves an item to a new index in a set. Edits the set in-place for compatibility with Immer.
 *
 * Automatically resolves recursive drafts.
 * @see resolveRecursiveDrafts
*/
export function moveSetItem<T>(set: Set<T>, fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= set.size) throw new RangeError(`Index ${fromIndex} is out of range for set of size ${set.size}`);
    if (toIndex < 0 || toIndex >= set.size) throw new RangeError(`Index ${toIndex} is out of range for set of size ${set.size}`);
    if (set.size === 1) return;

    const array = Array.from(set);
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]!);

    set.clear();
    array.forEach(item => {
        while (isDraft(item)) item = current(item);
        set.add(item);
    });
}

import { isDraft, current, Draft } from 'immer';

/** Resolves accidental recursive drafts created by some witchcraft with immer. Edits the set in-place for compatibility with Immer. */
export function resolveRecursiveDrafts<T extends Draft<any>>(set: Set<T>): void {
    const array = Array.from(set);
    array.forEach((item, index) => {
        while (isDraft(item)) item = current(item);
        array[index] = item;
    });

    set.clear();
    array.forEach(item => set.add(item));
}
