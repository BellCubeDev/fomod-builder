import dynamic from "next/dynamic";
import { Suspense } from "react";

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
});

// A sort of cache so we don't have to run that dreaded 2-second delay EVERY SINGLE TIME the tab is revealed
let editor: Awaited<ReturnType<typeof FomodMonacoEditorDynamicImportDelayed>> | null = null;

async function FomodMonacoEditorDynamicImportDelayed() {
    await new Promise((r,) => setTimeout(r, 2000));
    editor = <FomodMonacoEditorDynamicImport />;
    return <FomodMonacoEditorDynamicImport />;
}

export default function FomodMonacoEditor() {
    if (editor) return editor;
    return <Suspense fallback={<p>Hold on while more important parts of the Fomod Builder are loaded first...</p>}>
        <FomodMonacoEditorDynamicImportDelayed />
    </Suspense>;
}