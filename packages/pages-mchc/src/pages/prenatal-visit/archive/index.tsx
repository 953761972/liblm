import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import React from 'react';
import { useTableConfig } from './config/useTableConfig';

/** 归档管理：显示所有孕册，点击「归档」按钮弹出产检本归档组件 */
export default function Archive(props: any) {
  const [conf] = useTableConfig(props)
  const conf_fn = () => import('./config/table')
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '归档管理-列表',
      tableColumns: conf_fn,
      searchConfig: () => import('./config/form'),
      searchParams: () => ({ 'deleteFlag.equals': 0 }),
    },
  }, props)
  return <Wrap>
    <MyBaseList {...conf} bf_conf={config} tableColumns={__DEV__ ? conf_fn : config?.tableColumns} />
  </Wrap>
}
