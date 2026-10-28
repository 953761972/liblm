import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { mchcLogger } from '@lm_fe/env';
import { AnyObject, expect_array, fubaoRequest as request, text_ellipsis } from '@lm_fe/utils';
import { Button, Card, Col, Empty, Modal, Popconfirm, Row } from 'antd';
import { cloneDeep, first, get, isEmpty, map } from 'lodash';
import React, { lazy, useEffect, useState } from 'react';
import { IModel_EarlyPregnancySurgicalTemplate, SModel_EarlyPregnancySurgicalTemplate } from 'src/pages/fubao/.stupid_model/models/EarlyPregnancySurgicalTemplate';
import styles from '../../../common.module.less';
import { conf_刮宫术 } from './Curettage/conf';
const RenderContentWrap = lazy(() => import('./RenderContentWrap'))

interface IProps {
  id: any
  outpatientNo: any
  surgicalRecordId: any
}
export default function FuckingNursing({ id, surgicalRecordId, outpatientNo }: IProps) {
  const [siderPanels, set_siderPanels] = useState<any[]>([])

  const [surgeryTemplates, set_surgeryTemplates] = useState<IModel_EarlyPregnancySurgicalTemplate[]>([])
  const [visible, set_visible] = useState<boolean>(false)
  const [activeItem, set_activeItem] = useState<AnyObject | undefined>()


  useEffect(() => {

    init();

    return () => {

    }
  }, [])


  function handleAdd() {
    set_visible(true)
  };

  function handleClickListItem(item: any) {
    set_activeItem(item)

  };

  async function fetch_data(the_surgicalRecordId?: any) {



    let data = (await request.get(
      `/api/family/planning/getEarlyPregnancyCheckSurgicalTypeList?familyPlanningId.equals=${id}&deleteFlag.equals=0`,
    )).data;


    let newSiderPanels = expect_array<AnyObject>(get(data, 'data.earlyPregnancyCheckSurgeryType'));

    set_siderPanels(newSiderPanels)


    //手术病历管理跳转对应的tab
    if (the_surgicalRecordId) {
      const target = newSiderPanels.find(item => Number(the_surgicalRecordId) === get(item, 'id'))
      set_activeItem(target)
    } else {
      set_activeItem(first(newSiderPanels))
    }
  };
  async function init() {

    const ttt = await SModel_EarlyPregnancySurgicalTemplate.getList()
    set_surgeryTemplates(ttt)
    fetch_data(surgicalRecordId)
  };

  async function handleDelete(item: any) {
    const id = get(item, 'id');
    const res = (await request.delete(`/api/family/planning/deleteEarlyPregnancyCheckSurgicalType/${id}`)).data;

    set_activeItem(undefined)

    await fetch_data();
  };

  function handleChooseTemplate(fuck_type: IModel_EarlyPregnancySurgicalTemplate) {
    let newSiderPanels = cloneDeep(siderPanels.filter(_ => _.id !== null));
    let newItem = {
      id: null,
      operationName: get(fuck_type, 'operationName'),
    };
    newSiderPanels.push(newItem);
    set_visible(false)
    set_siderPanels(newSiderPanels)
    set_activeItem(newItem)

  };

  function renderSider() {
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title={<span style={{ color: '#150f55', fontWeight: 600 }}>就诊记录</span>}
        extra={<PlusCircleOutlined onClick={handleAdd} />}
      >
        {!isEmpty(siderPanels) && (
          <div className={styles['family-planning-list-container']}>
            {map(siderPanels, (data, index) => {
              const op_name = get(data, 'operationName')
              return (
                <div key={data.id} className={styles['family-planning-list']}>
                  {
                    <>
                      <div
                        title={op_name}
                        className={
                          `${styles['doctor-desk-first-visit-sider-list__item']} 
                          ${get(activeItem, 'id') === get(data, 'id') ? styles['active'] : ''}`
                        }
                        style={
                          get(activeItem, 'id') === get(data, 'id') ? { background: '#eaf4fd' } : { background: 'none' }
                        }
                        onClick={() => handleClickListItem(data)}
                      >
                        <span className={styles['doctor-desk-first-visit-sider-list__item-title']}>
                          {text_ellipsis(op_name, 10)}
                        </span>
                        {get(data, 'id') && get(data, 'id') != -1 ? (
                          <Popconfirm
                            title="确定要删除这个病历吗?"
                            onConfirm={() => handleDelete(data)}
                            okText="确定"
                            cancelText="取消"
                          >
                            {get(activeItem, 'id') === get(data, 'id') && (
                              <DeleteOutlined
                                style={{ color: '#007aff', float: 'right', marginTop: 2, marginLeft: 8 }}
                              />
                            )}
                            {get(data, 'surgicalDate') && (
                              <span className="date" style={{ float: 'right' }}>
                                {get(data, 'surgicalDate')}
                              </span>
                            )}
                          </Popconfirm>
                        ) : (
                          <>
                            <EditOutlined
                              style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2, marginLeft: 8 }}
                            />
                            {get(data, 'surgicalDate') && (
                              <span className="date" style={{ float: 'right' }}>
                                {get(data, 'surgicalDate')}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  }
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  };

  function renderContent() {
    const target_tpl = surgeryTemplates.find(_ => _.operationName === activeItem?.operationName)
    mchcLogger.log('renderContent xxgg', surgeryTemplates, activeItem, target_tpl)
    if (isEmpty(siderPanels)) {
      return (
        <div className={styles['gy-empty-page']}>
          <div>暂无病历，请选择模板内容</div>
          <div>
            {map(surgeryTemplates, (nurseType, key) => {
              return (
                <Button style={{ margin: 8 }} key={key} onClick={() => handleChooseTemplate(nurseType)}>
                  {nurseType.operationName}
                </Button>
              );
            })}
          </div>
        </div>
      )
    }
    if (!target_tpl || !activeItem) {
      return <Empty />
    }
    return <RenderContentWrap
      outpatientNo={outpatientNo}
      familyPlanningId={id}
      tableColumns={conf_刮宫术}
      activeItem={activeItem}
      active_key={target_tpl.schedulingField}
      active_title={target_tpl.operationName}
      onRefresh={fetch_data}
    />
  };

  return (
    <Row style={{ height: '100%' }}>
      <Col style={{ height: '100%', width: 290, overflow: 'auto', backgroundColor: '#fff' }}>
        {renderSider()}
      </Col>
      <Col style={{ height: '100%', width: 'calc(100% - 290px)', overflow: 'auto' }}>{renderContent()}</Col>
      <Modal
        open={visible}
        onCancel={() => {
          set_visible(false)
        }}
      >
        {map(surgeryTemplates, (nurseType, key) => {
          return (
            <Button style={{ margin: 8 }} key={key} onClick={() => handleChooseTemplate(nurseType)}>
              {nurseType.operationName}
            </Button>
          );
        })}
      </Modal>
    </Row>
  );
}
