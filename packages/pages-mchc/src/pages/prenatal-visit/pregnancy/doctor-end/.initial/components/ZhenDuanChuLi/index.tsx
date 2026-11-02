import { handle_form_error, MyIcon, useMyEffectSafe } from '@lm_fe/components';
import { FormSectionForm, OkButton } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, HighRiskTableEntry } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, IMchc_Doctor_OutpatientHeaderInfo, SMchc_Doctor, TIdType } from '@lm_fe/service';
import { AnyObject, expect_array, getFutureDate, getSearchParamsAll, request } from '@lm_fe/utils';
import { Col, message, Row, Space } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { get, isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { use_doctor_sign } from '../../../.utils/use_doctor_sign';
import { IInitial_Tab_props } from '../../types';
import './index.less';
import { 诊断处理_Tools } from './诊断处理_Tools';
import moment from 'moment/moment'
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

  const [sync_loading, set_sync_loading] = useState(false)

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
    // 保存后重新加载页面内容（病历信息、诊断信息），与复诊保存后保持一致
    await initData();
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



    async function syncDiagAndAdvice() {
        if (!headerInfo?.id) {
            message.warning('请先选择就诊人')
            return
        }
        const prenatalVisitId = get(visitData, 'prenatalVisitId')
        const serialNo: any = get(visitData, 'serialNO') || get(visitData, 'serialNo')
        const visitDate = get(visitData, 'visitDate')
        if (!visitDate) {
            message.warning('请先保存病历')
            return
        }
        if (visitDate != moment().format('YYYY-MM-DD')) {
            message.warning('只能对当天的病历进行同步操作')
            return
        }
        set_sync_loading(true)
        try {
            // 同步诊断
            try {
                const searchParams = getSearchParamsAll()
                const res = await request.get<any[]>('/api/doctor/Diagnosis', {
                    params: { ...getSearchParamsAll(), id: headerInfo?.id, serialNO: searchParams.serialNo },
                })
                const fetchedDiagnoses = res.data ?? []
                if (fetchedDiagnoses.length === 0) {
                    message.info('未获取到诊断数据')
                } else {
                    const existingDiagnosisSet = new Set(diagnosesList.filter(d => d.prenatalVisitId === prenatalVisitId).map((d) => d.diagnosis))
                    const duplicateDiagnoses = fetchedDiagnoses.filter((d) => existingDiagnosisSet.has(d.diagnosis))
                    const newDiagnoses = fetchedDiagnoses.filter((d) => !existingDiagnosisSet.has(d.diagnosis))
                    if (duplicateDiagnoses.length > 0) {
                        const filteredNames = duplicateDiagnoses.map((d) => d.diagnosis).join('、')
                        message.warning('已过滤' + duplicateDiagnoses.length + '个重复诊断：' + filteredNames)
                    }
                    if (newDiagnoses.length > 0) {
                        const diagnosesToSave = newDiagnoses.map((d) => ({
                            ...d,
                            ...(prenatalVisitId ? { prenatalVisitId } : {}),
                            ...(serialNo ? { serialNo } : {}),
                            outEmrId: headerInfo.id,
                        }))
                        const savedDiagnoses = await SMchc_Doctor.new_diagnosis_list(diagnosesToSave)
                        setDiagnosesList([...diagnosesList, ...(savedDiagnoses ?? diagnosesToSave)])
                        mchcEnv.success('同步诊断成功，共添加' + newDiagnoses.length + '条诊断')
                        mchcEvent.emit('outpatient', { type: '刷新头部' })
                    } else if (duplicateDiagnoses.length > 0) {
                        message.info('所有诊断均已存在，无需同步')
                    }
                }
            } catch (error) {
                console.error('同步诊断失败', error)
            }

            // 同步医嘱
            try {
                const searchParams = getSearchParamsAll()
                const params = {
                    serialNO: searchParams.serialNo ?? searchParams.serialNO ?? serialNo,
                    patientNO: searchParams.patientNO,
                    outpatientNO: headerInfo?.outpatientNO ?? searchParams.outpatientNO,
                }
                const res = await request.get<string[]>('/api/doctor/getAdvice', { params })
                const advice = expect_array(res.data) as string[]
                if (advice.length > 0) {
                    const routineExam = form.getFieldValue('routineExam') ?? {}
                    // 医嘱列表按 `1、xxx 2、xxx` 的格式拼接
                    const prescription = advice.map((item, index) => `${index + 1}、${item}`).join(' ')
                    form.setFieldsValue({ routineExam: { ...routineExam, prescription } })
                    mchcEnv.success('同步医嘱成功')
                } else {
                    message.info('未获取到医嘱数据')
                }
            } catch (error) {
                console.error('同步医嘱失败', error)
            }
        } finally {
            set_sync_loading(false)
        }
    }





  return (
      <Row gutter={16} className="zhen-duan label-width5">
          <Col span="8">
              <诊断处理_Tools
                  diagnosesList={diagnosesList}
                  setDiagnosesList={setDiagnosesList}
                  headerInfo={headerInfo}
                  onRefresh={initData}
                  visitData={visitData}
              />
          </Col>
          <Col span="16">
              <div className="form-wrapper">
                  <Wrap>
                      <FormSectionForm
                          disableAll={disabled_save}
                          onValuesChange={(changedValues) => {}}
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
                  {diagnosis_addon_btns?.(visitData)}
                  <OkButton
                      size="large"
                      onClick={() => print('prenatalVisit')}
                      icon={<MyIcon value="PrinterOutlined" />}
                  >
                      打印档案
                  </OkButton>
                  <OkButton
                      size="large"
                      onClick={() => print('prenatalVisit1')}
                      icon={<MyIcon value="PrinterOutlined" />}
                  >
                      打印病历
                  </OkButton>
                  <OkButton hidden={!mchcEnv.is('中大惠亚')} loading={sync_loading} onClick={syncDiagAndAdvice}>
                      同步诊断和医嘱
                  </OkButton>

                  <OkButton
                      size="large"
                      hidden={save_btn_hidden}
                      primary
                      disabled={disabled_save}
                      onClick={handleSubmitBefore}
                      icon={<MyIcon value="SaveOutlined" />}
                  >
                      保存
                  </OkButton>

                  <OkButton
                      size="large"
                      hidden={sign_btn_hidden}
                      primary
                      disabled={disabled_save || sign_btn_disabled}
                      onClick={sign}
                  >
                      {sign_btn_text}
                  </OkButton>
              </Space>
          </Col>
      </Row>
  )
}

Object.assign(Index, { Title, Config: null, ClassName })
export default Index
