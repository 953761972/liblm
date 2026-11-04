import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { SMchc_Doctor } from '@lm_fe/service';
import React, { useEffect } from 'react';
import { IInitial_Tab_props } from '../../types';
export default function ZhuanKeJianCha(props: IInitial_Tab_props) {
  const { form, active, disabled_save } = props
  const id = mchcUtils.single_id()
  const { Wrap, config } = BF_Wrap2({ default_conf: { tableColumns: () => import('./form_config'), title: '门诊-专科检查', } })
  useEffect(() => {
    if (active) {
      SMchc_Doctor.getGynecologicalExamOfOutpatient(id).then(v => {
        form.setFieldsValue(v)
      })
    }



    return () => {

    }
  }, [active])

  return <Wrap>
    <FormSectionForm
      disableAll={disabled_save}

      onValuesChange={(changedValues) => {

      }}
      onFinish={(v) => {
        SMchc_Doctor.updateGynecologicalExamOfOutpatient(v)
          .then(() => mchcEvent.emit('outpatient', { type: '刷新头部' }))


      }}
      bf_config={config} form={form} />
  </Wrap>
}
Object.assign(ZhuanKeJianCha, {
  Title: '专科检查',

  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})