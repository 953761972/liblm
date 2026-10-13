import { DeleteOutlined, PlusCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Popconfirm, Row, message } from 'antd';
import { get, isEmpty, map, cloneDeep, first } from 'lodash';
import React, { Component, lazy } from 'react';
import { fubaoRequest as request } from '@lm_fe/utils';
import styles from '../../../common.module.less'
import { 妇科专病_手术病历_mapping } from './config';
const RenderContentWrap = lazy(() => import('./RenderContentWrap'))
const mapping = 妇科专病_手术病历_mapping

export default class Nursing extends Component<any, any> {
  state = {
    activeTemplate: '',
    siderPanels: [],
    oldsiderPanels: [],
    visible: false,
    activeItem: {},
  };

  async componentDidMount() {
    this.handleInit();
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    });
  };

  handleClickListItem = (item: any) => () => {
    let code = 'dilatationAndCurettage';
    map(mapping, (value, index) => {
      if (get(item, 'operationName') === get(value, 'name')) {
        code = index;
      }
    });
    const activeTemplate = get(mapping, `${code}.key`);
    this.setState({
      activeItem: item,
      activeTemplate,
    });
  };

  handleInit = async (activeType?: any) => {
    let newSiderPanels: any = [];
    const id = get(this.props, 'id');
    const { activeItem, activeTemplate } = this.state;
    const surgicalRecordId = get(this.props, 'surgicalRecordId');
    let data = (await request.get(
      `/api/family/planning/getEarlyPregnancyCheckSurgicalTypeList?familyPlanningId.equals=${id}&deleteFlag.equals=0`,
    )).data;

    if (get(data, 'data')) {
      newSiderPanels = get(data, 'data.earlyPregnancyCheckSurgeryType');
    }

    let newActiveTemplate: any = activeTemplate;

    //手术病历管理跳转对应的tab
    if (surgicalRecordId) {
      map(newSiderPanels, (item, index) => {
        if (Number(surgicalRecordId) === get(item, 'id')) {
          map(mapping, (value, valIndex) => {
            if (get(item, 'operationName') === get(value, 'name')) {
              newActiveTemplate = get(mapping, `${valIndex}.key`);
            }
          });
          this.setState({
            siderPanels: newSiderPanels,
            oldsiderPanels: newSiderPanels,
            activeItem: item,
            activeTemplate: newActiveTemplate,
          });
        }
      });
    } else {
      let newActiveItem: any = activeItem;

      if (isEmpty(activeItem) && !isEmpty(newSiderPanels)) {
        newActiveItem = first(newSiderPanels);
        let operationName = get(newSiderPanels, '0.operationName');

        map(mapping, (value, index) => {
          if (operationName === get(value, 'name')) {
            newActiveTemplate = get(mapping, `${index}.key`);
          }
        });
      }

      if (!get(activeItem, 'id')) {
        newActiveItem = first(newSiderPanels);
      }

      this.setState({
        siderPanels: newSiderPanels,
        oldsiderPanels: newSiderPanels,
        activeItem: newActiveItem,
        activeTemplate: newActiveTemplate,
      });
    }
  };

  handleDelete = (item: any) => async () => {
    const id = get(item, 'id');
    const res = (await request.delete(`/api/family/planning/deleteEarlyPregnancyCheckSurgicalType/${id}`)).data;
    this.setState({
      activeItem: {},
      activeTemplate: '',
    });

    await this.handleInit();
  };

  handleChooseTemplate = (nurseType: any) => () => {
    const clickTempKey = get(nurseType, 'key');
    const { oldsiderPanels } = this.state as any;
    let hasExist = false;
    if (!hasExist) {
      let newSiderPanels: any = cloneDeep(oldsiderPanels);
      let newItem = {
        id: '',
        operationName: get(nurseType, 'name'),
      };
      newSiderPanels.push(newItem);
      this.setState({ siderPanels: newSiderPanels, activeItem: newItem });
    } else {
      let item = oldsiderPanels.filter((data: any) => {
        return data.code === clickTempKey;
      })[0];
      this.setState({
        activeItem: item,
      });
    }
    this.setState({
      activeTemplate: get(nurseType, 'key'),
      visible: false,
    });
  };

  renderSider = () => {
    const { siderPanels, activeItem } = this.state as any;
    return (
      <Card
        size="small"
        bordered={false}
        style={{ height: '100%' }}
        title={<span style={{ color: '#150f55', fontWeight: 600 }}>就诊记录</span>}
        extra={<PlusCircleOutlined onClick={this.handleAdd} />}
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
                          get(activeItem, 'id') === get(data, 'id') ? { background: '#eaf4fd' } : { background: 'none' }
                        }
                        onClick={this.handleClickListItem(data)}
                      >
                        <span className={styles['doctor-desk-first-visit-sider-list__item-title']}>
                          {get(data, 'operationName')}
                        </span>
                        {get(data, 'id') && get(data, 'id') != -1 ? (
                          <Popconfirm
                            title="确定要删除这个病历吗?"
                            onConfirm={this.handleDelete(data)}
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

  renderContent = () => {
    const { activeTemplate, activeItem } = this.state;
    const { reload } = this.props as any;
    const mod = mapping[activeTemplate as keyof typeof mapping]
    if (mod) {
      if (mod.conf)
        return <RenderContentWrap
          familyPlanningId={this.props.id}
          tableColumns={mod.conf}
          activeItem={activeItem}
          active_key={activeTemplate}
          active_title={mod.name}
          onRefresh={this.handleInit}
        />

    } else {
      return (
        <div className={styles['gy-empty-page']}>
          <div>暂无病历，请选择模板内容</div>
          <div>
            {map(mapping, (nurseType, key) => {
              return (
                <Button style={{ margin: 8 }} key={key} onClick={this.handleChooseTemplate(nurseType)}>
                  {nurseType.name}
                </Button>
              );
            })}
          </div>
        </div>
      );
    }
  };

  render() {
    const { visible } = this.state;
    return (
      <Row style={{ height: '100%' }}>
        <Col style={{ height: '100%', width: 290, overflow: 'auto', backgroundColor: '#fff' }}>
          {this.renderSider()}
        </Col>
        <Col style={{ height: '100%', width: 'calc(100% - 290px)', overflow: 'auto' }}>{this.renderContent()}</Col>
        <Modal
          open={visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        >
          {map(mapping, (nurseType, key) => {
            return (
              <Button style={{ margin: 8 }} key={key} onClick={this.handleChooseTemplate(nurseType)}>
                {nurseType.name}
              </Button>
            );
          })}
        </Modal>
      </Row>
    );
  }
}
