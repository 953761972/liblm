import { FormSectionForm } from '@lm_fe/components_m';
import { mchcEvent, mchcUtils } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { SMchc_Doctor } from '@lm_fe/service';
import React, { useEffect } from 'react';
import { IInitial_Tab_props } from '../../types';
// import getConfig from './config';
import { use_现病史 } from './use_现病史';
export default function JWS(props: IInitial_Tab_props) {
  const { form, active, set_disabled_save, disabled_save } = props

  const pregnancyId = mchcUtils.single_id()
  const { fuck_conceive, fuck_sureEdd, check_edd_by_nt, set_dont_fuck_nt } = use_现病史({ pregnancyId, form }, 'sureEdd', 'ntExams')





  const { Wrap, config } = BF_Wrap2({ default_conf: { title: '门诊-现病史', tableColumns: () => import('./config') } }, { ...props, fuck_sureEdd, fuck_conceive })

  useEffect(() => {
    if (active) {
      SMchc_Doctor.getFirstVisitPresentmh_out(pregnancyId).then(v => {
        set_disabled_save?.(v.isBanned)
        check_edd_by_nt(v)
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
      onValuesChange={(changedValues) => { set_dont_fuck_nt(false) }}
      onFinish={(v) => {
        SMchc_Doctor.updateFirstVisitPresentmh_out(v)
          .then((v) => {
            form.setFieldsValue(v)
            check_edd_by_nt(v)

            mchcEvent.emit('outpatient', { type: '刷新头部' })
          })

      }}
      form={form} />
  </Wrap>
}
Object.assign(JWS, {
  Title: '现病史',
  tmp: true
})