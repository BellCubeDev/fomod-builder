'use client';

import React from 'react';

import { Tab } from ".";

import styles from './builder.module.scss';
import FomodEditor from '@/app/fomod-parts/builder';
import VortexFomodEditor from '@/app/fomod-parts/vortex';
import MO2FomodEditor from '@/app/fomod-parts/mo2';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubesStacked } from "@fortawesome/free-solid-svg-icons";


const tab: Tab = {
    name: 'tab_step_builder',

    Page() {
        const [editorChoice, chooseEditor] = React.useState<'builder'|'vortex'|'mo2'>('builder');

        return <div className={styles.wrapper}>
            <div className={styles.buttons}>
                <button className={`${styles.button} ${styles.buttonVortex}`} aria-pressed={editorChoice === 'vortex'} onClick={() => chooseEditor('vortex')}>Vortex</button>
                <button className={`${styles.button} ${styles.buttonMO2}`} aria-pressed={editorChoice === 'mo2'} onClick={() => chooseEditor('mo2')}>Mod Organizer 2</button>
                <button className={`${styles.button} ${styles.buttonBuilder}`} aria-pressed={editorChoice === 'builder'} onClick={() => chooseEditor('builder')}>Builder</button>
            </div>

            {
                editorChoice === 'builder' ? <FomodEditor />
                : editorChoice === 'vortex' ? <VortexFomodEditor />
                : editorChoice === 'mo2' ? <MO2FomodEditor />
                : 'ERROR: Invalid editor choice!'
            }

        </div>;
    },

    disabled: ({fomod: loader}) => !loader.loader,

    icon: <FontAwesomeIcon icon={faCubesStacked} />
};

export default tab;
