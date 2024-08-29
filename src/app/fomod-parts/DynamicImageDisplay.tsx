import React from 'react';
import { useFomod } from '../loaders/index';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

export default function DynamicImageDisplay({ path, ...props }: {path: string | null, alt: string} & Omit<React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement & SVGSVGElement>, HTMLImageElement & SVGSVGElement>, 'src'>) {
    const {loader} = useFomod();
    const [src, setSrc] = React.useState<string>('');

    React.useEffect(() => {
        if (!loader) return setSrc('');
        let canceled = false;

        if (!path) return setSrc('');

        let newSrc: string | undefined;

        (async () => {
            const loadedFile = await loader?.getFileByPath(path);

            if (canceled || !loadedFile) return setSrc('');

            newSrc = URL.createObjectURL(loadedFile);

            if (canceled) return setSrc('');

            if (src) URL.revokeObjectURL(src);
            setSrc(newSrc);
        })();

        return () => {
            canceled = true;
            // TODO: See if there's a more performant way to handle component unloads while keeping the release when the source changes
            //       rather than relying on browser-specific caching
            if (newSrc) URL.revokeObjectURL(newSrc);
            if (src) URL.revokeObjectURL(src);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we don't want to rerun every time the `src` changes
    }, [loader, path]);

    if (!src) return <FontAwesomeIcon icon={faImage} {...props} />;

    // eslint-disable-next-line jsx-a11y/alt-text -- Covered by `props` which require an `alt` prop
    return <img src={src} {...props} />;
}
