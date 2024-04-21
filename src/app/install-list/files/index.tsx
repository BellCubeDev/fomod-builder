'use client';

import { Install } from "fomod";
import React from "react";
import { createFileTree, FileTreeFactory, Dir, pathFx, FileTreeNode, useNode, Node } from 'exploration';

// Take inspiration from https://codesandbox.io/p/sandbox/basic-example-p1udcm?file=%2Fsrc%2FApp.tsx

export function FomodFileExplorer({installs}: {installs: Set<Install<false>> | Install<false>[], edit: (install: Install<false>[]) => unknown}) {

    const sourceDestinationMap = React.useMemo(() => {
        const sourceDestinationMap = new Map<string, {destination: string|null, install: Install<false>}>();

        for (const install of installs) {
            const source = pathFx.normalize(install.fileSource);
            const destination = install.fileDestination ? pathFx.normalize(install.fileDestination) : install.fileDestination;

            sourceDestinationMap.set(source, { destination, install });
        }

        return sourceDestinationMap;
    }, [installs]);

    const tree = createFileTree<Install<false>>(function getNodes(parentDir, factory): FileTreeNode<Install<false>>[]{
        const nodes: FileTreeNode<Install<false>>[] = [];

        const installs = Array.from(sourceDestinationMap.entries()).filter(([source, {destination}]) => {
            return source.startsWith(parentDir.path);
        });

        for (const [source, {destination, install}] of installs) {
            if (source.endsWith('/')) {
                nodes.push(factory.createDir({
                    name: source,
                    meta: install,
                }));

            } else {
                nodes.push(factory.createFile({
                    name: source,
                    meta: install,
                }));
            }
        }

        return nodes;
    }, {
        root: {
            name: '/',
            meta: undefined,
        }
    });




    return <div>
        <Node tree={tree} node={tree.root} index={0} style={{}}>
            {null}
        </Node>
    </div>;
}
