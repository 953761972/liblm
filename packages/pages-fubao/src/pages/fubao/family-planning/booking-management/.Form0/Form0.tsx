import { mchcLogger, rt_ctx } from '@lm_fe/env';
const ctx = rt_ctx

import { MyFormSectionForm } from '@lm_fe/components_m';
import { BF_Wrap2 } from '@lm_fe/pages';
import { AnyObject, EventEmitter, safe_async_call, safeExec } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react';

import { Form } from 'antd';
import { IModel_EarlyPregnancyCheckSurgeryType } from 'src/pages/fubao/.stupid_model';


// import InformedConsent from './InformedConsent'
interface IProps {
  data?: Partial<IModel_EarlyPregnancyCheckSurgeryType>;
};


const Form0 = function Form0({ data, }: IProps) {

  const [form] = Form.useForm()

  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: '妇科专病-手术预约弹窗-手术预约',
      tableColumns: () => import('./form_config0'),

      handleBeforePopup(data: AnyObject) {
        const schedulingDate = ctx.utils.formatDate(data.appointmentDate|| undefined)
        const operationName = data.operationName
        data.appointmentPeople = data.appointmentPeople || ctx.mchcEnv.user_data.firstName
        data.registrationDate = ctx.utils.formatDate(data.registrationDate || undefined)
        data.admissionTime = ctx.utils.formatDate(data.admissionTime || undefined)
        const params = {
          'schedulingDate.equals': schedulingDate,
          // 'operationName.equals': 'colposcopyExamFee'
        }
        setTimeout(() => {
          ctx.request.get('/api/family/planning/getOpenSurgicalBySchedulingDate', { params, unboxing: true }).then(res => {
            const options = ctx.utils.expect_array(res.data)
            console.log('ggxx', options)
            ctx.mchcEvent.emit('my_form', {
              type: 'item',
              name: 'operationName',
              action: 'set_options',
              data: options.map(_ => ({ value: _, label: _ }))
            })
          })
          ctx.request.get('/api/family/planning/getSchedulingInformation', { params: { 'schedulingDate.equals': schedulingDate }, unboxing: true }).then(res => {
            const data = ctx.utils.expect_array(res.data)
            const item: any = data[0]
            if (!item) return

            const attendanceSet = item.attendanceSet || 0
            if (!attendanceSet) return
            const options = attendanceSet === 1 ? ['上午'] : (attendanceSet === 2 ? ['下午'] : ['上午', '下午'])
            ctx.mchcEvent.emit('my_form', {
              action: 'set_options',
              name: 'appointmentMorningOrAfternoon',
              data: options.map(_ => ({ value: _, label: _ })),
              type: 'item'
            })

          })
          ctx.mchcEvent.emit('custom_msg', { type: 'ts', data: { operationName: operationName, schedulingDate: schedulingDate } })
        }, 600);

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
