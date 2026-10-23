import { form_validate } from "@lm_fe/components";
import { rt_ctx } from "@lm_fe/env";
import { pressure_fd } from "@lm_fe/pages";
import { defineFormConfig } from "@lm_fe/service";
import { FormInstance } from "antd";

const ctx = rt_ctx


export default defineFormConfig(
  [
    {

      label: "id",
      name: "id",
      form_hidden: true,
    },


    {

      label: "患者信息",
      children: [

        {
          layout: '1/3',
          label: '姓名',
          inputType: 'PatientSelect',
          required: true,
          name: 'name',

          inputProps: {
            is_read: true,
            onPatientSelect(v, form) {
              if (form) {
                v.id = undefined
                form.setFieldsValue({ earlyPregnancyCheckPacTrackingFollowUpRecord: v })
              }
            },
            PatientSelect_url: '/api/family/planning/getEarlyPregnancyCheckSurgicalTypeCPE',
            PatientSelect_filterKey: 'name',
            PatientSelect_displayKey: [{ label: '门诊号', value: 'outpatientNo' }, { label: '姓名', value: 'name' },],
          },
        },
        {
          label: '门诊号',
          required: true,
          inputType: 'MA',
          layout: '1/3',
          inputProps: {
            is_read: true,
          },
          name: 'outpatientNo'
        },
        {
          label: '证件号码',
          inputProps: {
            is_read: true,
          },
          layout: '1/3',
          inputType: 'MA',
          name: 'idNO'
        },
        {
          label: '手机号码',
          inputProps: {
            is_read: true,
          },
          layout: '1/3',
          inputType: 'MA',
          name: 'telephone'
        },
        {
          label: '家庭地址',
          inputProps: {
            is_read: true,
          },
          layout: '2/3',
          inputType: 'MA',
          name: 'residenceAddress'
        },

        {
          label: '医嘱',
          inputProps: {
            is_read: true,
            rows: 2,
          },
          name: 'doctorOrder',
          layout: '2/3',
          inputType: 'TemplateTextarea',
        },
        {
          label: '接诊医生',
          inputProps: {
            is_read: true,
          },
          inputType: 'MA',
          name: 'admissionDoctor',
          layout: '1/3',
        },
      ]
    },
    {

      label: "术前检查",
      children: [
        {
          label: 'HIV',

          name: 'preoperativeExamination.hiv',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            is_read: true,
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '梅毒',

          name: 'preoperativeExamination.syphilis',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            is_read: true,
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '乙肝',
          name: 'preoperativeExamination.hepatitisB',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '丙肝',

          name: 'preoperativeExamination.hepatitisC',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '凝血功能',

          name: 'preoperativeExamination.sixCoagulation',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '白带',

          name: 'preoperativeExamination.leucorrhea',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '核酸',
          name: 'preoperativeExamination.nat',

          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '麻醉评估',

          name: 'preoperativeExamination.preanestheticEvaluation',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            is_read: true,
            marshal: 0,
          }
        },
        {
          label: '心电图',

          name: 'preoperativeExamination.ecg',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            is_read: true,
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: 'HB',

          name: 'preoperativeExamination.hb',
          inputType: 'input_number',
          layout: '1/3',
          unit: 'g/L',
          inputProps: {
            is_read: true,

          }
        },
        {
          label: 'MCV',

          name: 'preoperativeExamination.mcv',
          inputType: 'input_number',
          layout: '1/3',
          unit: 'fL',
          inputProps: {
            is_read: true,

          }
        },
        {
          label: 'PLT',

          name: 'preoperativeExamination.plt',
          inputType: 'input_number',
          layout: '1/3',
          unit: '10^9/L',
          inputProps: {
            is_read: true,

          }
        },
      ]
    },
    {

      label: "手术预约",
      children: [
        {
          label: '手术名称',
          name: 'operationName',
          inputType: 'MA',
          layout: '1/3',
          required: true,
          inputProps: {
            is_read: true,
          },

        },
        {
          label: '预约日期',
          required: true,

          name: 'appointmentDate',
          inputType: 'DatePicker',
          layout: '1/3',
          inputProps: {
            is_read: true,

          },

        },



        {
          label: '时间段',
          required: true,

          name: 'appointmentMorningOrAfternoon',
          inputType: 'MA',
          layout: '1/3',
          inputProps: {
            is_read: true,
          }
        },
        {
          label: '缴费情况',

          name: 'payment',
          inputType: 'MS',
          layout: '1/3',
          inputProps: {
            marshal: 0,
            is_read: true,
            options: '未缴费,已缴费'
          }
        },
        {
          label: '登记者',

          name: 'appointmentPeople',
          inputType: 'MA',
          layout: '1/3',
          inputProps: {
            is_read: true,

          }
        },

      ]
    },
    {

      label: "术前签到",
      children: [
        pressure_fd(
          {
            label: '血压', layout: '1/3',

          },
          {
            name: 'preoperativeDiastolic',
            disabledDeps: {
              progressStatus(v) { return v > 2 }
            },
          },
          {
            name: 'preoperativeSystolic',
            disabledDeps: {
              progressStatus(v) { return v > 2 }
            },
          },
        ),

        {
          label: '体温',
          disabledDeps: {
            progressStatus(v) { return v > 2 }
          },
          name: 'preoperativeBodyTemperature',
          inputType: 'input_number',
          layout: '1/3',
          unit: '°C',
          inputProps: {
          }
        },
        {
          label: '空腹',
          disabledDeps: {
            progressStatus(v) { return v > 2 }
          },
          name: 'preoperativeFasting',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '否,是',
            marshal: 0
          }
        },
        {
          label: '备注',
          disabledDeps: {
            progressStatus(v) { return v > 2 }
          },
          name: 'preoperativeNote',
          inputType: 'MA',
          layout: '2/3',
          inputProps: {
          }
        },


        {
          label: '签到日期',
          required: true,
          disabledDeps: {
            progressStatus(v) { return v > 2 }
          },
          name: 'signInTime',
          inputType: 'DatePicker',
          layout: '1/3',
          inputProps: {

          },

        },


        {
          label: '签到登记者',
          name: 'signInRegistrant',
          inputType: 'MA',
          layout: '1/3',
          disabledDeps: {
            progressStatus(v) { return v > 2 }
          },
        },

        {

          label: "状态",
          name: "progressStatus",
          inputType: 'MS',
          layout: '1/3',
          inputProps: {
            is_read: true,
            marshal: 0,
            options: '待预约,待签到,已签到,已完成'
          }
        },
      ]
    },

    {
      label: '',
      inputType: 'MyButton',

      span: 4,
      offset: 20,
      showDeps: {
        progressStatus(v) {
          return v === 2
        }
      },
      inputProps: {

        btn_text: '签到',
        on_btn_click(e, form) {
          if (!form) return
          return ctx.mchcEnv.validate_form(form)
            .then(values => {
              values.progressStatus = 3
              values.appointmentDate = ctx.utils.formatDate(values.appointmentDate)
              return ctx.request.post('/api/family/planning/updateAppointmentSurgery', values, {})
                .then(r => {
                  form.setFieldsValue(ctx.utils.get(r, 'data.data'))
                })
            })

        },
      }
    }

  ]
)