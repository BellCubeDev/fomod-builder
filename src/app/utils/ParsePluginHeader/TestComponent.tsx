'use client';
import React from 'react';
import ParseModTES4RecordFromStream from '.';

export default function TestTes4StreamInput() {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [file, setFile] = React.useState<File | null>(null);

    const handleFileChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    }, [setFile]);

    React.useEffect(() => {
        if (!file) return;

        const originalStream = file.stream();
        const byteStream = new ReadableStream({
            type: 'bytes',
            async pull(controller) {
                const reader = originalStream.getReader();
                const { value, done } = await reader.read();
                if (done) {
                    controller.close();
                    return;
                }
                controller.enqueue(value);
                reader.releaseLock();
            },
            cancel(r) {
                originalStream.cancel(r);
            },
        });

        ParseModTES4RecordFromStream(byteStream).then(() => byteStream.cancel('Done reading TES4 record'));
    }, [file]);

    return <div>
        <input type="file" ref={inputRef} onChange={handleFileChange} />
        <button onClick={() => inputRef.current?.click()}>Select File</button>
    </div>;
}
