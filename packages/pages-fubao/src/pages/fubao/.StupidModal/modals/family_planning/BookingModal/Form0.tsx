import { rt_ctx } from '@lm_fe/env';
const ctx = rt_ctx

import { MyFormSectionForm } from '@lm_fe/components_m';
import { BF_Wrap2 } from '@lm_fe/pages';
import { AnyObject, safe_async_call, safeExec } from '@lm_fe/utils';
import React, { useEffect, useState } from 'react';
import {
  IModel_EarlyPregnancyCheckSurgeryType
} from '../../../../.stupid_model';
import { IStepFormComponentType } from './StepModal';


// import InformedConsent from './InformedConsent'
export type TCommonData = {
  data?: Partial<IModel_EarlyPregnancyCheckSurgeryType>;
  optionalDoctor?: string[];
  optionalNurse?: string[];
};


const Form0: IStepFormComponentType<TCommonData, any> = function Form0({ form, setCommonData, commonData }) {



  const { Wrap, config } = BF_Wrap2({
    default_conf: {
      title: '妇科专病-手术预约弹窗-手术预约',
      tableColumns: () => import('./form_config0'),
      beforeSubmit(data: AnyObject) {
        if (data.progressStatus >= 2) return data
        data.progressStatus = 2
        data.appointmentDate = ctx.utils.formatDate(data.appointmentDate)
        return ctx.request.post('/api/family/planning/updateAppointmentSurgery', data).then(r => ctx.utils.get(r, 'data.data'))
      },
      handleBeforePopup(data: AnyObject) {
        const schedulingDate = ctx.utils.formatDate(data.appointmentDate)
        const operationName = data.operationName
        data.appointmentPeople = data.appointmentPeople || ctx.mchcEnv.user_data.firstName
        data.registrationDate = ctx.utils.formatDate(data.registrationDate)
        data.admissionTime = ctx.utils.formatDate(data.admissionTime)
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
  const remoteData = commonData?.data;

  const [_formData, set_formData] = useState<Partial<IModel_EarlyPregnancyCheckSurgeryType>>({});






  function setFormData(formData?: Partial<IModel_EarlyPregnancyCheckSurgeryType>) {
    if (formData) {
      set_formData(formData);
      form.setFieldsValue({
        ...formData,
      });
    }
  }

  useEffect(() => {
    if (remoteData) {
      try {
        setTimeout(() => {
          const v = safeExec(config?.handleBeforePopup, remoteData) ?? remoteData
          setFormData(v)
        }, 50);
      } catch (e) {

      }
      // setFormData({
      //   appointmentPeople: remoteData?.appointmentPeople || SLocal_State.getUserData().firstName,
      //   registrationDate: remoteData?.registrationDate || dayjs(),
      //   ...remoteData,
      // });
    }


    return () => { };
  }, [commonData]);

  useEffect(() => {



  }, []);
  function doid() {

    return form.validateFields().then((values) => {

      return safe_async_call(config?.beforeSubmit, values).then((r) => {
        console.log('ggh', r)
        setCommonData({ ...commonData, data: r });
        return r;
      });
    });
  }
  (form as any)._validateFields = doid;
  (form as any)._save = doid;


  return (
    <div className="stupid-modal-body">
      <Wrap>
        <MyFormSectionForm form={form} formDescriptions={config?.tableColumns} />
      </Wrap>
    </div>
  );
};
export default Form0;
