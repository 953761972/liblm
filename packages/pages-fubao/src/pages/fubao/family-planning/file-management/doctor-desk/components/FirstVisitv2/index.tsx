import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Popconfirm, Row, message } from 'antd';
import { get, isEmpty, map, cloneDeep, first } from 'lodash';
import React, { Component, useEffect, useState } from 'react';
import { NurseTypesMapping } from './config';
import { fubaoRequest as request } from '@lm_fe/utils';
import styles from '../../../common.module.less'
import RenderContentWrap from './RenderContentWrap';
export default function ZKBL(props: any) {
  const { data, id, reload } = props

  const [activeTemplate, set_activeTemplate] = useState('')
  const [siderPanels, set_siderPanels] = useState([])
  const [oldsiderPanels, set_oldsiderPanels] = useState([])
  const [activeItem, set_activeItem] = useState({})
  const [visible, set_visible] = useState(false)

  useEffect(() => {

    handleInit();

    return () => {

    }
  }, [])


  function handleAdd() {

    set_visible(true)
  };

  function handleClickListItem(item: any) {
    return () => {
      let code = 'Screening';
      map(NurseTypesMapping, (value, index) => {
        if (get(item, 'checkType') === get(value, 'name')) {
          code = index;
        }
      });
      const __activeTemplate: any = get(NurseTypesMapping, `${code}.key`);
      set_activeItem(item)
      set_activeTemplate(__activeTemplate)

    };
  }

  async function handleInit(activeType?: any) {
    let newSiderPanels: any = [];

    let data = (
      await request.get(
        `/api/family/planning/getFamilyPlanningEarlyPregnancyCheckList?familyPlanningId.equals=${id}&deleteFlag.equals=0`,
      )
    ).data;

    if (get(data, 'data')) {
      newSiderPanels = get(data, 'data.familyPlanningEarlyPregnancyCheck');
    }

    let newActiveItem: any = activeItem;
    let newActiveTemplate: any = activeTemplate;
    if (isEmpty(activeItem) && !isEmpty(newSiderPanels)) {
      newActiveItem = first(newSiderPanels);
      let checkType = get(newSiderPanels, '0.checkType');

      map(NurseTypesMapping, (value, index) => {
        if (checkType === get(value, 'name')) {
          newActiveTemplate = get(NurseTypesMapping, `${index}.key`);
        }
      });
    }

    if (!get(activeItem, 'id')) {
      newActiveItem = first(newSiderPanels);
    }
    set_siderPanels(newSiderPanels)
    set_oldsiderPanels(newSiderPanels)
    set_activeItem(newActiveItem)
    set_activeTemplate(newActiveTemplate)

  };

  function handleDelete(item: any) {
    return async () => {
      const id = get(item, 'id');
      const _res = await request.delete(`/api/family/planning/deleteFamilyPlanningEarlyPregnancyCheck/${id}`);
      const res = _res.data
      set_activeItem({})
      set_activeTemplate('')


      await handleInit();
    };
  }

  function handleChooseTemplate(nurseType: any) {
    return () => {
      const clickTempKey = get(nurseType, 'key');
      let hasExist = false;
      if (!hasExist) {
        let newSiderPanels: any = cloneDeep(oldsiderPanels);
        let newItem = {
          id: '',
          checkType: get(nurseType, 'name'),
        };
        newSiderPanels.push(newItem);

        set_siderPanels(newSiderPanels)
        set_activeItem(newItem)
      } else {
        let item = oldsiderPanels.filter((data: any) => {
          return data.code === clickTempKey;
        })[0];

        set_activeItem(item)

      }

      set_visible(false)
      set_activeTemplate(get(nurseType, 'key'))

    };
  }

  function renderSider() {
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title={<span style={{ color: '#150f55', fontWeight: 600 }}>就诊记录.</span>}
        extra={<PlusCircleOutlined onClick={handleAdd} />}
      >
        {!isEmpty(siderPanels) && (
          <div className={styles['family-planning-list-container']}>
            {map(siderPanels, (data, index) => {
              return (
                <div key={data.id} className={styles['family-planning-list']}>
                  {
                    <>
                      <div
                        className={`${styles['doctor-desk-first-visit-sider-list__item']} ${get(activeItem, 'id') === get(data, 'id') ? styles['active'] : ''
                          }`}
                        style={
                          get(activeItem, 'id') === get(data, 'id') ? { background: '#D6E6FF' } : { background: 'none' }
                        }
                        onClick={handleClickListItem(data)}
                      >
                        <span className={styles['doctor-desk-first-visit-sider-list__item-title']}>
                          {get(data, 'checkType')}{' '}
                        </span>
                        {get(data, 'id') && get(data, 'id') != -1 ? (
                          <Popconfirm
                            title="确定要删除这个病历吗?"
                            onConfirm={handleDelete(data)}
                            okText="确定"
                            cancelText="取消"
                          >
                            {get(activeItem, 'id') === get(data, 'id') && (
                              <DeleteOutlined
                                style={{ color: '#007aff', float: 'right', marginTop: 2, marginLeft: 8 }}
                              />
                            )}
                            {get(data, 'registrationDate') && (
                              <span className="date" style={{ float: 'right' }}>
                                {get(data, 'registrationDate')}
                              </span>
                            )}
                          </Popconfirm>
                        ) : (
                          <>
                            <EditOutlined
                              style={{ color: 'rgb(24, 144, 255)', float: 'right', marginTop: 2, marginLeft: 8 }}
                            />
                            {get(data, 'registrationDate') && (
                              <span className="date" style={{ float: 'right' }}>
                                {get(data, 'registrationDate')}
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
    const mod = NurseTypesMapping[activeTemplate as keyof typeof NurseTypesMapping]

    if (mod) {

      if (mod.conf)
        return <RenderContentWrap
          familyPlanningId={id}
          tableColumns={mod.conf}
          activeItem={activeItem}
          active_key={activeTemplate}
          active_title={mod.name}
          onRefresh={handleInit}
        />

      return null

    } else {
      return (
        <div className={styles['gy-empty-page']}>
          <div>暂无病历，请选择模板内容</div>
          <div>
            {map(NurseTypesMapping, (nurseType, key) => {
              if (get(data, 'age') > 21) {
                if (nurseType.key === 'Puberty') {
                  return '';
                } else {
                  return (
                    <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType)}>
                      {nurseType.name}
                    </Button>
                  );
                }
              } else {
                return (
                  <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType)}>
                    {nurseType.name}
                  </Button>
                );
              }
            })}
          </div>
        </div>
      );
    }
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
        {map(NurseTypesMapping, (nurseType, key) => {
          if (get(data, 'age') > 21) {
            if (nurseType.key === 'Puberty') {
              return '';
            } else {
              return (
                <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType)}>
                  {nurseType.name}
                </Button>
              );
            }
          } else {
            return (
              <Button style={{ margin: 8 }} key={key} onClick={handleChooseTemplate(nurseType)}>
                {nurseType.name}
              </Button>
            );
          }
        })}
      </Modal>
    </Row>
  );
}
