import { mchcLogger, mchcUtils } from '@lm_fe/env';
import { conceive_fuck_edd, nt_fuck_edd } from '@lm_fe/pages';
import { IMchc_Doctor_FirstVisitPresentmhOutpatient } from '@lm_fe/service';
import { AnyObject, debounce, get, set } from '@lm_fe/utils';
import { FormInstance } from 'antd';
import { useState } from 'react';
import { api } from '../../../.api';
// import getConfig from './config';

export function use_现病史(props: { form: FormInstance, pregnancyId: any }, sureEdd_path = 'sureEdd', ntExams_path = 'ntExams') {
  const { form, pregnancyId } = props
  const [dont_fuck_nt, set_dont_fuck_nt] = useState(false)


  const set_sureEdd = (edd: string) => form.setFieldsValue(set({}, sureEdd_path, edd))
  const fuck_sureEdd = debounce({ delay: 1000 }, async function fuck(sureEdd: string) {

    // 接口没有返回体，所以下面的不执行
    const data = await api.initial.updateGesweekAlert(pregnancyId, sureEdd);

  })
  function fuck_conceive(conceiveMode__: string) {
    conceive_fuck_edd(conceiveMode__).then(set_sureEdd)
  }
  function check_edd_by_nt(data: AnyObject,) {
    if (dont_fuck_nt) return
    nt_fuck_edd(get(data, ntExams_path), get(data, sureEdd_path))
      .then(str => {
        mchcLogger.log('vertical check_edd_by_nt', str, sureEdd_path, ntExams_path, form)
        set_sureEdd(str)
      })
      .catch(() => {
        set_dont_fuck_nt(true)
      })
  };




  return {
    fuck_conceive,
    fuck_sureEdd,
    check_edd_by_nt,
    set_dont_fuck_nt
  }
}
