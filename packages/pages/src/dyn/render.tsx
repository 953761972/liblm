import { get_echarat, OkButton, tranform_query_data } from "@lm_fe/components_m";
import { mchcLogger } from "@lm_fe/env";
import { use_provoke } from "@lm_fe/provoke";
import { AnyObject, expect_array, ICommonOption, isEmpty, request, safeExec } from "@lm_fe/utils";
import { Col, Empty, Form, FormInstance, Row, Segmented, Statistic, Table, Tabs } from "antd";
import { ECharts } from "echarts";
import React, { useEffect, useRef, useState } from 'react';
import { IDynConfItem } from "./types";
import { MyBaseList_FormSection } from "src/components";
function use_dataSource<T = AnyObject>(conf_item: IDynConfItem, form?: FormInstance) {
  const [data, set_data] = useState<T>()
  function data_fetch(search?: AnyObject) {
    const { url, method = 'get' } = conf_item.dataSource ?? {}
    if (!url) return Promise.resolve()
    const search_raw = search ? search : safeExec(conf_item.initialSearchValue)
    const search_obj = tranform_query_data(search_raw, conf_item.searchConfig)
    mchcLogger.log('search_raw', { search_raw, search_obj, conf_item })


    const p = method === 'get'
      ? request.get(url, { params: search_obj, showMsg: false })
      : request.post(url, search_obj, { showMsg: false })
    return p.then(r => set_data(r.data)) as Promise<T | null>

  }
  useEffect(() => {
    data_fetch()

    return () => {

    }
  }, [])
  return { data_fetch, data }
}

function Search_Render({ conf_item, form, onFinish }: { conf_item: IDynConfItem, form: FormInstance, onFinish: (data?: AnyObject) => void }) {
  const { searchConfig, hide_search } = conf_item
  if (!searchConfig || isEmpty(searchConfig) || hide_search) return null
  return <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
    <Form size="small" onFinish={onFinish} initialValues={safeExec(conf_item.initialSearchValue)} form={form} layout="inline" style={{ display: 'flex', gap: '4px 0', marginBottom: 2 }} >
      <MyBaseList_FormSection config={searchConfig} />
      <OkButton type='primary' htmlType='submit' btn_text='确定' />
    </Form>
  </div>
}
function Tabs_Render({ conf_item }: { conf_item: IDynConfItem }) {
  const { inputProps = {}, children } = conf_item
  const { ...others } = inputProps
  const _items = expect_array(children)
  return <Tabs
    {...others}
    items={
      _items.map(i => ({
        label: i.title!, key: i.title!, children: <Dyn_Render isLeaf conf={i.children} />
      }))
    }
  />
}
function Segs_Render({ conf_item }: { conf_item: IDynConfItem }) {
  const { inputProps = {}, children } = conf_item
  const items = expect_array(children)
  const [target, setTarget] = useState(items[0]?.title)
  return <>
    <Segmented {...inputProps} value={target} onChange={setTarget} options={items.map(_ => _.title)} />
    {
      items.map(i => (
        i.title === target ? <Dyn_Render isLeaf conf={i.children} /> : null
      ))
    }
  </>

}
function Title_Render({ conf_item }: { conf_item: IDynConfItem }) {
  const { render } = conf_item
  const { data, data_fetch } = use_dataSource(conf_item)
  const [form] = Form.useForm()

  const arr = expect_array<ICommonOption>(safeExec(render, data!))
  return <>
    <Search_Render conf_item={conf_item} form={form} onFinish={search => data_fetch(search)} />
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      {
        arr.map(_ => {
          return <Statistic
            title={_.label}
            value={_.value}
          />
        })
      }
    </div>
  </>
}
function Grid_Render({ conf_item }: { conf_item: IDynConfItem }) {

  return <Dyn_Render isLeaf conf={conf_item.children} />
}
function Table_Render({ conf_item }: { conf_item: IDynConfItem }) {
  const { inputProps = {}, render } = conf_item
  const [form] = Form.useForm()
  const { data, data_fetch } = use_dataSource(conf_item)
  const result = safeExec(render, data!)
  return <>
    <Search_Render conf_item={conf_item} form={form} onFinish={search => data_fetch(search)} />
    <Table dataSource={result} {...inputProps} />
  </>
}
function IFrameRender({ conf_item }: { conf_item: IDynConfItem }) {
  const { inputProps = {}, render } = conf_item
  const [form] = Form.useForm()
  const { style = {}, ...others } = inputProps
  const { data, data_fetch } = use_dataSource(conf_item)

  return <>
    <Search_Render conf_item={conf_item} form={form} onFinish={search => data_fetch(search)} />
    <iframe style={{ ...style, border: 'none', width: '100%', padding: 0, margin: 0 }} {...others} />
  </>
}
function Echart_Render({ conf_item }: { conf_item: IDynConfItem }) {
  const { inputProps = {}, render } = conf_item
  const el = useRef<HTMLDivElement>(null);
  const chart_el = useRef<ECharts>();

  const [form] = Form.useForm()
  const { data, data_fetch } = use_dataSource(conf_item)
  async function render_chart() {
    const echart_tool = await get_echarat()
    const echart = chart_el.current = echart_tool.init(el.current);
    if (data)
      safeExec(render, data, echart)
  };
  useEffect(() => {
    render_chart()

    return () => {

    }
  }, [data])

  return <>
    <Search_Render conf_item={conf_item} form={form} onFinish={search => data_fetch(search)} />

    {
      data ? <div ref={el} {...inputProps}></div> : <Empty />
    }
  </>
}

function Node_Render(props: { conf_item: IDynConfItem, }) {
  const { conf_item } = props

  switch (conf_item.inputType) {
    case "tabs": return <Tabs_Render conf_item={conf_item} />
    case "segs": return <Segs_Render conf_item={conf_item} />
    case "table": return <Table_Render conf_item={conf_item} />
    case "echarts": return <Echart_Render conf_item={conf_item} />
    case "title": return <Title_Render conf_item={conf_item} />
    case "grid": return <Grid_Render conf_item={conf_item} />
    case 'iframe': return <IFrameRender conf_item={conf_item} />
    default: return null
  }
}
export function Dyn_Render(props: { conf?: IDynConfItem[], isLeaf?: boolean }) {
  const { conf = [], isLeaf } = props
  const { bg_color } = use_provoke(s => s.sys_theme)

  return <Row style={{
    width: '100%',
    height: isLeaf ? 'unset' : '100%', overflowY: isLeaf ? 'unset' : 'auto'
  }} gutter={6} >
    {
      conf.map(c => {
        const props = c.containerProps ?? {}
        const { style = {}, ...col_porps } = c.colProps || {}
        return <Col {...col_porps} style={{ marginBottom: 6, ...style }} >
          <div {...props} style={{ background: bg_color, overflowY: 'auto', overflowX: 'hidden', padding: '0 2px', ...props.style }}>
            <Node_Render conf_item={c} />
          </div>
        </Col>
      })
    }
  </Row>
}
