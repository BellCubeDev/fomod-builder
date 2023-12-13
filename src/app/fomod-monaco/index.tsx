'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from 'react';

// A sort of cache so we don't have to run that dreaded 1.5-second delay EVERY SINGLE TIME the tab is revealed
let editor: ReturnType<Awaited<typeof FomodMonacoEditorDynamicImport>> | null = null;
const editorLoadedEventEmitter = new EventTarget();

const FomodMonacoEditorDynamicImport = dynamic(() => import('./client/DynamicallyImportedEditor').then((res=> {
    editorLoadedEventEmitter.dispatchEvent(new Event('editorLoaded'));
    return res;
})), {
    ssr: false,

    loading(loadingProps) {
        if (loadingProps.error) return <pre><code>
            {loadingProps.error.stack}
        </code></pre>;

        if (loadingProps.timedOut) loadingProps.retry?.();

        if (loadingProps.isLoading) return <p>Loading Monaco editor...</p>;

        return <p>Loading Monaco editor... (UNKNOWN STATE)</p>;
    },
}) as React.FunctionComponent;


async function FomodMonacoEditorDynamicImportDelayed() {
    await new Promise(resolve => setTimeout(resolve, 1500));
    editor = <FomodMonacoEditorDynamicImport />;
    return editor!;
}

export default function FomodMonacoEditor({onEditorLoaded}: {onEditorLoaded?: () => unknown}) {
    React.useEffect(() => {
        if (!onEditorLoaded) return;

        editorLoadedEventEmitter.addEventListener('editorLoaded', onEditorLoaded);
        return () => editorLoadedEventEmitter.removeEventListener('editorLoaded', onEditorLoaded);
    }, [onEditorLoaded]);

    editor ||= FomodMonacoEditorDynamicImportDelayed();
    return <Suspense>
        {editor}
    </Suspense>;
}
