'use client';

import React from 'react';
import { Draft, produce, freeze, current, isDraft } from '@/immer';
import { T } from '../../localization/index';
import ScaleInDiv from './ScaleInDiv';
import DeleteButton from '@/app/components/DeleteButton';
import styles from './builder.module.scss';
import { editSetByIndex } from '@/SetUtils';
import { resolveRecursiveDrafts } from '@/SetUtils';
import { useFomod } from '../../loaders/index';
import { XmlRepresentation } from 'fomod/dist/definitions/lib/XmlRepresentation';

function tryMutation(f: () => unknown) {
    try {
        return f();
    } catch (e) {
        console.error('Error while mutating child', e);
        throw e;
    }
}

function tryCallingEdit(f: () => unknown) {
    try {
        return f();
    } catch (e) {
        console.error('Error while calling the edit function provided by the parent element', e);
        throw e;
    }
}

export default function BuilderChildren<
    TTypeString extends ValidTypeString,
    TParentInstance extends {},
    TChildInstance extends XmlRepresentation<boolean> & {name: string},
> ({ children, className, type, edit, childKey, createChildClass, ChildComponent, showAll }: {
    children: TrueImmutable<Set<TChildInstance>>,
    className?: string,
    type: TTypeString,
    edit: (recipe: (draft: TrueDraft<TParentInstance>) => Draft<TParentInstance> | undefined | void) => void,
    childKey: KeyForType<TrueImmutable<TParentInstance>, TrueImmutable<Set<TChildInstance>>>,
    createChildClass: () => Draft<TChildInstance>,
    ChildComponent: (params: {[T in TTypeString]: TrueImmutable<TChildInstance>} & { edit: (recipe: (draft: TrueDraft<TChildInstance>) => Draft<TChildInstance> | undefined | void) => void}) => JSX.Element,
    showAll?: boolean;
}) {
    const {loader} = useFomod();

    const addChild = React.useCallback(() => {
        tryCallingEdit(()=> edit(draft => {
            const set = draft[childKey] as TrueDraft<Set<TChildInstance>>;

            set.add(createChildClass());
            resolveRecursiveDrafts(set);
        }));
    }, [createChildClass, childKey, edit]);

    const childArr = Array.from(children.values());

    const [selectedChildNum, setSelectedChildNum] = React.useState(0);

    React.useEffect(() => {
        if (selectedChildNum >= childArr.length) setSelectedChildNum(0);
    }, [childArr.length, selectedChildNum]);

    const editToBeBound = function editChild(i: number, recipe: (draft: Draft<TChildInstance>) => Draft<TChildInstance> | undefined | void) {
        tryCallingEdit(()=> edit(draft => {
            const set = draft[childKey] as TrueDraft<Set<TChildInstance>>;

            const thisChild = Array.from(set.values())[i];
            if (!thisChild) throw new Error(`Tried to edit child (${type}) ${i} in a ${set.size}-item set`);

            editSetByIndex(set, i, tryMutation(()=> produce(thisChild, recipe) ));
        }));
    };

    const deleteToBeBound = function deleteChild(i: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //console.log('delete', i, childArr);
        if (i >= childArr.length) return;

        event.preventDefault();
        event.stopPropagation();

        if (!event.shiftKey) {
            // TODO: Show "Are you sure?" dialog
        }

        if (i <= selectedChildNum) setSelectedChildNum(selectedChildNum - 1 < 0 ? 0 : selectedChildNum - 1);

        tryCallingEdit(()=> edit(draft => {
            const set = draft[childKey] as TrueDraft<Set<TChildInstance>>;
            const thisChild = Array.from(set.values())[i]!;
            //console.log({[childKey]: set, i, thisChild, hasIt: set.has(thisChild)});
            set.delete(thisChild);

            if (loader) {
                if (loader.moduleDoc) {
                    thisChild.decommission?.(loader.moduleDoc);
                    thisChild.getElementForDocument?.(loader.moduleDoc)?.remove();
                }
                if (loader.infoDoc) {
                    thisChild.decommission?.(loader.infoDoc);
                    thisChild.getElementForDocument?.(loader.infoDoc)?.remove();
                }
            }

            resolveRecursiveDrafts(set);
        }));
    };

    if (showAll) return <div className={`${className} ${styles.wrapperAll}`}>
        {childArr.length ? childArr.map(
            (child, i) => <div key={i} id={`builder-${type}-${i+1}`}>
                <ChildComponent
                    {...{[type as TTypeString]: child as TrueImmutable<TChildInstance>} as {[T in TTypeString]: TrueImmutable<TChildInstance>}}
                    edit={editToBeBound.bind(undefined, i)}
                />
                <DeleteButton onActivation={deleteToBeBound.bind(undefined, i)} className={styles.deleteButton} disabled={type !== 'step' && childArr.length < 2} />
            </div>
        ) : <T tkey={`${type}s_no_${type}s` as TypesNoTypesStrings} />}
        <button key={childArr?.length} onClick={addChild} className={styles.addButton}>
            <T tkey={`${type as ValidTypeString}_add_button`} />
        </button>
    </div>;

    return <div className={className}>
        <div className={styles.childSelector} role='tablist'>
            <div className={styles.childSelectorButtonsBG}>
                <div className={styles.buttons} >
                    {childArr.length ? childArr.map(
                        (child, i) => <ScaleInDiv key={i} className={styles.childButtonWrapper}>
                            <button onClick={(e) => setSelectedChildNum(i) } role='tab' aria-selected={i === selectedChildNum} aria-controls={`builder-step-${i+1}`} className={styles.childButton} >
                                <T tkey={`${type as ValidTypeString}_button`} params={[child.name]} />
                            </button>
                            <DeleteButton onActivation={deleteToBeBound.bind(undefined, i)} className={styles.deleteButton} disabled={type !== 'step' && childArr.length < 2} />
                        </ScaleInDiv>
                    ) : <T tkey={`${type}s_no_${type}s` as TypesNoTypesStrings} />}
                </div>
            </div>
            <button key={childArr?.length} onClick={addChild} className={styles.addButton}>
                <T tkey={`${type as ValidTypeString}_add_button`} />
            </button>
        </div>

        <div className={styles.body} role='tabpanel' id={`builder-${type}-${selectedChildNum+1}`}>
            {!childArr[selectedChildNum] ? null :
                <ChildComponent
                    {...{[type as TTypeString]: childArr[selectedChildNum] as TrueImmutable<TChildInstance>} as {[T in TTypeString]: TrueImmutable<TChildInstance>}}
                    edit={editToBeBound.bind(undefined, selectedChildNum)}
                />
            }
        </div>
    </div>;
}

type TypesNoTypesStrings = {[T in ValidTypeString]: `${T}s_no_${T}s`}[ValidTypeString];
