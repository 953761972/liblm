import { DatePicker_L, LazyAntd } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { SLocal_State } from '@lm_fe/service';
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
} from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  IModel_EarlyPregnancyCheckSurgeryType,
  IModel_EarlyPregnancyCheckSurgeryType_OptionalPregnancy,
  IModel_FamilyPlaningSchedulingDetails,
  SModel_EarlyPregnancyCheckSurgeryType,
  SModel_FamilyPlaningSchedulingDetails,
  stupidEnums
} from '../../../../.stupid_model';
import {
  checkDisabledHalfDay,
  getAttendanceOfThisDay,
  getOperationNum,
  getSchedulingData
} from '../../../../family-planning/booking-management/util';
import { renderForm0_shared } from '../../../../family-planning/tracing-management/list/components/table1/components/ModalForm';
import { valueToForm } from '../../../../family-planning/tracing-management/list/components/table1/config/adapter';
import { EExaminationStatus } from './constant';
import { InformedConsentTable } from './informedConsentTable';
import { bookingService } from './service';
import { IStepFormComponentType } from './StepModal';
import { StupidRadioGroup, TStupidRadioOptions } from './StupidRadioGroup';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


// import InformedConsent from './InformedConsent'
const { Item } = Form;
export type TCommonData = {
  data?: Partial<IModel_EarlyPregnancyCheckSurgeryType>;
  optionalDoctor?: string[];
  optionalNurse?: string[];
};
const requiredRule = [{ required: true, message: '' }];
function TextareWithButton(props: TextAreaProps & { onValueCheck: (v: string) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <Input.TextArea {...props} />
      <Button
        hidden={props.disabled}
        size="small"
        type="primary"
        style={{ position: 'absolute', right: 2, bottom: 2 }}
        onClick={() => {
          // stupidModal.open('TemplateModal', {
          //   modalData: {
          //     patientId: 1,
          //     onValueCheck(v) {
          //       props.onValueCheck(v[0]);
          //     },
          //   },
          // });
        }}
      >
        模板
      </Button>
    </div>
  );
}
const examStatusOptions: TStupidRadioOptions = Object.keys(EExaminationStatus)
  .filter((_) => isNaN(Number(_)))
  .map((label) => ({
    label,
    value: EExaminationStatus[label],
    activeStyle: EExaminationStatus[label] === EExaminationStatus.正常 ? {} : { color: 'red' },
    withFuckedInput: EExaminationStatus[label] === EExaminationStatus.异常,
  }));
const Form0: IStepFormComponentType<TCommonData, any> = function Form0({ form, setCommonData, commonData }) {
  const remoteData = commonData?.data;
  const status = stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getLabel(remoteData?.progressStatus);
  const canEdit = !status;
  // const isEdit = !!remoteData?.id
  const disabled = !canEdit;
  const [selected, setSelected] = useState(false);
  const [tracingFormVisible, setTracingFormVisible] = useState(false);
  const informedConsents = useRef<IModel_EarlyPregnancyCheckSurgeryType['informedConsents']>([]);
  const [knowledgeTypList, setKnowledgeTypList] = useState<any[]>([]);
  const [isCustomized, setIsCustomized] = useState(true);
  const [knowledgeList, setKnowledgeList] = useState<{ content: string; title: string; id: number }[]>([]);
  const [optionalPregnancy, setOptionalPregnancy] = useState<IModel_EarlyPregnancyCheckSurgeryType_OptionalPregnancy[]>(
    [],
  );
  const [scheduleData, setScheduleData] = useState<IModel_FamilyPlaningSchedulingDetails>();
  const [operationList, setOperationList] = useState<string[]>([]);
  const [_formData, set_formData] = useState<Partial<IModel_EarlyPregnancyCheckSurgeryType>>({});

  const [yearsSchedul, setYearsSchedul] = useState<IModel_FamilyPlaningSchedulingDetails[]>([]);
  const attendency = getAttendanceOfThisDay(scheduleData);
  const { all, reserved } = getOperationNum(scheduleData, _formData.operationName as any);

  const morningReservationNum = scheduleData?.morningReservationNum || 0;
  const afternoonReservationNum = scheduleData?.afternoonReservationNum || 0;

  function setFormData(formData?: Partial<IModel_EarlyPregnancyCheckSurgeryType>) {
    if (formData) {
      set_formData(formData);
      form.setFieldsValue({
        ...formData,
      });
    }
  }
  function handleDateChange(date: Dayjs | null) {
    if (!date) return;
    Promise.all([
      getSchedulingData(date),
      SModel_FamilyPlaningSchedulingDetails.getOpenSurgicalBySchedulingDate(date),
    ]).then(([_schedule, strArr]) => {
      setScheduleData(_schedule);
      setOperationList(strArr);
      // const isDisabledMorning = checkDisabledHalfDay(_schedule, '上午')

      // const formdata = form.getFieldsValue()

      // const operationName = strArr.includes(formdata.operationName) ? formdata.operationName : strArr[0]
      // const appointmentMorningOrAfternoon = isDisabledMorning ? '下午' : '上午'
      // setFormData({
      //     operationName,
      //     appointmentMorningOrAfternoon
      // })
    });
  }
  useEffect(() => {
    const date = remoteData?.appointmentDate;
    mchcLogger.log('fuck date', { remoteData, commonData })
    if (remoteData) {
      setFormData({
        appointmentPeople: remoteData?.appointmentPeople || SLocal_State.getUserData().firstName,
        registrationDate: remoteData?.registrationDate || dayjs(),
        ...remoteData,
        ...(remoteData.preoperativeExamination ? remoteData.preoperativeExamination : {}),
      });
    }

    if (date) {
      handleDateChange(date);
      SModel_FamilyPlaningSchedulingDetails.getBetweenList(
        date.clone().startOf('year').subtract(365, 'day'),
        date.clone().endOf('year').add(365, 'day'),
      ).then(setYearsSchedul);
    }
    return () => { };
  }, [commonData]);

  useEffect(() => {
    bookingService.getKnowledgeType().then((data) => {
      setKnowledgeTypList(data.enumerations);
    });
    SModel_EarlyPregnancyCheckSurgeryType.getOptionalPregnancyList().then(setOptionalPregnancy);
  }, []);
  function doid() {
    if (!canEdit) {
      return Promise.resolve();
    }
    return form.validateFields().then((values) => {
      const submitData = {
        ...values,
        earlyPregnancyCheckPacTrackingFollowUpRecord: { ...valueToForm(values), followUpState: '已完成' },
        preoperativeExamination: values,
        id: remoteData?.id,
        informedConsents: informedConsents.current,
        progressStatus:
          remoteData?.progressStatus ?? stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('待签到'),
        registrationDate: remoteData?.registrationDate || dayjs(),
      };
      const p =
        !remoteData?.id ||
          remoteData?.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('待预约')
          ? SModel_EarlyPregnancyCheckSurgeryType.appointmentSurgery(submitData)
          : SModel_EarlyPregnancyCheckSurgeryType.appointmentSurgery(submitData);
      return p.then((r) => {
        setCommonData({ ...commonData, data: r });
        return r;
      });
    });
  }
  (form as any)._validateFields = doid;
  (form as any)._save = doid;

  const searchName = useCallback(
    debounce(
      (v: string) => SModel_EarlyPregnancyCheckSurgeryType.getOptionalPregnancyList(v).then(setOptionalPregnancy),
      500,
    ),
    [],
  );
  return (
    <div className="stupid-modal-body">
      {/* <InformedConsent /> */}
      <Form
        form={form}
        labelCol={{ xs: 6 }}
        wrapperCol={{ xs: 14 }}
        onValuesChange={(a, b) => {
          console.log('props', a);
          set_formData(b);
        }}
      >
        <Divider>患者信息 </Divider>
        <Row>
          <Col xs={8} >
            <Item label="" name="operatingRoom" rules={[{ required: false }]} hidden>
              <Input />
            </Item>
          </Col>
          <Col xs={8}>
            <Item hidden={!!remoteData?.id} label="姓名" name="name" rules={requiredRule}>
              <AutoComplete
                // allowClear
                showSearch
                placeholder="请选择"
                options={optionalPregnancy.map((_) => ({ label: _.name, value: _.id }))}
                onChange={(v) => {
                  const target = optionalPregnancy.find((_) => _.id.toString() === v.toString());

                  if (target) {
                    setFormData(target);
                  }
                  setSelected(!!target);
                }}
                optionFilterProp="label"
                onSearch={searchName}
              />
            </Item>
            <Item hidden={!remoteData?.id} label="姓名" name="name" rules={requiredRule}>
              <Input disabled={selected || disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="门诊号" name="outpatientNo" rules={requiredRule}>
              <Input disabled={selected || disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="证件号码" name="idNO" rules={requiredRule}>
              <Input disabled={selected || disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="手机号码" name="telephone" rules={requiredRule}>
              <Input disabled={selected || disabled} />
            </Item>
          </Col>

          <Col xs={16}>
            <Item label="家庭地址" name="residenceAddress" labelCol={{ xs: 3 }} wrapperCol={{ xs: 19 }}>
              <Input disabled={selected || disabled} />
            </Item>
          </Col>

          <Col xs={16}>
            <Item
              label="术前诊断"
              name="preoperativeDiagnosis"
              labelCol={{ xs: 3 }}
              wrapperCol={{ xs: 19 }}
              rules={[{ required: false }]}
            >
              <Input.TextArea disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="接诊日期" name="admissionTime" rules={[{ required: false }]}>
              <DatePicker_L format="YYYY-MM-DD" disabled={selected || disabled} />
            </Item>
          </Col>
          <Col xs={16}>
            <Item
              label="医嘱"
              name="doctorOrder"
              labelCol={{ xs: 3 }}
              wrapperCol={{ xs: 19 }}
              rules={[{ required: false }]}
            >
              <Input.TextArea disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="接诊医生" name="admissionDoctor">
              <Select
                placeholder="请输入"
                options={commonData?.optionalDoctor?.map((_) => ({ label: _, value: _ }))}
                disabled={disabled}
              />
            </Item>
          </Col>
          <Divider>术前检查</Divider>
          <Col xs={8}>
            <Item label="HIV" name="hiv">
              <StupidRadioGroup name="hiv" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="梅毒" name="syphilis">
              <StupidRadioGroup name="syphilis" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="乙肝" name="hepatitisB">
              <StupidRadioGroup name="hepatitisB" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="丙肝" name="hepatitisC">
              <StupidRadioGroup name="hepatitisC" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>

          <Col xs={8}>
            <Item label="凝血功能" name="sixCoagulation">
              <StupidRadioGroup name="sixCoagulation" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="白带" name="leucorrhea">
              <StupidRadioGroup name="leucorrhea" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="核酸" name="nat">
              <StupidRadioGroup name="nat" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>

          <Col xs={8}>
            <Item label="HB" name="hb">
              <InputNumber addonAfter="g/L" disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="MCV" name="mcv">
              <InputNumber addonAfter="fL" disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="PLT" name="plt">
              <InputNumber addonAfter="10^9/L" disabled={disabled} />
            </Item>
          </Col>

          <Col xs={8}>
            <Item label="麻醉评估" name="preanestheticEvaluation">
              <StupidRadioGroup name="preanestheticEvaluation" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="心电图" name="ecg">
              <StupidRadioGroup name="ecg" options={examStatusOptions} disabled={disabled} />
            </Item>
          </Col>
          <InformedConsentTable
            disabled={disabled}
            onChange={(v) => (informedConsents.current = v)}
            data={commonData?.data?.informedConsents}
          />
          <Divider>手术预约</Divider>
          <Col xs={8}>
            <Item label="手术名称" name="operationName" rules={requiredRule}>
              <Select<string>
                options={operationList.map((_) => ({ label: _, value: _ }))}
                disabled={disabled}
                placeholder="请选择"
                onChange={(target) => {
                  if (target) {
                    setTracingFormVisible(['人工流产', '药物流产'].includes(target) || __DEV__);
                  }
                }}
              />
            </Item>
          </Col>

          <Col xs={8}>
            <Item label="预约日期" name="appointmentDate" rules={requiredRule}>
              <DatePicker_L
                disabled={status === '待签到' || status === '超时' ? false : disabled}
                format="YYYY-MM-DD"
                onChange={(e) => {
                  handleDateChange(e);
                }}
                disabledDate={(d) => {
                  const target = yearsSchedul.find((_) => _.schedulingDate.isSame(d, 'day'));
                  return getAttendanceOfThisDay(target) === '休息';
                }}
              />
            </Item>
          </Col>
          <Col xs={8}>
            <div>
              剩余号源：{all - reserved}，已预约：{reserved}，开放号源：{all}
            </div>
          </Col>
          <Col xs={8}>
            <Item label="时间段" name="appointmentMorningOrAfternoon" rules={requiredRule}>
              <Select
                placeholder="请选择"
                disabled={status === '待签到' || status === '超时' ? false : disabled}
                allowClear
                options={['上午', '下午'].map((_, idx) => ({
                  value: _,
                  label: `${_} ${(idx ? afternoonReservationNum : morningReservationNum) >= 25 ? '（已满）' : ''}`,
                  disabled: checkDisabledHalfDay(scheduleData, _ as any),
                }))}
              />
            </Item>
          </Col>
          <Col xs={8}>
            <Item label="缴费情况" name="payment">
              <Select
                disabled
                options={['未缴费', '已缴费'].map((_, idx) => ({ label: _, value: idx }))}
                placeholder="未缴费"
              />
            </Item>
          </Col>
          {tracingFormVisible && (
            <Col xs={24}>{renderForm0_shared('首次随访', false, remoteData, false, () => { })}</Col>
          )}
        </Row>

        {/* <Row>
                    <Col xs={8}>
                        <Item label="健康宣教" rules={[{ required: false }]}  >
                            <Radio.Group disabled={disabled} defaultValue={"自定义"} onChange={e => setIsCustomized(e.target.value === '自定义')} options={['自定义', '知识库',].map(_ => ({ label: _, value: _ }))} />
                        </Item>
                    </Col>
                    <Col xs={16} >
                        <Item hidden={!isCustomized} label="宣教内容" labelCol={{ xs: 3 }} name="preoperativeMissionsContent" style={{ position: 'relative' }} rules={[{ required: false }]}  >
                            <TextareWithButton disabled={disabled} onValueCheck={v => { setFormData({ preoperativeMissionsContent: v }) }} />
                        </Item>
                        <Item hidden={isCustomized} label="请选择" labelCol={{ xs: 3 }} rules={[{ required: false }]}  >
                            <Space>
                                <Select disabled={disabled} options={knowledgeTypList} placeholder="请选择知识库类型" onChange={value => bookingService.getKnowledge(Number(value)).then(r => setKnowledgeList(r))} />
                                <Select<string> disabled={disabled} options={knowledgeList.map(_ => ({ label: _.title, value: _.content }))} placeholder="请选择知识库" onChange={value => setFormData({ preoperativeMissionsContent: value })} />
                            </Space>
                        </Item>

                    </Col>

                </Row> */}
        <Row>
          <Col xs={8}>
            <Item label="登记日期" name="registrationDate" rules={requiredRule}>
              <DatePicker_L format="YYYY-MM-DD" disabled />
            </Item>
          </Col>

          <Col xs={8}>
            <Item label="登记者" name="appointmentPeople" rules={requiredRule}>
              <Select
                placeholder="请输入"
                options={commonData?.optionalNurse?.map((_) => ({ label: _, value: _ }))}
                disabled={disabled}
              />
            </Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Form0;
