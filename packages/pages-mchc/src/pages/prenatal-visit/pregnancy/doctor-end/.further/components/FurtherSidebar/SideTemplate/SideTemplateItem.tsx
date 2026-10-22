import { IMultiTemplate_item, IMultiTemplate_remote, IMultiTemplate_type, IMultiTemplateProps, OkButton } from '@lm_fe/components_m';
import { mchcEvent } from '@lm_fe/env';
import { AnyObject, expect_array, request, set } from '@lm_fe/utils';
import { Collapse, Empty, Space } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import styles from './index.module.less'
interface Iprops {
  on_select(item?: IMultiTemplate_item): void,
  type?: IMultiTemplate_type,
  templates_props: IMultiTemplateProps | null
}
export function SideTemplateItem({ type, templates_props, on_select }: Iprops) {

  const [templates, set_templates] = useState<IMultiTemplate_remote>()
  const [open_keys, set_open_keys] = useState<string[]>([])
  useEffect(() => {
    fetch_data(type)

    return () => {

    }
  }, [type])
  if (!templates_props) return <div>配置异常</div>

  function fetch_data(t?: IMultiTemplate_type) {
    if (t) {
      request
        // .get<IRemoteTemplates[]>(url, { params: { 'type.equals': item?.params?.type } })
        .get<IMultiTemplate_remote[]>(templates_props?.url!, { params: t?.params })
        .then(res => {
          const res_data = res.data[0]
          set_templates(res_data)
          set_open_keys(res_data.data.map(_ => _.title))
        })
    }
  }
  const fds = expect_array(templates_props.fds)

  function run_one(action: '覆' | '插', data: AnyObject, ks?: string[]) {
    const isOk = action === '插' || confirm('确定覆？')
    if (!isOk) return
    mchcEvent.emit('outpatient', { type: '复诊表单走一个', action, data, keys: ks ? ks : fds.map(_ => _.name!) })
  }
  if (!type || !templates) return <Empty />
  return (
    <Collapse size='small' activeKey={open_keys} onChange={set_open_keys} >

      {
        expect_array(templates?.data).map(obj => {
          return <Collapse.Panel
            key={obj.title}
            header={
              <span>
                {obj.title}
                <Space.Compact size='small' style={{ marginLeft: 6 }}>
                  <OkButton primary onClick={e => { e.stopPropagation(); run_one('覆', obj) }} btn_text='覆盖' />
                  <OkButton primary onClick={e => { e.stopPropagation(); run_one('插', obj) }} btn_text='插入' />
                </Space.Compact>
              </span>
            }>
            {
              fds.map(f => {
                const item_name = f.name!
                const v = get(obj, item_name)
                if (!v) return null
                return <div className={styles['tool-box']} style={{ paddingBottom: 12 }}>
                  <span style={{ fontWeight: 'bold' }}>{f.label}：</span>
                  <span className={styles['tool-text']}>{v}</span>
                  <Space.Compact className={styles['tool']} size='small' style={{ marginLeft: 6 }}>
                    <OkButton primary onClick={e => { run_one('覆', set({}, f.name!, v), [item_name]) }} btn_text='覆' />
                    <OkButton primary onClick={e => { run_one('插', set({}, f.name!, v), [item_name]) }} btn_text='插' />
                  </Space.Compact>
                </div>
              })
            }

          </Collapse.Panel>
        })
      }
    </Collapse>

  );
}
