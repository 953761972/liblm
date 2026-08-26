import { Button, Form, Space, message } from 'antd';
import {
  get
} from 'lodash';
import { useEffect, useState } from 'react';

import { FormSectionForm, MyIcon } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcLogger, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2, mchcModal__ } from '@lm_fe/pages';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_FirstVisitDiagnosisOutpatient, SMchc_Doctor } from '@lm_fe/service';
import React from 'react';
import { filter_diagnoses } from '../.utils';
import { IDoctorEnd_InitialProps } from './DoctorEnd_Initial';
import { 诊断处理_Tools } from './components/ZhenDuanChuLi/诊断处理_Tools';
import { use_现病史 } from './components/XianBingShi/use_现病史';
const single_id = mchcUtils.single_id


function DoctorEnd_Initial_Vertical(props: IDoctorEnd_InitialProps) {
  const { headerInfo, } = props;

  const pregnancyId = single_id();
  const [form] = Form.useForm()

  const [diagnosesList, setDiagnosesList] = useState<IMchc_Doctor_Diagnoses[]>([])
  const { fuck_conceive, fuck_sureEdd, check_edd_by_nt, set_dont_fuck_nt } = use_现病史({ pregnancyId, form }, 'presentHistory.sureEdd', 'presentHistory.ntExams')

  const { Wrap, config } = BF_Wrap2(
    { default_conf: { title: '门诊-垂直首诊', tableColumns: () => import('./verticalIndex_config') } },
    { ...props, less: false, fuck_conceive, fuck_sureEdd, }
  )

  const [disabled_save, set_disabled_save] = useState<boolean>()

  const [visitData, setVisitData] = useState<IMchc_Doctor_FirstVisitDiagnosisOutpatient>()











  useEffect(() => {

    init();

    return () => {

    }
  }, [])


  /**纵向一览风格初始数据 */
  async function init() {

    let res = await SMchc_Doctor.getFirstVisitInfoOfOutpatient(pregnancyId);
    mchcLogger.log('vertical init', res)
    const diagnosisAndAdvice = get(res, 'diagnosisAndAdvice')
    const d = get(diagnosisAndAdvice, 'diagnoses')

    const _diagnoses = filter_diagnoses(d)

    check_edd_by_nt(res)


    setVisitData(diagnosisAndAdvice)
    set_disabled_save(res.isBanned)
    setDiagnosesList(_diagnoses)
    form.setFieldsValue(res)
  }




  function verticlaHandleSubmit() {
    const values = form.getFieldsValue()
    handleSave(values)
  }

  async function handleSave(resData: any) {
    // console.log(resData);
    SMchc_Doctor.updateFirstVisitInfoOfOutpatient(resData).then((res) => {

      mchcEnv.success('信息保存成功');
      mchcEvent.emit('outpatient', { type: '刷新头部' })

      check_edd_by_nt(res)

    });
  };



  function handlePrint(resource: 'prenatalVisit' | 'prenatalVisit1') {
    const allFormData = form.getFieldsValue()
    let id = '';
    if (resource == 'prenatalVisit') {
      id = headerInfo?.id;
    } else {
      id = get(allFormData, `diagnosisAndAdvice.advice.id`)!;
      if (!id) {
        message.warning('请先保存');
      }
    }
    if (id) {



      mchcModal__.open('print_modal', {
        modal_data: {
          requestData: {
            url: '/api/pdf-preview',
            resource: resource || 'prenatalVisit',
            template: '',
            version: '',
            note: '',
            id,
          }
        }
      })
    }

  }





  function verticalRender() {
    return <Wrap>
      <FormSectionForm
        disableAll={disabled_save}

        onValuesChange={(changedValues) => {
          set_dont_fuck_nt(false)
        }}
        onFinish={(v) => {

        }}
        formDescriptions={config?.tableColumns}

        form={form}
      />
    </Wrap>
  }

  return (
    <div style={{ background: '#fff', paddingBottom: 48 }}>
      {verticalRender()}
      <div style={{ padding: '0 36px' }}>
        <诊断处理_Tools diagnosesList={diagnosesList} setDiagnosesList={setDiagnosesList} headerInfo={headerInfo} onRefresh={init} visitData={visitData} />
      </div>
      <Space style={{ position: 'fixed', right: 30, bottom: 30, zIndex: 999 }}>
        <Button size="large" onClick={() => handlePrint('prenatalVisit')} icon={<MyIcon value='PrinterOutlined' />}>
          打印档案
        </Button>
        <Button size="large" onClick={() => handlePrint('prenatalVisit1')} icon={<MyIcon value='PrinterOutlined' />}>
          打印病历
        </Button>
        <Button size="large" type="primary" onClick={verticlaHandleSubmit}>
          <MyIcon value='SaveOutlined' /> 保存
        </Button>
      </Space>
    </div>
  );
}
export default DoctorEnd_Initial_Vertical
