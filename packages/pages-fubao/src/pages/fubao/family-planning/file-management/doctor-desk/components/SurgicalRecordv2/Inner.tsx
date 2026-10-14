import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { fubaoRequest as request, text_ellipsis } from '@lm_fe/utils';
import { Button, Card, Col, Modal, Popconfirm, Row } from 'antd';
import { cloneDeep, first, get, isEmpty, map } from 'lodash';
import React, { Component, lazy } from 'react';
import { IModel_EarlyPregnancySurgicalTemplate, SModel_EarlyPregnancySurgicalTemplate } from 'src/pages/fubao/.stupid_model/models/EarlyPregnancySurgicalTemplate';
import styles from '../../../common.module.less';
import { conf_刮宫术 } from './Curettage/conf';
import { mchcLogger } from '@lm_fe/env';
const RenderContentWrap = lazy(() => import('./RenderContentWrap'))

export default class Nursing extends Component<any, any> {
  state = {
    activeTemplate: '',
    siderPanels: [],
    surgeryTemplates: [] as IModel_EarlyPregnancySurgicalTemplate[],
    oldsiderPanels: [],
    visible: false,
    activeItem: {},
  };

  async componentDidMount() {

    const t = await SModel_EarlyPregnancySurgicalTemplate.getList()
    this.setState({
      surgeryTemplates: t
    })
    this.handleInit();
  }

  handleAdd = () => {
    this.setState({
      visible: true,
    });
  };

  handleClickListItem = (item: any) => () => {
    mchcLogger.log('handleClickListItem xxgg', item, this.state.surgeryTemplates)
    const target = this.state.surgeryTemplates.find(_ => _.operationName === get(item, 'operationName'))
    this.setState({
      activeItem: item,
      activeTemplate: target?.schedulingField,
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


    let new_target = this.state.surgeryTemplates.find(_ => _.operationName === activeTemplate)


    //手术病历管理跳转对应的tab
    if (surgicalRecordId) {
      map(newSiderPanels, (item, index) => {
        if (Number(surgicalRecordId) === get(item, 'id')) {
          const target = this.state.surgeryTemplates.find(_ => _.operationName === get(item, 'operationName'))


          this.setState({
            siderPanels: newSiderPanels,
            oldsiderPanels: newSiderPanels,
            activeItem: item,
            activeTemplate: target?.schedulingField,
          });
        }
      });
    } else {
      let newActiveItem: any = activeItem;

      if (isEmpty(activeItem) && !isEmpty(newSiderPanels)) {
        newActiveItem = first(newSiderPanels);
        let operationName = get(newSiderPanels, '0.operationName');

        new_target = this.state.surgeryTemplates.find(_ => _.operationName === operationName)!



      }

      if (!get(activeItem, 'id')) {
        newActiveItem = first(newSiderPanels);
      }

      this.setState({
        siderPanels: newSiderPanels,
        oldsiderPanels: newSiderPanels,
        activeItem: newActiveItem,
        activeTemplate: new_target?.schedulingField,
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

  handleChooseTemplate = (fuck_type: IModel_EarlyPregnancySurgicalTemplate) => () => {
    const clickTempKey = get(fuck_type, 'schedulingField');
    const { oldsiderPanels } = this.state as any;
    let hasExist = false;
    if (!hasExist) {
      let newSiderPanels: any = cloneDeep(oldsiderPanels);
      let newItem = {
        id: '',
        operationName: get(fuck_type, 'operationName'),
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
      activeTemplate: get(fuck_type, 'schedulingField'),
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
                        onClick={this.handleClickListItem(data)}
                      >
                        <span className={styles['doctor-desk-first-visit-sider-list__item-title']}>
                          {text_ellipsis(op_name, 6)}
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
    const { activeTemplate, activeItem, surgeryTemplates } = this.state;
    const target = surgeryTemplates.find(_ => _.schedulingField === activeTemplate)
    mchcLogger.log('renderContent xxgg', surgeryTemplates, activeTemplate, target)
    if (target) {

      return <RenderContentWrap
        familyPlanningId={this.props.id}
        tableColumns={conf_刮宫术}
        activeItem={activeItem}
        active_key={activeTemplate}
        active_title={target.operationName}
        onRefresh={this.handleInit}
      />

    } else {
      return (
        <div className={styles['gy-empty-page']}>
          <div>暂无病历，请选择模板内容</div>
          <div>
            {map(this.state.surgeryTemplates, (nurseType, key) => {
              return (
                <Button style={{ margin: 8 }} key={key} onClick={this.handleChooseTemplate(nurseType)}>
                  {nurseType.operationName}
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
          {map(this.state.surgeryTemplates, (nurseType, key) => {
            return (
              <Button style={{ margin: 8 }} key={key} onClick={this.handleChooseTemplate(nurseType)}>
                {nurseType.operationName}
              </Button>
            );
          })}
        </Modal>
      </Row>
    );
  }
}
