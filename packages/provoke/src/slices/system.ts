import { StateCreator } from 'zustand';


import { getSameOptions, ICommonOption, ISystemConfig, mchcConstant, TLevelType } from '@lm_fe/env';
import { IMchc_Dictionaries, IMchc_Dictionaries_Enumeration, IMchc_HighriskGradeConfig, SMchc_Common } from '@lm_fe/service';
import { uniqBy } from 'lodash';
import { ReactNode } from 'react';
import { calc_theme, default_primary, save_config, write_preset_options_to_dics } from 'src/utils';
import { MixState, THEME } from '../types';
import { merge_dict, objectify } from '@lm_fe/utils';



export interface PanesItem {
    label: string;
    element?: React.ReactNode | null;
    closable: boolean;
    path: string;
}
export interface MenusItem {
    label: string;
    key: string;
    icon?: ReactNode;
    children?: MenusItem[];
}

export interface SystemState {
    config: Partial<ISystemConfig>
    update_config: (submit: Partial<IMchc_Dictionaries>) => Promise<ISystemConfig>;
    fetch_sys_config: () => Promise<ISystemConfig>;
    sys_theme: THEME
    sys_layout: { collapsed?: boolean },
    dict: IMchc_Dictionaries[];
    dict_map: { [x: string]: IMchc_Dictionaries }
    当前高危版本?: IMchc_Dictionaries_Enumeration
    可选高危等级?: IMchc_HighriskGradeConfig[]
    可选传染病?: { color: string, options: ICommonOption[] }
    可选高危版本?: IMchc_Dictionaries_Enumeration[]


    activeKey: string;
    is_init: boolean;
    setActiveKey: (key: string) => void;
    panes: PanesItem[];
    setPanes: (panes: PanesItem[]) => void;
    menus: MenusItem[];
    setMenus: (menus: MenusItem[]) => void;
    workspaces: { label: string; code: string }[];
    setWorkspaces: (workspaces: { label: string; code: string }[]) => void;
    activeWorkspace: string;
    setActiveWorkspace: (workspace: string) => void;
    removeTab: (targetKey: string, callbackFun?: () => void) => void;
    addTab: (pane: PanesItem) => void;
    addTabUtil: (pane_key: string) => void;
    openKeys: React.Key[];
    setOpenKeys: (openKeys: React.Key[]) => void;
    selectedKeys: string[];
    setSelectedKeys: (selectedKeys: string[]) => void;
    toggle_collapsed(): void
}




export const createTabsSlice: StateCreator<MixState, [], [], SystemState> = set => {
    // console.log('pathname', window.location.pathname);
    return {
        sys_layout: {},
        config: { systemName: '智慧妇幼系统' },
        dict: [],
        dict_map: {},
        sys_theme: calc_theme({ colorPrimary: default_primary, colorBorder: '#dfdfdf' }),
        activeKey: '/',
        is_init: false,
        setActiveKey: (key) => set({ activeKey: key }),
        panes: [
            {
                label: '首页',
                i18nKey: 'home',
                key: '/',
                content: null,
                closable: false,
                path: '/',
            },
        ],
        setPanes: (panes) => set({ panes }),
        menus: [],
        setMenus: (menus) => set({ menus }),// 撼地神牛是
        workspaces: [
            { label: '默认工作区', code: 'default' },
            { label: '测试工作区', code: 'test' },
        ],
        setWorkspaces: (workspaces) => set({ workspaces }),
        activeWorkspace: 'default',
        setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
        removeTab: (targetKey, callbackFun) => {
            set((state) => {
                const delIndex = state.panes.findIndex((item) => item.path === targetKey);
                const filterPanes = state.panes.filter((pane) => pane.path !== targetKey);
                // 删除非当前/当前tab
                if (targetKey !== state.activeKey) {
                    return { panes: filterPanes };
                }
                const nextPath = filterPanes[delIndex - 1]?.path || '/';

                return { activeKey: nextPath, panes: filterPanes, };
            });
            callbackFun?.();
        },
        addTab: (pane) => {
            set((state) => {
                const tmp = [...state.panes, pane];
                const newPanes = uniqBy(tmp, 'key');
                return { panes: newPanes, activeKey: pane.path };
            });
        },
        addTabUtil(pane_key) {

            //
            const route = null;
            set((state) => {
                const per = state.permissions[pane_key]!
                if (state.panes.some(p => p.path === pane_key)) {
                    return { activeKey: pane_key, is_init: true };
                }
                const tmp = [...state.panes, {
                    label: per?.name ?? pane_key,
                    element: route,
                    closable: pane_key !== '/',
                    path: pane_key,
                }];
                const newPanes = uniqBy(tmp, 'path');
                return { panes: newPanes, activeKey: pane_key, is_init: true };
            });
        },
        openKeys: [],
        setOpenKeys: (openKeys) => set({ openKeys }),
        selectedKeys: ['/'],
        setSelectedKeys: (selectedKeys) => set({ selectedKeys }),



        async fetch_sys_config() {
            const _dics = await SMchc_Common.fk_dics()

            const dict = _dics.map(_ => ({ ..._, uniqueKey: `${_.module}.${_.key}` }))
            const dict_map = objectify(dict, _ => _.uniqueKey)
            write_preset_options_to_dics(dict_map)
            const config = SMchc_Common.format_dic_to_system_config(dict_map['System.config'])
            merge_dict(dict_map)

            const hr_dics = dict.filter(_ => _.module === 'Highrisk')
            const 可选高危版本 = hr_dics.find(_ => _.key === 'highriskVersion')?.enumerations ?? []

            let version = config.highriskVersion


            set(s => {
                const _state = save_config(s, config)

                if (version) {
                    const enums1 = hr_dics.find(_ => _.type === version && _.key === 'highriskGrade')?.enumerations ?? []

                    _state.可选高危等级 = enums1.map(_ => {
                        return { ..._, color: _.note!, levelText: _.label!, colorText: mchcConstant.get_level_color_text(version, _.label as TLevelType) }
                    })

                    const enums2 = hr_dics.find(_ => _.type === version && _.key === 'highriskContagion')?.enumerations?.[0]

                    const 传染病_options = getSameOptions(enums2?.label ?? '未知')
                    传染病_options.unshift({ label: '无', value: '无', exclusive: true }, { label: '未查', value: '未查', exclusive: true })
                    _state.可选传染病 = { color: enums2?.note ?? 'red', options: 传染病_options }

                    _state.当前高危版本 = 可选高危版本?.find(_ => _.value === version)
                }

                return Object.assign(_state, { dict, dict_map, 可选高危版本 })
            })

            return config

        },
        async update_config(submit: Partial<IMchc_Dictionaries>,) {
            const config = await SMchc_Common.update_system_config(submit)
            set(s => save_config(s, config))
            return config
        },

        toggle_collapsed() {
            set(s => {
                const sys_layout = { ...s.sys_layout, collapsed: !s.sys_layout.collapsed }
                return { sys_layout }
            })

        },

    }
};
