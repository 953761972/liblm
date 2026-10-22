import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Tabs } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, isEmpty, map } from 'lodash';
import React, { Component } from 'react';
import SingleCheckBox from '../../SingleCheckBox/index';
import { valueToApi, valueToForm } from '../config/adapter';
import { historyTableColumns } from '../config/table';
// import dsf from '../../../images/dsf.svg';
// import ywc from '../../../images/ywc.svg';
// import wd from '../../../images/wd.svg';
// import sf from '../../../images/sf.svg';
import { DatePicker_L, LazyAntd } from '@lm_fe/components';
import { SLocal_State } from '@lm_fe/service';
import { fubaoRequest as request } from '@lm_fe/utils';
const { Table } = LazyAntd

const noticeTypeOptions = [
  { label: '电话', value: '电话' },
  { label: '微信', value: '微信' },
  { label: '复诊', value: '复诊' },
  { label: '现场', value: '现场' },
];

const option1 = [
  { label: '正常', value: '正常' },
  { label: '未接听', value: '未接听' },
  { label: '号码错误', value: '号码错误' },
];

const option2 = [
  { label: '未避孕', value: '未避孕' },
  { label: '避孕失败', value: '避孕失败' },
];

const option3 = [
  { label: '复方口服避孕药', value: '复方口服避孕药' },
  { label: 'IUD/IUS', value: 'IUD/IUS' },
  { label: '体外排精', value: '体外排精' },
  { label: '避孕套', value: '避孕套' },
  { label: '杀精剂', value: '杀精剂' },
  { label: '安全期', value: '安全期' },
  { label: '紧急避孕药', value: '紧急避孕药' },
  { label: '其他', value: '其他', withInput: true, inputWidth: 150, inputLeft: -80 },
];

const option4 = [
  { label: '复方口服避孕药', value: '复方口服避孕药' },
  { label: 'IUD', value: 'IUD' },
  { label: '曼月乐', value: '曼月乐' },
  { label: '避孕套', value: '避孕套' },
  { label: '杀精剂', value: '杀精剂' },
  { label: '其他', value: '其他', withInput: true, inputWidth: 80 },
];

const option5 = [
  { label: '立即', value: '立即' },
  { label: '流产后2周', value: '流产后2周' },
  { label: '流产后1月', value: '流产后1月' },
  { label: '其他', value: '其他', withInput: true },
];

const option6 = [
  { label: '是', value: 1 },
  { label: '否', value: 2 },
];

const option7 = [
  { label: '少', value: '少' },
  { label: '中', value: '中' },
  { label: '多', value: '多' },
];

const option8 = [
  { label: '无', value: 1 },
  { label: '有', value: 2, withInput: true, inputWidth: 150, inputLeft: -116 },
];

const option9 = [
  { label: '是', value: 1, withInput: true, inputPlaceholder: '请输入流产后第几天', inputWidth: 82, inputLeft: -22 },
  { label: '否', value: 2 },
];

const option10 = [
  { label: '是', value: 1, withInput: true, inputWidth: 82, inputLeft: -22 },
  { label: '否', value: 2 },
];

const option11 = [
  { label: '是', value: 1 },
  { label: '否', value: 2, withInput: true, inputWidth: 82, inputLeft: -22 },
];

class ModalForm extends Component {
  form0: FormInstance | null = null;
  form1: FormInstance | null = null;
  form3: FormInstance | null = null;
  form6: FormInstance | null = null;
  form12: FormInstance | null = null;

  state = {
    activeTabKey: '0',
    disabled0: false,
    disabled1: false,
    disabled3: false,
    disabled6: false,
    disabled12: false,
    followUpData0: {},
    followUpData1: {},
    followUpData3: {},
    followUpData6: {},
    followUpData12: {},
    tableVisible0: false,
    tableVisible1: false,
    tableVisible3: false,
    tableVisible6: false,
    tableVisible12: false,
    totalData: {},
  };

  async componentDidMount() {
    const { currentRecord, } = this.props as any;
    const user = SLocal_State.getUserData()
    let earlyPregnancyCheckPacTrackingFollowUpRecords = [];
    let followUpData0 = {};
    let followUpData1 = {};
    let followUpData3 = {};
    let followUpData6 = {};
    let followUpData12 = {};
    let totalData = {};

    const _res = await request.get(
      `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileById?id.equals=${get(currentRecord, 'id')}`,
    );
    const res = _res.data
    if (get(res, 'data.earlyPregnancyCheckPacTrackingFollowUpRecordVMS')) {
      earlyPregnancyCheckPacTrackingFollowUpRecords = get(res, 'data.earlyPregnancyCheckPacTrackingFollowUpRecordVMS');
    }

    totalData = get(res, 'data');

    if (!isEmpty(earlyPregnancyCheckPacTrackingFollowUpRecords)) {
      map(earlyPregnancyCheckPacTrackingFollowUpRecords, (item, key) => {
        if (get(item, 'followUpType') === 0) {
          followUpData0 = item;
        }
        if (get(item, 'followUpType') === 1) {
          followUpData1 = item;
        }
        if (get(item, 'followUpType') === 3) {
          followUpData3 = item;
        }
        if (get(item, 'followUpType') === 6) {
          followUpData6 = item;
        }
        if (get(item, 'followUpType') === 12) {
          followUpData12 = item;
        }
      });
    }

    followUpData0 = valueToApi(followUpData0, user);
    followUpData1 = valueToApi(followUpData1, user);
    followUpData3 = valueToApi(followUpData3, user);
    followUpData6 = valueToApi(followUpData6, user);
    followUpData12 = valueToApi(followUpData12, user);

    this.form0?.setFieldsValue(followUpData0);
    this.form1?.setFieldsValue(followUpData1);
    this.form3?.setFieldsValue(followUpData3);
    this.form6?.setFieldsValue(followUpData6);
    this.form12?.setFieldsValue(followUpData12);

    this.setState({
      followUpData0,
      followUpData1,
      followUpData3,
      followUpData6,
      followUpData12,
      totalData,
    });
  }

  handleSubmit = async (flag?: number) => {
    const { currentRecord, onCancel, onSearch, reload } = this.props as any;
    const { activeTabKey } = this.state;
    let data = {};
    let params = {};
    let followUpState = get(this.state, `followUpData${Number(activeTabKey)}.followUpState`) || '';

    if (Number(activeTabKey) === 0) {
      data = this.form0?.getFieldsValue();
    }
    if (Number(activeTabKey) === 1) {
      data = this.form1?.getFieldsValue();
    }
    if (Number(activeTabKey) === 3) {
      data = this.form3?.getFieldsValue();
    }
    if (Number(activeTabKey) === 6) {
      data = this.form6?.getFieldsValue();
    }
    if (Number(activeTabKey) === 12) {
      data = this.form12?.getFieldsValue();
    }

    data = valueToForm(data);

    if (get(data, 'followUpSituation') === '未接听' || get(data, 'followUpSituation') === '号码错误') {
      followUpState = '待随访';
    }
    if (get(data, 'followUpSituation') === '正常') {
      followUpState = '已完成';
    }

    if (!get(data, 'followUpWay')) {
      message.error('请选择随访方式！');
      return;
    }
    if (!get(data, 'followUpSituation')) {
      message.error('请选择随访情况！');
      return;
    }
    if (!get(data, 'followUpDate')) {
      message.error('请选择随访日期！');
      return;
    }
    if (!get(data, 'followUpPerson')) {
      message.error('请输入随访人！');
      return;
    }

    if (flag) {
      followUpState = '失访';
    }

    if (get(this.state, `followUpData${Number(activeTabKey)}.id`)) {
      params = {
        ...data,
        followUpType: Number(activeTabKey),
        id: get(this.state, `followUpData${Number(activeTabKey)}.id`),
        earlyPregnancyCheckPacTrackingFileId: get(currentRecord, 'id'),
        followUpState,
      };
    } else {
      params = {
        ...data,
        followUpType: Number(activeTabKey),
        earlyPregnancyCheckPacTrackingFileId: get(currentRecord, 'id'),
        followUpState,
      };
    }

    const _res = await request.put('/api/family/planning/updateEarlyPregnancyCheckPacTrackingFollowUpRecord', params);
    const res = _res.data

    onCancel && onCancel();
    onSearch && onSearch();
    reload && reload();
  };

  onChange = (data: any) => { };

  handleTabChange = (key: any) => {
    this.setState({
      activeTabKey: key,
    });
  };

  handleBtnClick = () => {
    const { activeTabKey } = this.state;
    this.setState({
      [`tableVisible${Number(activeTabKey)}`]: !get(this.state, `tableVisible${Number(activeTabKey)}`),
    });
  };

  handleItemChange = (changedValues: any, allValues: any, num: any) => {
    if (get(changedValues, 'followUpSituation')) {
      const checkValue = get(changedValues, 'followUpSituation.checkedValues.0');
      if (checkValue === '未接听' || checkValue === '号码错误') {
        this.setState({ [`disabled${num}`]: true });
      } else {
        this.setState({ [`disabled${num}`]: false });
      }
    }
  };

  renderForm0 = () => {
    const { disabled0, followUpData0, tableVisible0 } = this.state;
    return (
      <Form
        ref={(form0) => {
          this.form0 = form0;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={(changedValues, allValues) => {
          this.handleItemChange(changedValues, allValues, 0);
        }}
      >
        {renderForm0_shared('', disabled0, followUpData0, tableVisible0, this.handleBtnClick.bind(this))}
      </Form>
    );
  };
  // renderForm0 = () => {
  //   const { disabled0, followUpData0, tableVisible0 } = this.state;
  //   return (
  //     <Form
  //       ref={(form0) => {
  //         this.form0 = form0;
  //       }}
  //       labelCol={{ span: 4 }}
  //       wrapperCol={{ span: 20 }}
  //       onValuesChange={(changedValues, allValues) => {
  //         this.handleItemChange(changedValues, allValues, 0);
  //       }}
  //     >
  //       <div className="base-edit-panel">
  //         <div className="base-edit-panel-form_section border">
  //           <span className="base-edit-panel-form_section_title"></span>

  //           <Form.Item
  //             label="首次随访方式"
  //             name="followUpWay"
  //             rules={[{ required: true, message: '请输入随访方式！' }]}
  //           >
  //             <SingleCheckBox
  //               options={noticeTypeOptions}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'followUpState') != '待随访' && get(followUpData0, 'followUpWay')}
  //             />
  //           </Form.Item>
  //           <Form.Item
  //             label="随访情况"
  //             name="followUpSituation"
  //             rules={[{ required: true, message: '请输入随访情况！' }]}
  //           >
  //             <SingleCheckBox
  //               options={option1}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'followUpState') != '待随访' && get(followUpData0, 'followUpSituation')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="本次意外妊娠原因" name="pregnancyCauses">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               options={option2}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'pregnancyCauses')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="以往避孕方式" name="pastContraceptiveMethods">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               type="multiple"
  //               options={option3}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'pastContraceptiveMethods')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="本次流产后建议选用方式" name="afterMiscarriageFirstContraceptiveMethods">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               type="multiple"
  //               options={option4}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'afterMiscarriageFirstContraceptiveMethods')}
  //             />
  //           </Form.Item>

  //           <Form.Item label="建议开始时间" name="suggestBeginTime">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               options={option5}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'suggestBeginTime')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="是否立即处理落实" name="immediatelyImplement">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               options={option6}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'immediatelyImplement')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="是否告知注意事项" name="noticeMatters">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               options={option6}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'noticeMatters')}
  //             />
  //           </Form.Item>
  //           <Form.Item label="是否指导正确使用" name="guidanceForProperUse">
  //             <SingleCheckBox
  //               disabled={disabled0}
  //               options={option6}
  //               onChange={this.onChange}
  //               selectValue={get(followUpData0, 'guidanceForProperUse')}
  //             />
  //           </Form.Item>

  //           <Row>
  //             <Col span={8}>
  //               <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
  //                 <Input disabled={disabled0} placeholder="" />
  //               </Form.Item>
  //             </Col>
  //             <Col span={8}>
  //               <Form.Item
  //                 label="随访日期"
  //                 name="followUpDate"
  //                 labelCol={{ span: 12 }}
  //                 wrapperCol={{ span: 12 }}
  //                 rules={[{ required: true, message: '请输入随访日期！' }]}
  //               >
  //                 <DatePicker_L />
  //               </Form.Item>
  //             </Col>
  //             <Col span={8}>
  //               <Form.Item
  //                 label="随访人"
  //                 name="followUpPerson"
  //                 labelCol={{ span: 12 }}
  //                 wrapperCol={{ span: 12 }}
  //                 rules={[{ required: true, message: '请输入随访人！' }]}
  //               >
  //                 <Input placeholder="" />
  //               </Form.Item>
  //             </Col>
  //           </Row>
  //           {get(followUpData0, 'followUpState') && get(followUpData0, 'followUpState') != '未到' ? (
  //             <Row>
  //               <Col span={6}>
  //                 <Button style={{ marginLeft: '29%' }} size={'large'} onClick={this.handleBtnClick}>
  //                   历史记录
  //                 </Button>
  //               </Col>
  //             </Row>
  //           ) : (
  //             ''
  //           )}
  //           {tableVisible0 && (
  //             <Table
  //               dataSource={get(followUpData0, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
  //               columns={historyTableColumns}
  //               bordered
  //               pagination={false}
  //               style={{ marginTop: 16 }}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     </Form>
  //   );
  // };

  renderForm1 = () => {
    const { disabled1, followUpData1, tableVisible1 } = this.state;
    return (
      <Form
        ref={(form1) => {
          this.form1 = form1;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={(changedValues, allValues) => {
          this.handleItemChange(changedValues, allValues, 1);
        }}
      >
        <div className="base-edit-panel">
          <div className="base-edit-panel-form_section border">
            <span className="base-edit-panel-form_section_title"></span>
            <Form.Item label="随访方式" name="followUpWay" rules={[{ required: true, message: '请输入随访方式！' }]}>
              <SingleCheckBox
                options={noticeTypeOptions}
                onChange={this.onChange}
                selectValue={get(followUpData1, 'followUpState') != '待随访' && get(followUpData1, 'followUpWay')}
              />
            </Form.Item>
            <Form.Item
              label="随访情况"
              name="followUpSituation"
              rules={[{ required: true, message: '请输入随访情况！' }]}
            >
              <SingleCheckBox
                options={option1}
                onChange={this.onChange}
                selectValue={get(followUpData1, 'followUpState') != '待随访' && get(followUpData1, 'followUpSituation')}
              />
            </Form.Item>
            <Row>
              <Col span={8}>
                <Form.Item
                  label="术后出血天数"
                  name="postoperativeBleedingDays"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <Input disabled={disabled1} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="月经是否恢复"
                  name="menstruationRestored"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled1}
                    options={option9}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData1, 'menstruationRestored')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="月经出血量"
                  name="menstruationBleeding"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled1}
                    options={option7}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData1, 'menstruationBleeding')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="是否腹痛" name="stomachAche" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <SingleCheckBox
                    disabled={disabled1}
                    options={option10}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData1, 'stomachAche')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="是否恢复性生活" name="resumeSex" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <SingleCheckBox
                    disabled={disabled1}
                    options={option10}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData1, 'resumeSex')}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="目前采取避孕方式" name="nowContraceptiveMethods">
              <SingleCheckBox
                type="multiple"
                disabled={disabled1}
                options={option4}
                onChange={this.onChange}
                selectValue={get(followUpData1, 'nowContraceptiveMethods')}
              />
            </Form.Item>
            <Form.Item label="今后计划采用避孕方式" name="futureContraceptiveMethods">
              <SingleCheckBox
                type="multiple"
                disabled={disabled1}
                options={option4}
                onChange={this.onChange}
                selectValue={get(followUpData1, 'futureContraceptiveMethods')}
              />
            </Form.Item>
            <Row>
              <Col span={8}>
                <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled1} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访日期"
                  name="followUpDate"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访日期！' }]}
                >
                  <DatePicker_L />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访人"
                  name="followUpPerson"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访人！' }]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            {get(followUpData1, 'followUpState') && get(followUpData1, 'followUpState') != '未到' ? (
              <Row>
                <Col span={6}>
                  <Button style={{ marginLeft: '29%' }} size={'large'} onClick={this.handleBtnClick}>
                    历史记录
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
            {tableVisible1 && (
              <Table
                dataSource={get(followUpData1, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
                columns={historyTableColumns}
                bordered
                pagination={false}
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        </div>
      </Form>
    );
  };

  renderForm3 = () => {
    const { disabled3, followUpData3, tableVisible3 } = this.state;
    return (
      <Form
        ref={(form3) => {
          this.form3 = form3;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={(changedValues, allValues) => {
          this.handleItemChange(changedValues, allValues, 3);
        }}
      >
        <div className="base-edit-panel">
          <div className="base-edit-panel-form_section border">
            <span className="base-edit-panel-form_section_title"></span>

            <Form.Item label="随访方式" name="followUpWay" rules={[{ required: true, message: '请输入随访方式！' }]}>
              <SingleCheckBox
                options={noticeTypeOptions}
                onChange={this.onChange}
                selectValue={get(followUpData3, 'followUpState') != '待随访' && get(followUpData3, 'followUpWay')}
              />
            </Form.Item>
            <Form.Item
              label="随访情况"
              name="followUpSituation"
              rules={[{ required: true, message: '请输入随访情况！' }]}
            >
              <SingleCheckBox
                options={option1}
                onChange={this.onChange}
                selectValue={get(followUpData3, 'followUpState') != '待随访' && get(followUpData3, 'followUpSituation')}
              />
            </Form.Item>
            <Form.Item label="流产后首次落实避孕方法" name="afterMiscarriageFirstContraceptiveMethods">
              <SingleCheckBox
                disabled={disabled3}
                options={option4}
                type="multiple"
                onChange={this.onChange}
                selectValue={get(followUpData3, 'afterMiscarriageFirstContraceptiveMethods')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="存在问题" name="person" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled3} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否坚持使用避孕方法"
                  name="insistUseContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled3}
                    options={option11}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData3, 'insistUseContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否更换其他方法"
                  name="replaceContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled3}
                    options={option10}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData3, 'replaceContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="有无再次意外妊娠" name="unexpectedPregnancyAgain">
              <SingleCheckBox
                disabled={disabled3}
                options={option8}
                onChange={this.onChange}
                selectValue={get(followUpData3, 'unexpectedPregnancyAgain')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled3} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访日期"
                  name="followUpDate"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访日期！' }]}
                >
                  <DatePicker_L />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访人"
                  name="followUpPerson"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访人！' }]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            {get(followUpData3, 'followUpState') && get(followUpData3, 'followUpState') != '未到' ? (
              <Row>
                <Col span={6}>
                  <Button style={{ marginLeft: '29%' }} size={'large'} onClick={this.handleBtnClick}>
                    历史记录
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
            {tableVisible3 && (
              <Table
                dataSource={get(followUpData3, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
                columns={historyTableColumns}
                bordered
                pagination={false}
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        </div>
      </Form>
    );
  };

  renderForm6 = () => {
    const { disabled6, followUpData6, tableVisible6 } = this.state;
    return (
      <Form
        ref={(form6) => {
          this.form6 = form6;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={(changedValues, allValues) => {
          this.handleItemChange(changedValues, allValues, 6);
        }}
      >
        <div className="base-edit-panel">
          <div className="base-edit-panel-form_section border">
            <span className="base-edit-panel-form_section_title"></span>

            <Form.Item label="随访方式" name="followUpWay" rules={[{ required: true, message: '请输入随访方式！' }]}>
              <SingleCheckBox
                options={noticeTypeOptions}
                onChange={this.onChange}
                selectValue={get(followUpData6, 'followUpState') != '待随访' && get(followUpData6, 'followUpWay')}
              />
            </Form.Item>
            <Form.Item
              label="随访情况"
              name="followUpSituation"
              rules={[{ required: true, message: '请输入随访情况！' }]}
            >
              <SingleCheckBox
                options={option1}
                onChange={this.onChange}
                selectValue={get(followUpData6, 'followUpState') != '待随访' && get(followUpData6, 'followUpSituation')}
              />
            </Form.Item>
            <Form.Item label="流产后首次落实避孕方法" name="afterMiscarriageFirstContraceptiveMethods">
              <SingleCheckBox
                disabled={disabled6}
                options={option4}
                type="multiple"
                onChange={this.onChange}
                selectValue={get(followUpData6, 'afterMiscarriageFirstContraceptiveMethods')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="存在问题" name="person" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled6} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否坚持使用避孕方法"
                  name="insistUseContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled6}
                    options={option11}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData6, 'insistUseContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否更换其他方法"
                  name="replaceContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled6}
                    options={option10}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData6, 'replaceContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="有无再次意外妊娠" name="unexpectedPregnancyAgain">
              <SingleCheckBox
                disabled={disabled6}
                options={option8}
                onChange={this.onChange}
                selectValue={get(followUpData6, 'unexpectedPregnancyAgain')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled6} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访日期"
                  name="followUpDate"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访日期！' }]}
                >
                  <DatePicker_L />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访人"
                  name="followUpPerson"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访人！' }]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            {get(followUpData6, 'followUpState') && get(followUpData6, 'followUpState') != '未到' ? (
              <Row>
                <Col span={6}>
                  <Button style={{ marginLeft: '29%' }} size={'large'} onClick={this.handleBtnClick}>
                    历史记录
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
            {tableVisible6 && (
              <Table
                dataSource={get(followUpData6, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
                columns={historyTableColumns}
                bordered
                pagination={false}
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        </div>
      </Form>
    );
  };

  renderForm12 = () => {
    const { disabled12, followUpData12, tableVisible12 } = this.state;
    return (
      <Form
        ref={(form12) => {
          this.form12 = form12;
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={(changedValues, allValues) => {
          this.handleItemChange(changedValues, allValues, 12);
        }}
      >
        <div className="base-edit-panel">
          <div className="base-edit-panel-form_section border">
            <span className="base-edit-panel-form_section_title"></span>

            <Form.Item label="随访方式" name="followUpWay" rules={[{ required: true, message: '请输入随访方式！' }]}>
              <SingleCheckBox
                options={noticeTypeOptions}
                onChange={this.onChange}
                selectValue={get(followUpData12, 'followUpState') != '待随访' && get(followUpData12, 'followUpWay')}
              />
            </Form.Item>
            <Form.Item
              label="随访情况"
              name="followUpSituation"
              rules={[{ required: true, message: '请输入随访情况！' }]}
            >
              <SingleCheckBox
                options={option1}
                onChange={this.onChange}
                selectValue={
                  get(followUpData12, 'followUpState') != '待随访' && get(followUpData12, 'followUpSituation')
                }
              />
            </Form.Item>
            <Form.Item label="流产后首次落实避孕方法" name="afterMiscarriageFirstContraceptiveMethods">
              <SingleCheckBox
                disabled={disabled12}
                options={option4}
                type="multiple"
                onChange={this.onChange}
                selectValue={get(followUpData12, 'afterMiscarriageFirstContraceptiveMethods')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="存在问题" name="person" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled12} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否坚持使用避孕方法"
                  name="insistUseContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled12}
                    options={option11}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData12, 'insistUseContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="是否更换其他方法"
                  name="replaceContraceptiveMethods"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                >
                  <SingleCheckBox
                    disabled={disabled12}
                    options={option10}
                    onChange={this.onChange}
                    span={8}
                    selectValue={get(followUpData12, 'replaceContraceptiveMethods')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="有无再次意外妊娠" name="unexpectedPregnancyAgain">
              <SingleCheckBox
                disabled={disabled12}
                options={option8}
                onChange={this.onChange}
                selectValue={get(followUpData12, 'unexpectedPregnancyAgain')}
              />
            </Form.Item>

            <Row>
              <Col span={8}>
                <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                  <Input disabled={disabled12} placeholder="" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访日期"
                  name="followUpDate"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访日期！' }]}
                >
                  <DatePicker_L />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="随访人"
                  name="followUpPerson"
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  rules={[{ required: true, message: '请输入随访人！' }]}
                >
                  <Input placeholder="" />
                </Form.Item>
              </Col>
            </Row>
            {get(followUpData12, 'followUpState') && get(followUpData12, 'followUpState') != '未到' ? (
              <Row>
                <Col span={6}>
                  <Button style={{ marginLeft: '29%' }} size={'large'} onClick={this.handleBtnClick}>
                    历史记录
                  </Button>
                </Col>
              </Row>
            ) : (
              ''
            )}
            {tableVisible12 && (
              <Table
                dataSource={get(followUpData12, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
                columns={historyTableColumns}
                bordered
                pagination={false}
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        </div>
      </Form>
    );
  };

  renderImg = (text: any) => {
    if (text === '待随访') {
      return "<img src={dsf} />";
    }
    if (text === '已完成') {
      return "<img src={ywc} />";
    }
    if (text === '未到') {
      return "<img src={wd} />";
    }
    if (text === '失访') {
      return "<img src={sf} />";
    }
    return '';
  };

  render() {
    const { visible, onCancel } = this.props as any;
    const { followUpData0, followUpData1, followUpData3, followUpData6, followUpData12, totalData } = this.state as any;
    return (
      <Modal
        title="PAC追踪管理"
        width={1200}
        onOk={() => {
          this.handleSubmit(0);
        }}
        wrapClassName="tracing-modal"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Popconfirm
            title={`标记失访后将不再追踪后续随访，是否确定标记`}
            onConfirm={() => {
              this.handleSubmit(1);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button key="back" danger>
              标记失访
            </Button>
          </Popconfirm>,
          <Button key="cancel" onClick={onCancel}>
            关闭
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              this.handleSubmit(0);
            }}
          >
            保存
          </Button>,
        ]}
      >
        <div className="basic-info" style={{ padding: 12 }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={8}>患者姓名：{get(totalData, 'name')}</Col>
            <Col span={8}>年龄：{get(totalData, 'age')}</Col>
            <Col span={8}>手机号码: {get(totalData, 'telephone')}</Col>
          </Row>
          <Row>
            <Col span={8}>手术日期：{get(totalData, 'surgeryDate')}</Col>
            <Col span={8}>手术类型: {get(totalData, 'surgeryType')}</Col>
            <Col span={8}>手术医生: {get(totalData, 'surgeryDoctor')}</Col>
          </Row>
        </div>
        <Tabs defaultActiveKey="0" onChange={this.handleTabChange} type="card">
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">{this.renderImg(get(followUpData0, 'followUpState'))}</span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>首次随访</span>
              </span>
            }
            key="0"
            forceRender
          >
            {this.renderForm0()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">{this.renderImg(get(followUpData1, 'followUpState'))}</span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>1个月随访</span>
              </span>
            }
            key="1"
            forceRender
          >
            {this.renderForm1()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">{this.renderImg(get(followUpData3, 'followUpState'))}</span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>3个月随访</span>
              </span>
            }
            key="3"
            forceRender
          >
            {this.renderForm3()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">{this.renderImg(get(followUpData6, 'followUpState'))}</span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>6个月随访</span>
              </span>
            }
            key="6"
            forceRender
          >
            {this.renderForm6()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">{this.renderImg(get(followUpData12, 'followUpState'))}</span>
                <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>12个月随访</span>
              </span>
            }
            key="12"
            forceRender
          >
            {this.renderForm12()}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    );
  }
}
export function renderForm0_shared(
  title: string = '',
  disabled: boolean,
  followUpData0: any,
  tableVisible0: boolean,
  handleBtnClick: () => void,
  onChange?: (v: any) => void,
) {
  return (
    <div className="base-edit-panel">
      <div className="base-edit-panel-form_section border">
        <span className="base-edit-panel-form_section_title">{title}</span>

        <Form.Item label="首次随访方式" name="followUpWay" rules={[{ required: true, message: '请输入随访方式！' }]}>
          <SingleCheckBox
            options={noticeTypeOptions}
            onChange={onChange}
            selectValue={get(followUpData0, 'followUpState') != '待随访' && get(followUpData0, 'followUpWay')}
          />
        </Form.Item>
        <Form.Item label="随访情况" name="followUpSituation" rules={[{ required: true, message: '请输入随访情况！' }]}>
          <SingleCheckBox
            options={option1}
            onChange={onChange}
            selectValue={get(followUpData0, 'followUpState') != '待随访' && get(followUpData0, 'followUpSituation')}
          />
        </Form.Item>
        <Form.Item label="本次意外妊娠原因" name="pregnancyCauses">
          <SingleCheckBox
            disabled={disabled}
            options={option2}
            onChange={onChange}
            selectValue={get(followUpData0, 'pregnancyCauses')}
          />
        </Form.Item>
        <Form.Item label="以往避孕方式" name="pastContraceptiveMethods">
          <SingleCheckBox
            disabled={disabled}
            type="multiple"
            options={option3}
            onChange={onChange}
            selectValue={get(followUpData0, 'pastContraceptiveMethods')}
          />
        </Form.Item>
        <Form.Item label="本次流产后建议选用方式" name="afterMiscarriageFirstContraceptiveMethods">
          <SingleCheckBox
            disabled={disabled}
            type="multiple"
            options={option4}
            onChange={onChange}
            selectValue={get(followUpData0, 'afterMiscarriageFirstContraceptiveMethods')}
          />
        </Form.Item>

        <Form.Item label="建议开始时间" name="suggestBeginTime">
          <SingleCheckBox
            disabled={disabled}
            options={option5}
            onChange={onChange}
            selectValue={get(followUpData0, 'suggestBeginTime')}
          />
        </Form.Item>
        <Form.Item label="是否立即处理落实" name="immediatelyImplement">
          <SingleCheckBox
            disabled={disabled}
            options={option6}
            onChange={onChange}
            selectValue={get(followUpData0, 'immediatelyImplement')}
          />
        </Form.Item>
        <Form.Item label="是否告知注意事项" name="noticeMatters">
          <SingleCheckBox
            disabled={disabled}
            options={option6}
            onChange={onChange}
            selectValue={get(followUpData0, 'noticeMatters')}
          />
        </Form.Item>
        <Form.Item label="是否指导正确使用" name="guidanceForProperUse">
          <SingleCheckBox
            disabled={disabled}
            options={option6}
            onChange={onChange}
            selectValue={get(followUpData0, 'guidanceForProperUse')}
          />
        </Form.Item>

        <Row>
          <Col span={8}>
            <Form.Item label="备注" name="note" labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
              <Input disabled={disabled} placeholder="" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="随访日期"
              name="followUpDate"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              rules={[{ required: true, message: '请输入随访日期！' }]}
            >
              <DatePicker_L />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="随访人"
              name="followUpPerson"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              rules={[{ required: true, message: '请输入随访人！' }]}
            >
              <Input placeholder="" />
            </Form.Item>
          </Col>
        </Row>
        {get(followUpData0, 'followUpState') && get(followUpData0, 'followUpState') != '未到' ? (
          <Row>
            <Col span={6}>
              <Button style={{ marginLeft: '29%' }} size={'large'} onClick={handleBtnClick}>
                历史记录
              </Button>
            </Col>
          </Row>
        ) : (
          ''
        )}
        {tableVisible0 && (
          <Table
            dataSource={get(followUpData0, 'earlyPregnancyCheckPacTrackingFollowUpFailRecordS') || []}
            columns={historyTableColumns as any}
            bordered
            pagination={false}
            style={{ marginTop: 16 }}
          />
        )}
      </div>
    </div>
  );
}

export default ModalForm;
