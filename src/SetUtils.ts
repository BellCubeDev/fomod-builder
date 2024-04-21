/** Replaces a particular index in a set by its index. Edits the set in-place for compatibility with Immer. */
export function editSetByIndex<T>(set: Set<T>, index: number, value: T) {
    if (index < 0 || index >= set.size) throw new RangeError(`Index ${index} is out of range for set of size ${set.size}`);

    const array = Array.from(set);
    array[index] = value;
}

/** Moves an item to a new index in a set. Edits the set in-place for compatibility with Immer. */
export function moveSetItem<T>(set: Set<T>, fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= set.size) throw new RangeError(`Index ${fromIndex} is out of range for set of size ${set.size}`);
    if (toIndex < 0 || toIndex >= set.size) throw new RangeError(`Index ${toIndex} is out of range for set of size ${set.size}`);
    if (set.size === 1) return;

    const array = Array.from(set);
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]!);
}
