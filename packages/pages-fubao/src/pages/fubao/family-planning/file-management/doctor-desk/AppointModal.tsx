import {
  Alert,
  Button,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,

  Tabs,
  message,
} from 'antd';
import React from 'react';
// import DynamicForm from '@/components/BaseModalForm/DynamicForm';
import { fubaoRequest as request } from '@lm_fe/utils';
import { FormInstance } from 'antd/lib/form/Form';
import { filter, get, isEmpty, map } from 'lodash';
import dayjs from 'dayjs';
import { 妇科专病_手术病历_mapping } from "../../file-management/doctor-desk/components/SurgicalRecordv2/config";
import { modalFormDescriptions as formDescriptions, modifyValueToForm, valueToApi, valueToForm } from './adapter';
import { DatePicker_L, DynamicForm, LazyAntd } from '@lm_fe/components_m';
import { formatDate } from '@lm_fe/utils';
import { getReservationPanelByDate } from '../../surgery-scheduling/apis/api';
import './appointModel.less';
import { mchcEnv } from '@lm_fe/env';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

const { TabPane } = Tabs;
export default class Index extends DynamicForm<any> {
  formRef = React.createRef<FormInstance>();
  static defaultProps = {
    title: '',
    formDescriptions: formDescriptions,
    formItemLayout: {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    },
  };

  state = {
    activeTabKey: '1',
    operationNameOptions: [], //手术预约的手术名称---下拉
    operationName: '', //当前预约手术名称
    data: {}, //手术预约数据
    selectData: {}, //要提交的手术预约数据
    recordData: [], //手术记录数据
    sameDayData: [], //当天已预约总数据
    popconfirmVisible: false, //取消预约弹窗
    popconfirmVisibleId: undefined, //取消预约弹窗id
    openSchedulingDateByOperationNameData: {}, //预约数据
    reservationPanel: [], //排班面板
    templateData: [], //手术配置数据
    isUpdate: false, //修改预约时手术名称表单不可修改
  };

  renderEditItem = this.generateRenderEditItem(this.props.formDescriptions, {
    formItemLayout: this.props.formItemLayout,
  });

  async componentDidMount() {
    this.getAppointmentData();
    this.getReservationPanel();
    this.getTemplate();
  }

  //手术预约
  getAppointmentData = async () => {
    const { basicData } = this.props;
    const params = {
      'progressStatus.equals': 1,
      'outpatientNo.equals': get(basicData, 'outpatientNo'),
      'deleteFlag.equals': 0,
    };
    const response = (await request.get(`/api/family/planning/getEarlyPregnancyCheckSurgicalType`, { params: params })).data;

    if (get(response, 'code') === 1) {
      if (isEmpty(get(response, 'data'))) {
        //无预约手术项目默认打开手术记录
        this.getRecordData();
        this.setState({ activeTabKey: '2' });
      } else {
        const valuesObj = valueToForm(get(response, 'data'));
        const { data, operationNameOptions } = valuesObj;

        this.setState({ data, operationNameOptions });
      }
    } else {
      message.warning(get(response, 'msg'));
    }
  };

  //手术记录
  getRecordData = async () => {
    const { basicData } = this.props;
    const params = {
      //sort: 'appointmentDate,desc',
      'progressStatusNO.equals': 1,
      'outpatientNo.equals': get(basicData, 'outpatientNo'),
      'deleteFlag.equals': 0,
    };
    const response = (await request.get(`/api/family/planning/getEarlyPregnancyCheckSurgicalType`, { params: params })).data;

    if (get(response, 'code') === 1) {
      const recordData = get(response, 'data');
      this.setState({ recordData });
    } else {
      message.warning(get(response, 'msg'));
    }
  };

  getTemplate = async () => {
    const params = {
      'deleteFlag.equals': 0,
    };
    const response = (await request.get(`/api/family/planning/getEarlyPregnancySurgicalTemplate`, { params: params })).data;
    if (get(response, 'code') === 1) {
      const templateData = get(response, 'data');
      this.setState({ templateData });
    }
  };

  getAttendanceOfThisDay = (target: any, operationKey: any) => {
    //0未开放，1开放,2未开放有预约，3已满，默认(1)
    if (!target || !get(target, `attendanceSet`)) {
      return '休息';
    } else if (
      get(target, `${operationKey}`) === 0 ||
      get(target, `${operationKey}`) === 2 ||
      get(target, `${operationKey}`) === 3
    ) {
      return '休息';
    } else {
      return get(target, `${operationKey}`);
    }
  };

  //不可预约日期
  disabledDate = (current: any) => {
    const { reservationPanel, operationName } = this.state;
    let operationKey = this.getOperationKey(operationName);
    const target = reservationPanel.find((_) => dayjs(get(_, 'schedulingDate')).isSame(current, 'day'));

    return current < dayjs().startOf('day') || this.getAttendanceOfThisDay(target, operationKey) === '休息'; //判断几天内可预约
  };

  //自定义日期渲染
  dateRender = (currentDate: any, today: any) => {
    const { reservationPanel, operationName } = this.state;
    let operationKey = this.getOperationKey(operationName);
    const target = reservationPanel.find((_) => dayjs(get(_, 'schedulingDate')).isSame(currentDate, 'day'));
    const isOpen = this.getAttendanceOfThisDay(target, operationKey);

    return (
      <div
        className={`ant-picker-cell-inner ${get(target, 'attendanceSet') && isOpen === '休息' && get(target, `${operationKey}`) === 3
          ? 'single-datePicker-irreducible'
          : (get(target, 'attendanceSet') && isOpen === '休息' && get(target, `${operationKey}`) === 0) ||
            (get(target, 'attendanceSet') && isOpen === '休息' && get(target, `${operationKey}`) === 2) ||
            get(target, 'attendanceSet') === 0
            ? 'single-datePicker-stop'
            : isOpen === 1
              ? 'single-datePicker-reducible'
              : ''
          }`}
      >
        {currentDate.date()}
      </div>
    );
  };

  handleSubmit = async () => {
    try {
      const { onCancel } = this.props;
      const { selectData } = this.state;
      this.form = this.formRef.current;
      await this.form?.validateFields();
      let data = this.form?.getFieldsValue();
      let submitData = valueToApi(data);
      submitData = {
        ...selectData,
        ...submitData,
      };

      const res = (await request.post('/api/family/planning/updateAppointmentSurgery', submitData)).data;
      if (get(res, 'code') === 1) {
        if (get(selectData, 'appointmentMorningOrAfternoon')) {
          mchcEnv.success('已修改成功，信息将同步推送给患者。');
        } else {
          mchcEnv.success('已预约成功，信息将同步推送给患者。');
        }
        onCancel && onCancel();
      } else {

      }
    } catch (errorInfo) {
      mchcEnv.error(get(errorInfo, 'errorFields.0.errors.0'));
    }
  };

  handleTabChange = (key: any) => {
    if (key === '2') {
      this.getRecordData();
    } else {
      //this.getAppointmentData();
    }
    this.setState({
      activeTabKey: key,
    });
  };

  // 获取排版列表
  getReservationPanel = async () => {
    const startDate = dayjs(new Date());
    const endDate = dayjs(new Date()).add(1, 'months');
    const res: any = await getReservationPanelByDate(startDate, endDate);
    this.setState({ reservationPanel: res.data });
  };

  handleItemChange = async (changedValues: any, allValues: any) => {
    const { data } = this.state;
    this.form = this.formRef.current;

    if (get(changedValues, 'operationName')) {
      const filterArr = filter(data, (item) => {
        return get(item, 'operationName') === get(changedValues, 'operationName');
      });

      //缴费情况
      this.form?.setFieldsValue(filterArr[0]);
      //选择的手术数据保存下来
      this.setState({ selectData: filterArr[0] });

      //根据手术名称拿到最近可预约的日期
      const params = {
        'operationName.equals': get(changedValues, 'operationName'),
      };
      const response = (await request.get(`/api/family/planning/getOpenSchedulingDateByOperationName`, {
        params: params,
      })).data;

      if (get(response, 'code') === 1) {
        if (get(response, 'data')) {
          let momentSchedulingDate = dayjs(get(response, 'data.schedulingDate'));
          this.form?.setFieldsValue({ appointmentDate: momentSchedulingDate });
          this.getAccordingtoDateOfData(get(response, 'data.schedulingDate'));

          this.setState({
            openSchedulingDateByOperationNameData: get(response, 'data'),
            operationName: get(changedValues, 'operationName'),
          });
        } else {
          this.setState({
            openSchedulingDateByOperationNameData: {},
            operationName: get(changedValues, 'operationName'),
          });
          message.warning(get(response, 'msg'));
        }
      } else {
        message.warning(get(response, 'msg'));
      }
    }

    //日期切换时，根据日期获取预约信息 排班信息
    if (get(changedValues, 'appointmentDate')) {
      const appointmentDate = get(changedValues, 'appointmentDate').format('YYYY-MM-DD');
      this.getAccordingtoDateOfData(appointmentDate);
      this.getAccordingtoDateOfScheduling(appointmentDate);
    }
  };

  getAccordingtoDateOfScheduling = async (date: any) => {
    //根据日期拿到当天排班情况
    const params = {
      'schedulingDate.equals': date,
      'deleteFlag.equals': 0,
    };
    const response = (await request.get(`/api/family/planning/getSchedulingInformation`, {
      params: params,
    })).data;
    if (get(response, 'code') === 1) {
      this.setState({ openSchedulingDateByOperationNameData: get(response, 'data.0') });
    }
  };

  getAccordingtoDateOfData = async (date: any) => {
    //根据预约日期拿到当天预约数据
    const params = {
      'appointmentDate.equals': date,
      'deleteFlag.equals': 0,
    };
    const response = (await request.get(`/api/family/planning/getEarlyPregnancyCheckSurgicalType`, {
      params: params,
    })).data;
    if (get(response, 'code') === 1) {
      this.setState({ sameDayData: get(response, 'data') });
    }
  };

  //取消预约弹窗
  handleOk = (item: any) => () => {
    const id = get(item, 'id');
    this.setState({ popconfirmVisible: true, popconfirmVisibleId: id });
  };

  //取消预约
  hanleCancelAppointmentSurgery = (item: any) => async () => {
    const id = get(item, 'id');
    const res = (await request.delete(`/api/family/planning/cancelAppointmentSurgery/${id}`)).data;

    this.setState({
      activeTabKey: '2',
    });
    await this.getRecordData();
  };

  //修改预约
  handleUpdateAppointmentSurgery = (item: any) => () => {
    const formValue = modifyValueToForm(item);
    this.form = this.formRef.current;
    this.form?.setFieldsValue(formValue);

    this.getAccordingtoDateOfData(get(item, 'appointmentDate'));
    this.getAccordingtoDateOfScheduling(get(item, 'appointmentDate'));
    this.setState({
      activeTabKey: '1',
      operationName: get(item, 'operationName'),
      selectData: item,
      isUpdate: true,
    });
  };

  getOperationKey = (operationName: any) => {
    let operationKey = '';
    if (operationName) {
      map(妇科专病_手术病历_mapping, (item, key) => {
        if (get(item, 'name') === operationName) {
          operationKey = get(item, 'key');
        }
      });
    }
    return operationKey;
  };

  renderSource = (data: any, operationName: any) => {
    let operationKey = this.getOperationKey(operationName);

    let num = get(data, `${operationKey}Num`) || 0; //总号源数
    let reservationNum = get(data, `${operationKey}ReservationNum`) || 0; //已预约号源数
    let residueNum = get(data, `${operationKey}ResidueNum`) || 0; //剩余号源数

    return `剩余号源：${residueNum}个；已预约：${reservationNum}个；开放号源：${num}个`;
  };

  renderAppointmentMorningOrAfternoon = (data: any, operationName: any) => {
    const { sameDayData } = this.state;

    let operationKey = this.getOperationKey(operationName);
    let residueNum = get(data, `${operationKey}ResidueNum`) || 0; //剩余号源数

    const attendanceSet = get(data, 'attendanceSet');

    this.form = this.formRef.current;
    const appointmentDate = this.form?.getFieldValue('appointmentDate');
    const today = dayjs();
    const hour = today.hour(); // 当天时刻
    const isBefore = dayjs(formatDate(appointmentDate)).diff(
      dayjs(formatDate(today)),
      'days',
    );
    let morningOverTime = false;
    let afternoonOverTime = false;

    //判断日期 时间 是否超时，超时不可约
    if (isBefore < 0) {
      morningOverTime = true;
      afternoonOverTime = true;
    }
    if (isBefore === 0 && hour > 11) {
      morningOverTime = true;
    }
    if (isBefore === 0 && hour > 17) {
      afternoonOverTime = true;
    }

    let options: any = [];

    if (attendanceSet === 3) {
      const morningData = filter(sameDayData, (item) => {
        //progressStatus（1待预约，2已预约待签到，3已签到，4已完成，5已取消，0超时）
        return (
          get(item, 'appointmentMorningOrAfternoon') === '上午' &&
          get(item, 'progressStatus') !== 1 &&
          get(item, 'progressStatus') !== 5
        );
      });
      const afternoonData = filter(sameDayData, (item) => {
        return (
          get(item, 'appointmentMorningOrAfternoon') === '下午' &&
          get(item, 'progressStatus') !== 1 &&
          get(item, 'progressStatus') !== 5
        );
      });
      //上午或者下午预约号源数大于25 或者 剩余号源数为0显示已满
      options = [
        {
          label: '上午',
          value: '上午',
          isFull: morningData.length > 25 || residueNum === 0 ? true : false,
          isOvertiem: morningOverTime,
        },
        {
          label: '下午',
          value: '下午',
          isFull: afternoonData.length > 25 || residueNum === 0 ? true : false,
          isOvertiem: afternoonOverTime,
        },
      ];
    } else if (attendanceSet === 2) {
      options = [
        { label: '下午', value: '下午', isFull: residueNum === 0 ? true : false, isOvertiem: afternoonOverTime },
      ];
    } else if (attendanceSet === 1) {
      options = [
        { label: '上午', value: '上午', isFull: residueNum === 0 ? true : false, isOvertiem: morningOverTime },
      ];
    } else {
      options = [];
    }

    if (attendanceSet) {
      return (
        <Form.Item
          name="appointmentMorningOrAfternoon"
          label="预约时间段"
          rules={[{ required: true, message: '预约时间段是必填项' }]}
        >
          <Radio.Group>
            {options.map((item: any, index: any) => (
              <Radio.Button value={item.value} key={index} disabled={item.isFull || item.isOvertiem}>
                {item.label}
                {item.isFull && <span style={{ color: 'red', paddingLeft: 16 }}>已满</span>}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      );
    } else {
      return (
        <Row>
          <Col span={6}></Col>
          <Col span={18}>
            <Alert message="暂无可预约时间段" type="warning" />
          </Col>
        </Row>
      );
    }
  };

  //根据手术配置获取颜色
  renderColor = (data: any) => {
    const { templateData } = this.state;
    const filterArr = filter(templateData, (item) => {
      return get(item, 'operationName') === get(data, 'operationName');
    });

    return {
      backgroundColor: get(filterArr, '0.backgroundColor') || 'rgb(243, 243, 254)',
      fontColor: get(filterArr, '0.fontColor') || 'rgb(243, 243, 254)',
    };
  };

  render() {
    const { visible, onCancel, formDescriptions } = this.props;
    const {
      data,
      operationNameOptions,
      recordData,
      popconfirmVisible,
      popconfirmVisibleId,
      activeTabKey,
      openSchedulingDateByOperationNameData,
      operationName,
      isUpdate,
    } = this.state;
    return (
      <Modal
        centered
        wrapClassName="modal-phone apponit-modal"
        title={'手术预约'}
        open={visible}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        width={580}
        footer={[
          <Button key="back" onClick={onCancel}>
            关闭
          </Button>,
          <Button
            key="submit"
            type="primary"
            style={
              activeTabKey === '2' || isEmpty(openSchedulingDateByOperationNameData)
                ? { display: 'none' }
                : { display: 'inline-block' }
            }
            disabled={activeTabKey === '2' || isEmpty(openSchedulingDateByOperationNameData) ? true : false}
            onClick={this.handleSubmit}
          >
            保存
          </Button>,
        ]}
      >
        <div className="modal-phone-content appointModel">
          <Tabs activeKey={activeTabKey} onChange={this.handleTabChange} type="card">
            <TabPane tab="手术预约" key="1">
              <Form
                autoComplete="off"
                className="modal-phone-pregnancy"
                ref={this.formRef}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onValuesChange={this.handleItemChange}
              >
                <Form.Item
                  name="operationName"
                  label="手术名称"
                  rules={[{ required: true, message: '手术名称是必填项' }]}
                >
                  <Select options={operationNameOptions} placeholder="手术名称" disabled={isUpdate}></Select>
                </Form.Item>
                <Form.Item
                  name="payment"
                  label="缴费情况"
                  rules={[{ required: true, message: '自动获取HIS系统的缴费状态' }]}
                >
                  <Input placeholder="自动获取HIS系统的缴费状态" disabled />
                </Form.Item>
                {/* 有预约手术项目才显示 */}
                {operationName && !isEmpty(openSchedulingDateByOperationNameData) && (
                  <>
                    <Form.Item
                      name="appointmentDate"
                      label="预约日期"
                      rules={[{ required: true, message: '预约日期是必填项' }]}
                    >
                      <DatePicker_L dateRender={this.dateRender} disabledDate={this.disabledDate} />
                    </Form.Item>
                    <Row>
                      <Col span={6}></Col>
                      <Col span={18}>{this.renderSource(openSchedulingDateByOperationNameData, operationName)}</Col>
                    </Row>
                    {this.renderAppointmentMorningOrAfternoon(openSchedulingDateByOperationNameData, operationName)}
                    {/* <FormSection data={data} formDescriptions={formDescriptions} renderEditItem={this.renderEditItem} /> */}
                  </>
                )}
              </Form>
            </TabPane>
            <TabPane tab="预约记录" key="2">
              {recordData.length > 0 ? (
                <ul className="appointment-ul">
                  {recordData.map((item, index) => (
                    <li
                      className="appointment-li"
                      key={get(item, 'id')}
                      style={{ background: get(this.renderColor(item), 'backgroundColor') }}
                    >
                      <Row>
                        <Col span={12}>
                          <span className="label">手术名称:</span> {get(item, 'operationName')}
                        </Col>
                        <Col span={12}>
                          <span className="label">缴费情况:</span> {get(item, 'payment') ? '已缴费' : '未缴费'}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <span className="label">预约日期:</span> {get(item, 'appointmentDate')}
                        </Col>
                        <Col span={12}>
                          <span className="label">预约时间段:</span> {get(item, 'appointmentMorningOrAfternoon')}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={3}>
                          <span className="label">健康宣教:</span>
                        </Col>
                        <Col span={18}>{get(item, 'postoperationMissionsContent')}</Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <span className="label">登记日期:</span> {get(item, 'registrationDate')}
                        </Col>
                        <Col span={12}>
                          <span className="label">登记者:</span> {get(item, 'appointmentPeople')}
                        </Col>
                      </Row>
                      <div className="sign-in">
                        {get(item, 'progressStatus') === 1 ? (
                          <span>待预约</span>
                        ) : get(item, 'progressStatus') === 2 ? (
                          <span style={{ background: '#7b8c9b' }}>待签到</span>
                        ) : get(item, 'progressStatus') === 3 ? (
                          <span style={{ background: '#21AC8D' }}>已签到</span>
                        ) : get(item, 'progressStatus') === 4 ? (
                          <span style={{ background: '#21AC8D' }}>已完成</span>
                        ) : get(item, 'progressStatus') === 0 ? (
                          <span style={{ background: '#FF7295' }}>已超时</span>
                        ) : (
                          ''
                        )}
                      </div>
                      {(get(item, 'progressStatus') === 0 || get(item, 'progressStatus') === 2) && (
                        <div className="button-group">
                          <Popconfirm
                            key="cancel"
                            title={`是否确认取消预约!`}
                            visible={get(item, 'id') === popconfirmVisibleId && popconfirmVisible}
                            onCancel={() => {
                              this.setState({ popconfirmVisible: false, popconfirmVisibleId: undefined });
                            }}
                            onConfirm={this.hanleCancelAppointmentSurgery(item)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button key="submit" type="link" onClick={this.handleOk(item)}>
                              取消
                            </Button>
                          </Popconfirm>
                          <Button type="link" key="update" onClick={this.handleUpdateAppointmentSurgery(item)}>
                            修改
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
