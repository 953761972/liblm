import { handle_form_error, MyIcon, useMyEffectSafe } from '@lm_fe/components';
import { FormSectionForm, OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, HighRiskTableEntry } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdType } from '@lm_fe/service';
import { AnyObject, getFutureDate } from '@lm_fe/utils';
import { Col, message, Row, Space } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { get, isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { use_doctor_sign } from '../../../.utils/use_doctor_sign';
import { IInitial_Tab_props } from '../../types';
import './index.less';
import { 诊断处理_Tools } from './诊断处理_Tools';
interface IProps {
  diagnosis_addon_btns?: (data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient) => React.ReactNode
  diagnosis_before_submit?: (submit: (values: any) => Promise<void>, data?: IMchc_Doctor_FirstVisitDiagnosisOutpatient, form?: FormInstance) => Promise<void>

  headerInfo: IMchc_Doctor_OutpatientHeaderInfo,
  handlePrint?(resource: string, id?: TIdType): void

}

const Title = '诊断处理';
const ClassName = 'zhen-duan-chu-li';
function Index(props: IProps & IInitial_Tab_props) {

  const {
    // diagnosesList,
    handlePrint: _handlePrint,


    headerInfo,
    active,
    diagnosis_before_submit,
    diagnosis_addon_btns,
    form
  } = props;
  const preg_id = mchcUtils.single_id()

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-诊断处理', tableColumns: () => import('./config') } }, { form })

  const [diagnosesList, setDiagnosesList] = useState<IMchc_Doctor_Diagnoses[]>([])

  const [disabled_save, set_disabled_save] = useState<boolean>()

  const [visitData, setVisitData] = useState<IMchc_Doctor_FirstVisitDiagnosisOutpatient>()
  const v_id = get(visitData, `advice.id`);

  const { handle_cs_sign, sign_btn_disabled, sign_btn_hidden, sign_btn_text, save_btn_hidden, sign_confirm } = use_doctor_sign('prenatalFVisit', visitData)

  useEffect(() => {

    if (active) {
      initData()
    }


    return () => {

    }
  }, [active])
  useMyEffectSafe(props)(() => {
    const rm = mchcEvent.on_rm('my_form', async e => {
      // mchcEnv.logger.log('event receive', { e, })
      if (e.type === 'onChange' && e.name === 'advice') {

        const value = e.value;

        if (!isNil(value.appointmentCycle)) {
          e.setValue?.('advice', { appointmentDate: getFutureDate(value.appointmentCycle) })
        }

      }

    })
    return rm
  }, [])

  function initData() {

    return SMchc_Doctor.getFirstVisitDiagnosisOutpatient(preg_id).then(v => {
      setVisitData(v)
      setDiagnosesList(v.diagnoses)
      set_disabled_save(v.isBanned)
      form.setFieldsValue(v)
      HighRiskTableEntry.highRiskTablePopup(v, headerInfo);

    })
  }
  function get_form_data() {


    return form
      .validateFields()
      .catch((error) => {
        const first = handle_form_error(error)
        if (first?.text) mchcEnv.warning(first.text)
        return null
      })
  }
  async function sign() {
    const data = await get_form_data()
    await handle_cs_sign(data)
    initData()
  }

  function handleSubmitBefore() {
    if (!sign_confirm())
      return
    if (diagnosis_before_submit) {
      return diagnosis_before_submit(handleSubmit, visitData, form)
    }
    get_form_data().then(handleSubmit)

  }
  async function handleSubmit(values: AnyObject) {
    const re = await SMchc_Doctor.updateFirstVisitDiagnosisOutpatient({
      diagnoses: diagnosesList,
      ...values
    })
    HighRiskTableEntry.highRiskTablePopup(re, headerInfo);
    mchcEvent.emit('outpatient', { type: '刷新头部', })

  };




  function print(type: 'prenatalVisit1' | 'prenatalVisit') {
    if (type == 'prenatalVisit1') {
      if (v_id) {
        _handlePrint?.(type, v_id);
      } else {
        message.warning('请先保存');
      }
    } else {
      _handlePrint?.(type, undefined);
    }
  }








  return (
    <Row gutter={16} className="zhen-duan label-width5">
      <Col span="8">
        <诊断处理_Tools diagnosesList={diagnosesList} setDiagnosesList={setDiagnosesList} headerInfo={headerInfo} onRefresh={initData} visitData={visitData} />
      </Col>
      <Col span="16">
        <div className="form-wrapper">

          <Wrap>
            <FormSectionForm
              disableAll={disabled_save}

              onValuesChange={(changedValues) => {

              }}
              onFinish={(v) => {
                const values = form.getFieldsValue()
                handleSubmit(values)
              }}
              formDescriptions={false ? () => import('./config') : config?.tableColumns}

              form={form}
            />
          </Wrap>


        </div>
        <Space className="prenatal-visit-main_initial-btns">
          {
            diagnosis_addon_btns?.(visitData)
          }
          <OkButton size="large" onClick={() => print('prenatalVisit')} icon={<MyIcon value='PrinterOutlined' />}>
            打印档案
          </OkButton>
          <OkButton size="large" onClick={() => print('prenatalVisit1')} icon={<MyIcon value='PrinterOutlined' />}>
            打印病历
          </OkButton>




          <OkButton size="large" hidden={save_btn_hidden} primary disabled={disabled_save} onClick={handleSubmitBefore} icon={<MyIcon value='SaveOutlined' />}>
            保存
          </OkButton>

          <OkButton size="large" hidden={sign_btn_hidden} primary disabled={disabled_save || sign_btn_disabled} onClick={sign}>
            {sign_btn_text}
          </OkButton>
        </Space>
      </Col>


    </Row>
  );
}

Object.assign(Index, { Title, Config: null, ClassName })
export default Index
