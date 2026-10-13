/**
 * @author bhliang
 * @email 710122069@qq.com
 * @create date 2021-12-01 11:03:44
 * @modify date 2021-12-01 11:03:44
 * @desc [全局设置的modal]
 */
import { LazyAntd } from '@lm_fe/components';
import { fubaoRequest as request } from '@lm_fe/utils';
import { Button, Col, Form, message, Modal, Popconfirm, Row } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, map } from 'lodash';
import dayjs from 'dayjs';
import React from 'react';
import { 妇科专病_手术病历_mapping } from "../../../file-management/doctor-desk/components/SurgicalRecordv2/config";
import { valueToApi, valueToForm } from '../../adapter';
import SingleCheckBox from '../SingleCheckBox/index';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd
const Option = Select.Option;
dayjs().locale('zh-cn');
const options = [
  { label: '不可约', value: 0 },
  { label: '上午', value: 1 },
  { label: '下午', value: 2 },
  { label: '全天', value: 3 },
];
const BaseUrl = `/api/family/planning/getFamilyPlanningDefaultSetting`;
const UpdateUrl = `/api/family/planning/addOrUpdateFamilyPlanningDefaultSetting`;
export default class GlobalSettingModal extends React.Component<any, any> {
  form: FormInstance | null = null;
  state = {
    data: {},
    surgeryOptions: [], //手术项目选项
    disabled1: false,
    disabled2: false,
    disabled3: false,
    disabled4: false,
    disabled5: false,
    disabled6: false,
    disabled7: false,
    popconfirmVisible: false,
  };
  componentDidMount() {
    let surgeryOptions: any = [];
    for (let i in 妇科专病_手术病历_mapping) {
      surgeryOptions.push({
        label: 妇科专病_手术病历_mapping[i].name,
        value: 妇科专病_手术病历_mapping[i].key,
        withInput: true,
        style: { width: 50, border: 'none', borderBottom: '1px solid #FE547B', fontSize: 12, background: '#f5f6fa' },
      });
    }
    this.setState({ surgeryOptions });
    this.getDefaultSetting();
  }

  getDefaultSetting = async () => {
    let values = {};
    const res: any = (await request.get(BaseUrl)).data;

    if (get(res, 'code') === 1) {
      values = get(res, 'data');
      let familyPlanningDefaultSettingDetails = get(values, 'familyPlanningDefaultSettingDetails');
      familyPlanningDefaultSettingDetails = valueToForm(familyPlanningDefaultSettingDetails);
      let valuesCopy = { ...values, ...familyPlanningDefaultSettingDetails };
      this.form?.setFieldsValue(valuesCopy);

      if (get(valuesCopy, 'MONDAY-attendanceSet') === 0) {
        this.setState({ disabled1: true });
      }
      if (get(valuesCopy, 'TUESDAY-attendanceSet') === 0) {
        this.setState({ disabled2: true });
      }
      if (get(valuesCopy, 'WEDNESDAY-attendanceSet') === 0) {
        this.setState({ disabled3: true });
      }
      if (get(valuesCopy, 'THURSDAY-attendanceSet') === 0) {
        this.setState({ disabled4: true });
      }
      if (get(valuesCopy, 'FRIDAY-attendanceSet') === 0) {
        this.setState({ disabled5: true });
      }
      if (get(valuesCopy, 'SATURDAY-attendanceSet') === 0) {
        this.setState({ disabled6: true });
      }
      if (get(valuesCopy, 'SUNDAY-attendanceSet') === 0) {
        this.setState({ disabled7: true });
      }

      this.setState({ data: valuesCopy });
    }
  };

  onChange = (data: any) => { };

  handleSubmitData = (data: [{}]) => {
    let day = '';

    const notSubmitData: any = data.filter((item) => {
      let count = 0;
      map(item, (value, key) => {
        if (key !== 'totalNumOfDay' && key.indexOf('Num') > -1) {
          count += value;
        }
      });
      return count > 50;
    });

    if (notSubmitData.length > 0) {
      const whatDay = notSubmitData[0].whatDay; //拿第一条提示
      switch (whatDay) {
        case 'MONDAY':
          day = '周一';
          break;
        case 'TUESDAY':
          day = '周二';
          break;
        case 'WEDNESDAY':
          day = '周三';
          break;
        case 'THURSDAY':
          day = '周四';
          break;
        case 'FRIDAY':
          day = '周五';
          break;
        case 'SATURDAY':
          day = '周六';
          break;
        case 'SUNDAY':
          day = '周日';
          break;
      }
    }
    return day;
  };

  handleConfirm = async () => {
    const { data } = this.state;

    let submitData = this.form?.getFieldsValue();

    submitData = valueToApi(submitData, data);

    const familyPlanningDefaultSettingDetails = get(submitData, 'familyPlanningDefaultSettingDetails');

    //单天号源总数大于50不能提交
    const day = this.handleSubmitData(familyPlanningDefaultSettingDetails);
    if (day) {
      message.error(`${day} 总号源数>50，请调整设置，控制在50个号源以内`);
      return;
    }

    if (get(data, 'id')) {
      submitData = {
        id: get(data, 'id'),
        ...submitData,
      };
    }

    const res: any = (await request.post(`${UpdateUrl}`, submitData)).data;

    if (get(res, 'code') === 1) {

      this.props.setGlobalSettingModal(false);
      this.props.getReservationPanel();
    } else {

    }
  };

  handleOk = async () => {
    this.setState({ popconfirmVisible: true });
  };

  handleItemChange = (changedValues: any, allValues: any) => {
    if (get(allValues, 'MONDAY-attendanceSet') === 0) {
      this.setState({ disabled1: true });
    } else {
      this.setState({ disabled1: false });
    }
    if (get(allValues, 'TUESDAY-attendanceSet') === 0) {
      this.setState({ disabled2: true });
    } else {
      this.setState({ disabled2: false });
    }
    if (get(allValues, 'WEDNESDAY-attendanceSet') === 0) {
      this.setState({ disabled3: true });
    } else {
      this.setState({ disabled3: false });
    }
    if (get(allValues, 'THURSDAY-attendanceSet') === 0) {
      this.setState({ disabled4: true });
    } else {
      this.setState({ disabled4: false });
    }
    if (get(allValues, 'FRIDAY-attendanceSet') === 0) {
      this.setState({ disabled5: true });
    } else {
      this.setState({ disabled5: false });
    }
    if (get(allValues, 'SATURDAY-attendanceSet') === 0) {
      this.setState({ disabled6: true });
    } else {
      this.setState({ disabled6: false });
    }
    if (get(allValues, 'SUNDAY-attendanceSet') === 0) {
      this.setState({ disabled7: true });
    } else {
      this.setState({ disabled7: false });
    }
  };

  render() {
    const {
      surgeryOptions,
      data,
      disabled1,
      disabled2,
      disabled3,
      disabled4,
      disabled5,
      disabled6,
      disabled7,
      popconfirmVisible,
    } = this.state;
    const { isGlobalSettingModalVisible } = this.props;

    return (
      <Modal
        title="手术排班全局设置"
        visible={isGlobalSettingModalVisible}
        onCancel={() => this.props.setGlobalSettingModal(false)}
        onOk={() => this.handleOk()}
        className={`global-setting-modal ${popconfirmVisible ? 'hidden' : 'auto'}`}
        width={1200}
        footer={[
          <Button key="cancel" onClick={() => this.props.setGlobalSettingModal(false)}>
            关闭
          </Button>,
          <Popconfirm
            key="submit"
            title={`已有预约项目的日期无法取消，请确认是否修改设置!`}
            visible={popconfirmVisible}
            onCancel={() => {
              this.setState({ popconfirmVisible: false });
            }}
            onConfirm={() => {
              this.handleConfirm();
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                this.handleOk();
              }}
            >
              保存
            </Button>
          </Popconfirm>,
        ]}
      >
        <Form
          ref={(formRef) => {
            this.form = formRef;
          }}
          onValuesChange={(changedValues, allValues) => {
            this.handleItemChange(changedValues, allValues);
          }}
        >
          <Row className="global-setting-row">
            <Col span={4} className="setting-desc">
              常规排班
            </Col>
          </Row>
          <Row>
            <Col span={24} className="visit-settings">
              <table className="visit-settings-table">
                <thead>
                  <tr>
                    <td>日期</td>
                    <td>常规周一</td>
                    <td>常规周二</td>
                    <td>常规周三</td>
                    <td>常规周四</td>
                    <td>常规周五</td>
                    <td>常规周六</td>
                    <td>常规周日</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', backgroundColor: '#f5f6fa' }}>手术状态</td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="MONDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="TUESDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="WEDNESDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="THURSDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="FRIDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="SATURDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Form.Item name="SUNDAY-attendanceSet">
                        <Select placeholder="请选择" options={options} />
                      </Form.Item>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'center', backgroundColor: '#f5f6fa' }}>开放手术项目</td>
                    <td>
                      <Form.Item name="MONDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled1}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'MONDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="TUESDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled2}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'TUESDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="WEDNESDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled3}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'WEDNESDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="THURSDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled4}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'THURSDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="FRIDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled5}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'FRIDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="SATURDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled6}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'SATURDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                    <td>
                      <Form.Item name="SUNDAY-surgery">
                        <SingleCheckBox
                          type="multiple"
                          disabled={disabled7}
                          options={surgeryOptions}
                          onChange={this.onChange}
                          selectValue={get(data, 'SUNDAYSurgeryValue')}
                        />
                      </Form.Item>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* <Row className="visit-settings-bottom">
                <Col span={4}></Col>
                <Col span={6}>
                  <Form.Item name="statutoryHoliday" label="法定节假日默认">
                    <Select placeholder="请选择" style={{ width: 120 }}>
                      {options}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="statutoryHolidayRepair" label="法定补班默认">
                    <Select placeholder="请选择" style={{ width: 120 }}>
                      {options}
                    </Select>
                  </Form.Item>
                </Col>
              </Row> */}
            </Col>
          </Row>
          <Row className="global-setting-row">
            <Col span={4} className="setting-desc">
              开放预约范围
            </Col>
            <Col span={20} className="flex-div">
              <span style={{ fontSize: 14 }}>患者可预约当前时间 至</span>
              <Form.Item name="reservationTime" className="form-inline-item">
                <Select placeholder="请选择">
                  <Option value={1}>1</Option>
                  <Option value={3}>3</Option>
                  <Option value={5}>5</Option>
                  <Option value={7}>7</Option>
                  <Option value={14}>14</Option>
                  <Option value={30}>30</Option>
                </Select>
              </Form.Item>
              <span style={{ fontSize: 14 }}>天内的号源。</span>
            </Col>
          </Row>
          <Row className="global-setting-row">
            <Col span={4} className="setting-desc cancel-setting">
              取消预约设置
            </Col>
            <Col span={20} className="flex-div">
              <span style={{ fontSize: 14 }}>患者在预约时间</span>
              <Form.Item name="cancelReservation" className="form-inline-item">
                <Select placeholder="请选择">
                  <Option value={0}>0</Option>
                  <Option value={1}>1</Option>
                  <Option value={6}>6</Option>
                  <Option value={12}>12</Option>
                  <Option value={24}>24</Option>
                  <Option value={48}>48</Option>
                </Select>
              </Form.Item>
              <span style={{ fontSize: 14 }}>小时前可取消号源。</span>
            </Col>
          </Row>
        </Form>
        {popconfirmVisible && <div className="masking"></div>}
      </Modal>
    );
  }
}
