import { FormSectionForm, getBMI } from '@lm_fe/components_m';
import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { IMchc_Doctor_FirstVisitInfoOfOutpatient, SMchc_Doctor } from '@lm_fe/service';
import React from 'react';
import { useEffect } from 'react';
import { IInitial_Tab_props } from '../../types';
// import form_conf from './config';
type TData = IMchc_Doctor_FirstVisitInfoOfOutpatient['physicalExam']
export default function JWS(props: IInitial_Tab_props) {
  const { form, active, disabled_save } = props
  const id = mchcUtils.single_id()

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-体格检查', tableColumns: () => import('./config') } })
  useEffect(() => {
    if (active) {
      SMchc_Doctor.physicalExamOfOutpatient(id).then(v => {
        form.setFieldsValue(v)
      })
    }


    return () => {

    }
  }, [active])

  return <Wrap>
    <FormSectionForm
      disableAll={disabled_save}

      onValuesChange={(changedValues: TData, values: TData) => {
        const changedBase = changedValues.physicalBaseExam

        // if (changedBase?.preheight || changedBase?.weight) {
        //   const { preheight, weight } = values.physicalBaseExam
        //   const bmi = getBMI(weight, preheight,)
        //   form.setFieldsValue({ physicalBaseExam: { bmi } })
        // }

        // if (changedBase?.preheight || changedBase?.preweight) {
        //   const { preheight, preweight } = values.physicalBaseExam
        //   const preBmi = getBMI(preweight, preheight,)
        //   form.setFieldsValue({ physicalBaseExam: { preBmi } })
        // }

      }}
      onFinish={(v) => {
        SMchc_Doctor.updatePhysicalExamOfOutpatient(v)
          .then(() => mchcEvent.emit('outpatient', { type: '刷新头部' }))
      }}
      bf_config={config}
      form={form} />
  </Wrap>
}
Object.assign(JWS, {
  Title: '体格检查',
  Config: null,
  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})