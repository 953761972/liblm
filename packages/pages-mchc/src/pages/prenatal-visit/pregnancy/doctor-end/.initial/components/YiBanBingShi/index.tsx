import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { SMchc_Doctor } from '@lm_fe/service';
import React from 'react';
import { useEffect } from 'react';
import { IInitial_Tab_props } from '../../types';
// import getConfig from './config';

export default function JWS(props: IInitial_Tab_props) {
  const { form, active, disabled_save } = props
  const id = mchcUtils.single_id()

  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-既往史', tableColumns: () => import('./config') } })
  useEffect(() => {
    if (active) {
      SMchc_Doctor.getFirstVisitPastmhOutpatient(id).then(v => {
        form.setFieldsValue(v)
      })
    }


    return () => {

    }
  }, [active])

  return <Wrap>
    <FormSectionForm
      disableAll={disabled_save}
      bf_config={config}

      onValuesChange={(changedValues) => {

      }}
      onFinish={(v) => {
        SMchc_Doctor.updateFirstVisitPastmhOutpatient(v)
          .then(() => mchcEvent.emit('outpatient', { type: '刷新头部' }))

      }}
      form={form} />
  </Wrap>
}
Object.assign(JWS, {
  Title: '既往史',
  Config: null,
  ClassName: 'yi-ban-bing-shi label-width6',
  tmp: true
})