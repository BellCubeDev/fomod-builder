import React from 'react';
import { useFomod } from '../loaders/index';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

function fileToDataURI(file: File) {
    return new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            resolve(reader.result as string);
        });
        reader.readAsDataURL(file);
    });
}

export default function DynamicImageDisplay({ path, ...props }: {path: string | null, alt: string} & Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, 'src'>) {
    const {loader} = useFomod();
    const [src, setSrc] = React.useState<string>('');

    React.useEffect(() => {
        if (!loader) return;
        let canceled = false;

        setSrc('');

        if (!path) return;

        (async () => {
            const loadedFile = await loader?.getFileByPath(path);;
            if (canceled || !loadedFile) return;
            const blob = await fileToDataURI(loadedFile);
            if (canceled) return;
            setSrc(blob);
        })();

        return () => { canceled = true; };
    }, [loader, path]);

    if (!src) return <FontAwesomeIcon icon={faImage} />;

    // eslint-disable-next-line jsx-a11y/alt-text -- Covered by `props`
    return <img src={src} {...props} />;
}
