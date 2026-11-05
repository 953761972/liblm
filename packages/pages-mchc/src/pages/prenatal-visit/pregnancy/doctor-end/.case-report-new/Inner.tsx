import { PlusCircleOutlined } from '@ant-design/icons';
import { MyButton, MyIcon, OkButton } from '@lm_fe/components_m';
import { mchcEvent } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { AnyObject, expect_array, isArray, fubaoRequest as request, text_ellipsis } from '@lm_fe/utils';
import { Button, Card, Col, Empty, List, Modal, Row } from 'antd';
import { cloneDeep, first, get, isEmpty, map } from 'lodash';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { ICaseReport, ICaseTpl, IDataItem, IDetailItem } from './types';
const RenderContentWrap = lazy(() => import('./RenderContentWrap'))


export default function CaseNew(props: ICaseReport) {
  const { modType, id } = props
  const { config } = use_provoke('config')
  const [siderPanels, set_siderPanels] = useState<IDataItem[]>([])

  const [surgeryTemplates, set_surgeryTemplates] = useState<ICaseTpl[]>([])
  const [visible, set_visible] = useState<boolean>(false)
  const [activeItem, set_activeItem] = useState<IDataItem | undefined>()
  const activeItemCache = useRef(activeItem)
  function safe_set_item(item?: IDataItem) {
    activeItemCache.current = item
    set_activeItem(item)
  }

  const params = { pregnancyId: id, modType }
  useEffect(() => {

    init();
    return mchcEvent.on_rm('custom_msg', e => {
      if (e.type === 'case-report-refresh') {
        const data: IDetailItem = e.data
        fetch_data(data?.id)
      }
    })

  }, [])


  function open_modal() {
    set_visible(true)
  };

  function handleClickListItem(item: IDataItem) {
    safe_set_item(item)

  };

  async function fetch_data(item_id?: number) {



    let data = (await request.get<IDataItem[]>('/api/ic/findPersonalPage', { params })).data;


    let newSiderPanels = expect_array(data);

    set_siderPanels(newSiderPanels)

    const target = newSiderPanels.find(_ => _.id === item_id) || first(newSiderPanels)
    safe_set_item(target)


  };
  async function init() {

    const ttt = await request.get<AnyObject>('/api/caseRegister/getCaseRegisterType', { params })
    const options = isArray(ttt.data) ? ttt.data : Object.entries(ttt.data).map(arr => ({ code: arr[0], name: arr[1] }))
    set_surgeryTemplates(options)
    fetch_data()
  };



  function handleChooseTemplate(fuck_type: ICaseTpl) {
    let newSiderPanels = cloneDeep(siderPanels.filter(_ => _.id !== null));
    let newItem = {
      id: null,
      code: fuck_type.code,
      name: fuck_type.name,
      modType,
      pregnancyId: id
    };
    newSiderPanels.push(newItem);
    set_visible(false)
    set_siderPanels(newSiderPanels)
    safe_set_item(newItem)

  };

  function renderSider() {
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        styles={{ body: { padding: 0 } }}
        title={<span style={{ color: '#150f55', fontWeight: 600 }}>记录</span>}
        extra={<PlusCircleOutlined onClick={open_modal} />}
      >

        <List
          size='small'
          itemLayout="horizontal"
          dataSource={siderPanels}
          renderItem={(data, index) => {
            const item_name = data.name!
            const item_id = data.id!
            const is_active = get(activeItem, 'id') === item_id
            return (
              <List.Item >
                <List.Item.Meta
                  title={<a style={{ color: is_active ? config.styles?.colorPrimary : '' }} onClick={e => handleClickListItem(data)}>{text_ellipsis(item_name, 16)}</a>}
                  description={
                    <>
                      <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>

                        <span>
                          {get(data, 'filledDate', '--')}
                        </span>

                      </div>
                    </>
                  }
                />
              </List.Item>
            )
          }}
        />

      </Card >
    );
  };

  function renderContent() {


    if (isEmpty(siderPanels) || !activeItem) {
      return <Empty style={{ padding: 128 }} description={<MyButton primary btn_text='暂无数据，请选择模板内容' onClick={open_modal} />} />
    }
    return <RenderContentWrap
      activeItemCache={activeItemCache}
      activeItem={activeItem}
    />
  };

  return (

    <Row style={{ height: '100%' }} gutter={6}>
      <Col span={4} style={{ height: '100%', overflow: 'auto', }}>
        {renderSider()}
      </Col>
      <Col span={20} style={{ height: '100%', overflow: 'auto' }}>
        <Card size='small' styles={{ body: { padding: 0 } }}>
          {renderContent()}
        </Card>
      </Col>
      <Modal
        open={visible}
        onCancel={() => {
          set_visible(false)
        }}
      >
        {map(surgeryTemplates, (nurseType, key) => {
          return (
            <Button style={{ margin: 8 }} key={key} onClick={() => handleChooseTemplate(nurseType)}>
              {nurseType.name}
            </Button>
          );
        })}
      </Modal>
    </Row>

  );
}
