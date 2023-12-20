'use client';

import React from 'react';
import { useFomod } from '@/app/loaders';
import { produce } from 'immer';
import { defaultSettings, useSettings } from '../components/SettingsContext';
import ToggleSwitch from '../components/toggle-switch';
import { T } from '../localization';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { DynamicWidthInputWidthSharer } from '../components/dynamic-width-input';

export default function EntangledNameEditor({InputComponent}: {InputComponent: React.ComponentType<{value: string, id: string, onChange: (newValue: string)=>unknown}>}){
    const {loader, eventTarget} = useFomod();

    const settings = useSettings() ?? defaultSettings;

    const [reRenderRef, reRender_] = React.useState({});
    React.useEffect(() => {
        const reRender = () => {
            reRender_({});
        };

        eventTarget.addEventListener('info-update', reRender);
        eventTarget.addEventListener('module-update', reRender);
        return () => {
            eventTarget.removeEventListener('info-update', reRender);
            eventTarget.removeEventListener('module-update', reRender);
        };
    }, [eventTarget]);

    const editName = React.useCallback((value: string, isModule = true) => {
        if (!loader) return console.error('Tried to change name with no loader! (this should not be possible)');

        const treatAsEntangled = settings.namesAreEntangled && (loader.info.data.Name && loader.module.moduleName === loader.info.data.Name);

        if (isModule || treatAsEntangled) loader.module = produce(loader.module, draft => {
            draft.moduleName = value;
        });

        if (!isModule || treatAsEntangled) loader.info = produce(loader.info, draft => {
            draft.data.Name = value || undefined;
        });
    }, [loader, settings]);

    const setNamesEntangled = React.useCallback((value: boolean) => {
        settings.update('namesAreEntangled', value);
    }, [settings]);

    const topInputID = React.useId();
    const bottomInputID = React.useId();

    if (!loader) return null;


    const treatAsEntangled = settings.namesAreEntangled && (loader.module.moduleName === (loader.info.data.Name ?? ''));

    return <DynamicWidthInputWidthSharer><table>
    {!treatAsEntangled && <tr>
        <td><label htmlFor={bottomInputID}>
            <T tkey='builder_info_name' params={[loader.info.data.Name]} />
        </label></td>

        <td><InputComponent value={loader.info.data.Name || ''} id={bottomInputID} onChange={v => editName(v, false)} /></td>

        <td aria-hidden style={{opacity: 0}}>filler</td>
    </tr> || <tr style={{height: 37.292}}><br style={{height: 37.292}} /></tr>}
        <tr>
            <td><label htmlFor={topInputID}>{!treatAsEntangled
                ? <T tkey='builder_module_name' params={[loader.module.moduleName]} />
                : <T tkey='builder_module_name_entangled' params={[loader.module.moduleName, loader.info.data.Name]} />
            }</label></td>

            <td><InputComponent value={loader.module.moduleName} id={topInputID} onChange={v => editName(v, true)} /></td>

            <td><label style={{flexDirection: 'row'}}>
                <FontAwesomeIcon icon={faLink} />
                <ToggleSwitch value={settings.namesAreEntangled} onChange={setNamesEntangled} />
            </label></td>

        </tr>
    </table>

    {settings.namesAreEntangled && !treatAsEntangled &&
        <span>
            <T tkey='builder_module_name_conflict_warning' />
        </span>
    }
    </DynamicWidthInputWidthSharer>;
}
