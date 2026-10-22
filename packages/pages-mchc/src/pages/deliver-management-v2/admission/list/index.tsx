import { BF_Wrap2, MyBaseList } from '@lm_fe/pages';
import React from 'react';
import { useTableConfig } from './config/useTableConfig';
import './index.less';
import { rt_ctx } from '@lm_fe/env';

const ctx = rt_ctx
export default function newList(props: any) {
  // const [config] = useTableConfig(props)
  const [conf] = useTableConfig(props)
  const conf_fn = () => import('./config/table')
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '入院登记-列表',
      tableColumns: conf_fn,
      searchConfig: () => import('./config/form'),
      searchParams: () => ({ 'deleteFlag.equals': 0 }),

    },
  }, props)
  return (
    <Wrap>
      <MyBaseList
        {...conf} bf_conf={config} tableColumns={__DEV__ ? conf_fn : config?.tableColumns}
      />
    </Wrap>
  )
}