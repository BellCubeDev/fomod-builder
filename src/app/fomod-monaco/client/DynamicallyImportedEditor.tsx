'use client';
import 'client-only';

import React from 'react';
import type {editor} from 'monaco-editor';
import Monaco, {useMonaco} from '@monaco-editor/react';
import styles from './FomodMonacoEditor.module.scss';

import { useFomod } from '@/app/loaders';

import { SourceCodePro } from '../../SourceCodePro';
import { useMonacoData } from './MonacoDataContext';
import { applyXmlSchemasToMonaco } from './XmlSchemaCompletionProvider';

export default function FomodMonacoEditorForDynamicImportOnly() {

    const c = useFomod(true);
    const {theme, infoSchema, moduleSchema} = useMonacoData();
    if (!theme) throw new TypeError('You must define a theme for the Monaco editor!');
    if (!infoSchema) throw new TypeError('You must define an infoSchema for the Monaco editor!');
    if (!moduleSchema) throw new TypeError('You must define a moduleSchema for the Monaco editor!');

    const [isInfoMode, setInfoMode] = React.useState(true);

    const selectionIndicatorRef = React.useRef<HTMLDivElement>(null);
    const [selectedElement, setSelectedElement] = React.useState<HTMLElement | null>(null);

    const [selectionIndicatorWidth, setSelectionIndicatorWidth] = React.useState(0);
    const [selectionIndicatorOffsetLeft, setSelectionIndicatorOffsetLeft] = React.useState(0);

    const monaco = useMonaco();
    const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);

    const [currentTheme, setCurrentTheme] = React.useState<string>('vs-dark');

    React.useEffect(() => {
        if ( !selectionIndicatorRef.current || !selectedElement ) return;

        function getRatio(width: number) {
            return Math.log(width + 16) / Math.log(width / 2.3);
        }

        const width = selectedElement.offsetWidth;
        const ratio = getRatio(width);

        setSelectionIndicatorWidth(  width * ratio  );
        setSelectionIndicatorOffsetLeft(  selectedElement.offsetLeft + (width * (1 - ratio) / 2)  );
    }, [selectionIndicatorRef, selectedElement]);

    React.useEffect(() => {
        if (!monaco || !theme) return;
        monaco.editor.defineTheme('dark-modern', theme);
        monaco.editor.setTheme('dark-modern');
        setCurrentTheme('dark-modern');
    }, [monaco, currentTheme, theme] ); // `theme` is there as a sort of hack. Seems to fix the weird light theme before the next re-render

    if (!monaco) return <></>;

    if (theme) monaco?.editor.defineTheme('dark-modern', theme);
    monaco?.editor.setTheme(currentTheme);

    function handleNewEditor(editor: editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
        if (!monaco) return console.warn('No monaco or editor! Could not set XML schemas!');
        applyXmlSchemasToMonaco(monaco, editor, [infoSchema!, moduleSchema!]);
    }

    if (!c) return <>[[NO FOMOD LOADED]]</>;

    return <div className={styles.editorContainer}>
        <div className={styles.editorHeader}>
            <div className={styles.editorSelector}>
                <button className={`${styles.a} ${isInfoMode ? styles.selected : ''}`} onClick={(e) => {setInfoMode(true); setSelectedElement(e.currentTarget);}}>Info.xml</button>
                <button className={`${styles.a} ${isInfoMode ? '' : styles.selected}`} onClick={(e) => {setInfoMode(false); setSelectedElement(e.currentTarget);}}>ModuleConfig.xml</button>
                <div className={styles.selectionIndicator} ref={selectionIndicatorRef} style={{left: selectionIndicatorOffsetLeft, width: selectionIndicatorWidth}} />
            </div>
        </div>

        <Monaco
            className={styles.infoEditor}
            language='xml'
            path= {isInfoMode ? 'Info.xml' : 'ModuleConfig.xml'}
            value= { isInfoMode ? c.loader.infoText : c.loader.moduleText }
            onChange={ (value, e) => {
                if (!value) throw new TypeError('How is there no value?!!');// return;

                if (isInfoMode) c.loader.infoText = value;
                else c.loader.moduleText = value;
            }}
            onMount={handleNewEditor}
            options={{
                fontFamily: SourceCodePro.style.fontFamily,
                fontSize: 13,
                fontLigatures: true,
                fontWeight: '400',
                theme: currentTheme,
                minimap: {
                    enabled: true,
                    autohide: true,
                },
                padding: {
                    bottom: 0,
                    top: 16,
                },
                wordWrap: 'on',
                wrappingIndent: 'indent',
                extraEditorClassName: styles.editor,
                //model: monaco?.editor.createModel()
            }}
        />
    </div>;
}