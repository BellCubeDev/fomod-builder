'use client';

import React from 'react';

import { Tab } from ".";

import styles from './metadata.module.scss';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";


const tab: Tab = {
    name: 'tab_metadata',

    Page() {
        return <>
            Pardon our dust! This page is still under construction.
        </>;
    },

    disabled: ({fomod: loader}) => !loader.loader,

    icon: <FontAwesomeIcon icon={faPenToSquare} />
};

export default tab;
