/** Replaces a particular index in a set by its index. Edits the set in-place for compatibility with Immer. */
export function editSetByIndex<T>(set: Set<T>, index: number, value: T) {
    if (index < 0 || index >= set.size) throw new RangeError(`Index ${index} is out of range for set of size ${set.size}`);

    const array = Array.from(set);
    array[index] = value;

    set.clear();
    array.forEach(item => set.add(item));
}
