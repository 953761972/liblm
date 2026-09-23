import { MyIcon, OkButton } from '@lm_fe/components_m';
import { mchcRouterContainer__ } from '@lm_fe/env';

import { use_provoke } from "@lm_fe/provoke";
import { IMchc_Permission } from "@lm_fe/service";
import { getSearchParamsAll, isObject, size } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react';
import { mchcModal__ } from 'src/modals';

export type Permission_With_Children = IMchc_Permission & { isLeaf?: boolean, children?: IMchc_Permission[], label?: string, extra?: any }

export function findIdsByChildId(data: any[], key: string) {
    let res: any[] = [];
    const findIds = (arr: any[], temp: any[] = []) => {
        for (const node of arr) {
            if (node.children?.length > 0) {
                // 判断是否有子级,有则继续递归
                findIds(node.children, temp.concat(node.key));
            } else {
                if (node.key === key) {
                    // 找到指定id,则返回递归列表
                    temp.push(key); // 若不需要返回已知的id，注释此段即可
                    res = temp;
                    return;
                }
            }
        }
    };
    findIds(data, []);
    return res;
}
export function transferMenus(menus: Permission_With_Children[], parentid = 0) {

    const temp: Permission_With_Children[] = [];
    menus
        .filter(_ => _.type === 'menu')
        .map((item, idx) => {

            const key = item.key
            item.label = item.name
            // item.icon = (item.parentid ? '' : <InsertRowLeftOutlined />) as any

            item.icon = (
                isObject(item.icon)
                    ? item.icon
                    : <MyIcon value={item.icon as any} />

            ) as any


            if (item.parentid === parentid) {
                const C = mchcRouterContainer__.get_addon_component(key)
                const new_data = {
                    ...item,
                    children: transferMenus(menus, item.id)
                }
                if (C) {
                    new_data.extra = <OkButton
                        type='text'
                        icon={<MyIcon value='EyeOutlined' />}
                        size='small'
                        onClick={async (e) => {
                            e.stopPropagation()

                            mchcModal__.open('modal_page', {
                                modal_data: {
                                    // content: <C />
                                    route_conf: { url: key, params: getSearchParamsAll() }
                                },
                                // onClose() {
                                //   mchcEnv.setGlobalCache('happy_conf', null)
                                // }
                            })
                        }} />
                }
                const isLeaf = size(new_data.children) === 0
                new_data.isLeaf = isLeaf
                temp.push(new_data);
            }
        });
    return temp.length ? temp.sort((a, b) => a.sort - b.sort) : undefined
};
export function use_perm_tree() {
    const { permissions, toggle_collapsed } = use_provoke('permissions', 'toggle_collapsed')

    const [permissions_tree, set_tree] = useState(transferMenus(Object.values(permissions)))



    useEffect(() => {

        set_tree(transferMenus(Object.values(permissions)))

        return () => {

        }
    }, [permissions])
    return { permissions_tree, permissions, toggle_collapsed }
}