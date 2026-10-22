import { mchcLogger, rt_ctx } from '@lm_fe/env';
const ctx = rt_ctx

import { MyFormSectionForm } from '@lm_fe/components_m';
import { BF_Wrap2 } from '@lm_fe/pages';
import { AnyObject, EventEmitter, safe_async_call, safeExec } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react';

import { Form } from 'antd';
import { IModel_EarlyPregnancyCheckSurgeryType } from '../../../.stupid_model';


// import InformedConsent from './InformedConsent'
interface IProps {
  data?: Partial<IModel_EarlyPregnancyCheckSurgeryType>;
};


const Form0 = function Form0({ data, }: IProps) {

  const [form] = Form.useForm()

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: '妇科专病-手术预约弹窗-术前签到',
      tableColumns: () => import('./form_config1'),

      handleBeforePopup(data: AnyObject) {
        data.signInRegistrant = data.signInRegistrant || ctx.mchcEnv.user_data.firstName
        data.signInTime = ctx.utils.formatDate(data.signInTime || undefined)

        return data

      }
    }
  }, {
    table_helper: {

    }
  })








  function setFormData(formData?: Partial<IModel_EarlyPregnancyCheckSurgeryType>) {
    if (formData) {
      form.setFieldsValue({
        ...formData,
      });
    }
  }

  useEffect(() => {
    mchcLogger.log('xxf data', data)
    if (data) {
      try {
        setTimeout(() => {
          const v = safeExec(config?.handleBeforePopup, data) ?? data
          setFormData(v)
        }, 50);
      } catch (e) {

      }

    }


    return () => { };
  }, [data, config]);

  useEffect(() => {


  }, [])




  return (
    <div >
      <Wrap>
        <MyFormSectionForm form={form} formDescriptions={config?.tableColumns} />
      </Wrap>
    </div>
  );
};
export default Form0;
