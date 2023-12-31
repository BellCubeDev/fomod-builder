'use client';

import ToggleSwitch from '../../components/toggle-switch/index';
import { useSettings } from '../../components/SettingsContext';
import { T } from '../../localization/index';
import styles from './settingsGrid.module.scss';
import SortingOrderDropdown from '../../fomod-parts/builder/SortingOrderDropdown';
import { SortingOrder, GroupBehaviorType, OptionType } from 'fomod';
import { GroupBehaviorDropdown, GroupBehaviorTypes } from '../../fomod-parts/builder/group';
import { OptionBehaviorDropdown, OptionBehaviorTypes } from '../../fomod-parts/builder/option/index';
import DynamicWidthInput from '@/app/components/dynamic-width-input';

export function SettingsPage() {
    const s = useSettings();
    if (!s) return null;

    return <>
        <h1><T tkey='tab_settings_header' /></h1>
        <T tkey='tab_settings_note' />

        <br /><br />

        <table className={styles.grid}>
            <tr>
                <td><T tkey='setting_reducedMotion' params={[s.reducedMotion]} /></td>
                <td><ToggleSwitch value={s.reducedMotion} onChange={(v) => {s.update('reducedMotion', v);}} /></td>
            </tr>

            <tr><td><br /></td></tr>

            <tr>
                <td><T tkey='setting_autoSave' params={[s.autoSave]} /></td>
                <td><ToggleSwitch value={s.autoSave} onChange={(v) => {s.update('autoSave', v);}} /></td>
            </tr>
            <tr>
                <td><T tkey='setting_autoSaveInterval' params={[s.autoSaveInterval]} /></td>
                <td><DynamicWidthInput type='number' value={s.autoSaveInterval} onChange={(v) => {  s.update('autoSaveInterval', parseFloat(v));  }} style={{maxWidth: 376}} /></td>
            </tr>

            <tr><td><br /></td></tr>

            <tr>
                <td><T tkey='setting_defaultGroupBehavior' params={[s.defaultGroupBehavior]} /></td>
                <td><GroupBehaviorDropdown value={s.defaultGroupBehavior} onChange={(v) => {
                    if (!v || !GroupBehaviorTypes.includes(v as any)) return;
                    s.update('defaultGroupBehavior', v as GroupBehaviorType);
                }} /></td>
            </tr>
            <tr>
                <td><T tkey='setting_defaultOptionType' params={[s.defaultOptionType]} /></td>
                <td><OptionBehaviorDropdown value={s.defaultOptionType} onChange={(v) => {
                    if (!v || !OptionBehaviorTypes.includes(v as any)) return;
                    s.update('defaultOptionType', v as OptionType);
                }} /></td>
            </tr>

            <tr><td><br /></td></tr>

            <tr>
                <td><T tkey='setting_defaultStepSortingOrder' params={[s.defaultStepSortingOrder]} /></td>
                <td><SortingOrderDropdown value={s.defaultStepSortingOrder} onChange={(v) => {
                    if (!v || !(v in SortingOrder)) return;
                    s.update('defaultStepSortingOrder', v as SortingOrder);
                }} /></td>
            </tr>
            <tr>
                <td><T tkey='setting_defaultGroupSortingOrder' params={[s.defaultGroupSortingOrder]} /></td>
                <td><SortingOrderDropdown value={s.defaultGroupSortingOrder} onChange={(v) => {
                    if (!v || !(v in SortingOrder)) return;
                    s.update('defaultGroupSortingOrder', v as SortingOrder);
                }} /></td>
            </tr>
            <tr>
                <td><T tkey='setting_defaultOptionSortingOrder' params={[s.defaultOptionSortingOrder]} /></td>
                <td><SortingOrderDropdown value={s.defaultOptionSortingOrder} onChange={(v) => {
                    if (!v || !(v in SortingOrder)) return;
                    s.update('defaultOptionSortingOrder', v as SortingOrder);
                }} /></td>
            </tr>


        </table>
    </>;
}
