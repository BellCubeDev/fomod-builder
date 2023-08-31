import dynamic from "next/dynamic";
import { Suspense } from "react";
import React from 'react';

const FomodMonacoEditorDynamicImport = dynamic(() => import('./DynamicallyImportedEditor'), {
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

// A sort of cache so we don't have to run that dreaded 1.5-second delay EVERY SINGLE TIME the tab is revealed
let editor: ReturnType<Awaited<typeof FomodMonacoEditorDynamicImport>> | null = null;

async function FomodMonacoEditorDynamicImportDelayed() {
    editor = <FomodMonacoEditorDynamicImport />;
    return editor!;
}

export default function FomodMonacoEditor() {
    if (editor) return editor;
    return <Suspense fallback={<p>Hold on while more important parts of the Fomod Builder are loaded first...</p>}>
        <FomodMonacoEditorDynamicImportDelayed />
    </Suspense>;
}