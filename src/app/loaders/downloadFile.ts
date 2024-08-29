let genericAnchor: HTMLAnchorElement | null = null;

export function downloadTextFile(text: string, filename: string, mimeType = 'text/plain') {
    const blob = new Blob([text], { type: mimeType });
    downloadFile(blob, filename);
}

export function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    genericAnchor ??= document.createElement('a');
    genericAnchor.href = url;
    genericAnchor.download = filename;
    genericAnchor.click();
    URL.revokeObjectURL(url);
}
