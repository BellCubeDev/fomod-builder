'use client';

import { useFomod } from '../../loaders/index';
import BuilderStep from './step/step';
import { Immutable, produce, Draft } from 'immer';
import { Step, SortingOrder } from 'fomod';
import React from 'react';
import { useSettings } from '../../SettingsContext';
import { editSetByIndex } from '../../../../SetUtils';
import styles from './builder.module.scss';
import { T } from '../../localization/index';

export default function FomodEditor() {
    const {loader, eventTarget} = useFomod();

    const [,reRender_] = React.useState({});

    React.useEffect(() => {
        const reRender = () => {
            console.log('reRender'); // TODO: Figure out why this event won't fire
            reRender_({});
        };

        eventTarget.addEventListener('module-update', reRender);
        return () =>  eventTarget.removeEventListener('module-update', reRender);

    }, [eventTarget]);

    const setting = useSettings();

    const addStep = React.useCallback(() => {
        if (!loader) return;

        loader.module = produce(loader.module, draft => {
            draft.steps.add(new Step('', setting?.defaultGroupSortingOrder ?? SortingOrder.Explicit));
        });
    }, [loader, setting]);

    const steps = Array.from(loader?.module.steps.values() || []);

    const [stepNum, setStepNum] = React.useState(0);

    if (!loader) {
        if (stepNum) setStepNum(0);
        return null;
    }


    const editToBeBound = function editStep(i: number, recipe: (draft: Draft<Step>) => Step | undefined | void) {
        console.log('editToBeBound ' + i, steps[i]);

        loader.module = produce(loader.module, draft => {
            const thisStep = Array.from(draft.steps.values())[i];
            const recipeResult = produce(thisStep, recipe);
            editSetByIndex(draft.steps, i, recipeResult);
        });
    };

    return <div className={styles.builderBody}>
        <div className={styles.stepSelector} role='tablist'>
            {steps.map(
                (step, i) => <button key={i} onClick={() => setStepNum(i)} role='tab' aria-selected={i === stepNum} aria-controls={`builder-step-${i+1}`}>
                    <T tkey='step_button' params={[step.name]} />
                </button>
            )}
            <button key={steps?.length} onClick={addStep} className={styles.stepAddButton}>
                <T tkey='step_add_button' />
            </button>
        </div>

        <div className={styles.stepBody} role='tabpanel' id={`builder-step-${stepNum+1}`}>
            {!steps[stepNum] ? null : <BuilderStep step={steps[stepNum] as Immutable<Step>} edit={editToBeBound.bind(undefined, stepNum)} />}
        </div>
    </div>;
}
