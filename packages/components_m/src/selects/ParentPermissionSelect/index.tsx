import React, { useState, useEffect } from 'react';
import { get, map, omit } from 'lodash';
import { request } from '@lm_fe/utils';
import { DataNode } from 'antd/lib/tree';

import { mchcLogger } from '@lm_fe/env';
import { TreeSelect, TreeSelectProps } from 'antd';
import { IMchc_Permission } from '@lm_fe/service';

type EExtendPermission = IMchc_Permission & { title: string, value: number, children: EExtendPermission[] }
interface IProps extends TreeSelectProps {
  url?: string
  pid_key?: string
  title_key?: string
  value_key?: string
  id_key?: string
}
export default (props: IProps) => {
  const { url = '/api/permissions?type.equals=menu&size=500', pid_key = 'parentid', title_key = 'name', value_key = 'id' } = props
  const id_key = props.id_key || value_key
  const [menus, setMenus] = useState<DataNode[]>([]);

  const transferMenus = (menus: EExtendPermission[], parentid = 0) => {
    const temp: any = [];
    map(menus, (item) => {
      if (get(item, pid_key) === parentid) {
        item.title = get(item, title_key);
        item.value = get(item, value_key);

        item.children = transferMenus(menus, get(item, id_key));

        temp.push({ ...omit(item, 'key') });
      }
    });
    return temp;
  };

  useEffect(() => {
    (async () => {
      const res = (await request.get(url)).data
      const newMenus = transferMenus(res);
      mchcLogger.log('newMenus', newMenus)
      setMenus([{ id: 0, value: 0, title: '无父级#', children: newMenus } as any]);
    })();
  }, []);

  return (
    <TreeSelect
      treeDefaultExpandAll
      placeholder="请选择父级菜单"
      allowClear
      treeData={menus}
      popupMatchSelectWidth={300}
      {...props}
    />
  );
};
