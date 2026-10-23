import { form_validate } from "@lm_fe/components";
import { rt_ctx } from "@lm_fe/env";
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

      label: "progressStatus",
      name: "progressStatus",
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
          disabledDeps: { progressStatus(v) { return !!v } },
          inputProps: {
            onPatientSelect(v, form) {
              if (form) {
                v.id = undefined
                form.setFieldsValue(v)
              }
            },
            PatientSelect_url: '/api/family/planning/getEarlyPregnancyCheckSurgicalTypeCPE',
            PatientSelect_filterKey: 'name',
            PatientSelect_displayKey: [{ label: '门诊号', value: 'outpatientNo' }, { label: '姓名', value: 'name' },],
          },
        },
        {
          label: '门诊号',
          disabledDeps: { progressStatus(v) { return !!v } },
          required: true,
          inputType: 'MA',
          layout: '1/3',
          name: 'outpatientNo'
        },
        {
          label: '证件号码',
          disabledDeps: { progressStatus(v) { return !!v } },
          layout: '1/3',
          inputType: 'MA',
          name: 'idNO'
        },
        {
          label: '手机号码',
          disabledDeps: { progressStatus(v) { return !!v } },
          layout: '1/3',
          inputType: 'MA',
          name: 'telephone'
        },
        {
          label: '家庭地址',
          disabledDeps: { progressStatus(v) { return !!v } },
          layout: '2/3',
          inputType: 'MA',
          name: 'residenceAddress'
        },
        {
          label: '术前诊断',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeDiagnosis',
          layout: '2/3',
          inputType: 'TemplateTextarea',
          inputProps: {
            rows: 2,
          }

        },
        {
          label: '接诊日期',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'admissionTime',
          inputType: 'DatePicker',
          layout: '1/3',
        },
        {
          label: '医嘱',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'doctorOrder',
          layout: '2/3',
          inputType: 'TemplateTextarea',
          inputProps: {
            rows: 2,
          }
        },
        {
          label: '接诊医生',
          disabledDeps: { progressStatus(v) { return !!v } },
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
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.hiv',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '梅毒',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.syphilis',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '乙肝',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.hepatitisB',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '丙肝',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.hepatitisC',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '凝血功能',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.sixCoagulation',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '白带',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.leucorrhea',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '核酸',
          name: 'preoperativeExamination.nat',
          disabledDeps: { progressStatus(v) { return !!v } },
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '麻醉评估',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.preanestheticEvaluation',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: '心电图',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.ecg',
          inputType: 'MC',
          layout: '1/3',
          inputProps: {
            options: '正常,异常,未查',
            marshal: 0,
          }
        },
        {
          label: 'HB',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.hb',
          inputType: 'input_number',
          layout: '1/3',
          unit: 'g/L',
        },
        {
          label: 'MCV',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.mcv',
          inputType: 'input_number',
          layout: '1/3',
          unit: 'fL',
        },
        {
          label: 'PLT',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'preoperativeExamination.plt',
          inputType: 'input_number',
          layout: '1/3',
          unit: '10^9/L',
        },
      ]
    },
    {

      label: "知情同意书",
      children: [
        {
          name: 'informedConsents',
          disabledDeps: { progressStatus(v) { return !!v } },
          inputType: "MyEditTable",
          inputProps: {
            marshal: 0,
            genRowData(list?: any[]) { return { archiveTime: ctx.utils.formatDate() } },
            formDescriptions: [
              { title: '名称', dataIndex: 'consentName', inputType: 'Input', },
              { title: '状态', dataIndex: 'state', inputType: 'MS', inputProps: { options: '待归档,已归档', marshal: 0 } },
              { title: '归档时间', dataIndex: 'archiveTime', inputType: 'DatePicker', inputProps: { format: 'YYYY-MM-DD HH:mm' } },
            ]
          },
          layout: '1/1'
        }
      ]
    },
    {

      label: "手术预约",
      children: [
        {
          label: '手术名称',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'operationName',
          inputType: 'MS',
          layout: '1/3',
          required: true,
          inputProps: {
            marshal: 0
          },
          processLocal(v: string, form: FormInstance, conf) {
            if (!v) return
            ctx.mchcEvent.emit('custom_msg', { type: 'ts', data: { operationName: v, schedulingDate: form.getFieldValue('appointmentDate') } })

          },
        },
        {
          label: '预约日期',
          required: true,
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'appointmentDate',
          inputType: 'DatePicker',
          layout: '1/3',
          inputProps: {
          },
          processLocal(v, form, conf) {
            if (!v || !form) return
            ctx.mchcEvent.emit('custom_msg', { type: 'ts', data: { operationName: form.getFieldValue('operationName'), schedulingDate: v } })

            form.setFieldsValue({ appointmentMorningOrAfternoon: null, operationName: null })
            const schedulingDate = ctx.utils.formatDate(v)
            ctx.request.get('/api/family/planning/getOpenSurgicalBySchedulingDate', { params: { 'schedulingDate.equals': schedulingDate }, unboxing: true }).then(res => {
              const options = ctx.utils.expect_array(res.data)

              ctx.mchcEvent.emit('my_form', {
                action: 'set_options',
                name: 'operationName',
                data: options.map(_ => ({ value: _, label: _ })),
                type: 'item'
              })

            })
            ctx.request.get('/api/family/planning/getSchedulingInformation', { params: { 'schedulingDate.equals': schedulingDate }, unboxing: true }).then(res => {
              const data = ctx.utils.expect_array(res.data)
              const item: any = data[0]
              if (!item) return

              //             0: '休息',
              // 1: '上午',
              // 2: '下午',
              // 3: '全天',
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
          },
        },

        {
          label: '提示',
          name: 'tishi',
          inputType: 'component',
          layout: '1/3',
          inputProps: {
            component: function () {
              return ctx.ui.OnSetRender({
                type: 'ts',
                render(state) {
                  return '剩余:' + (state.total - state.reserved) + ' 已预约:' + state.reserved + ' 开放号源:' + state.total
                },
                on(event_params, set_data) {
                  if (!ctx.utils.isObject(event_params)) return
                  const params = { 'schedulingDate.equals': ctx.utils.formatDate(event_params.schedulingDate), 'operationName.equals': event_params.operationName }
                  ctx.request.get('/api/family/planning/getSchedulingQuota', { params, unboxing: true }).then(res => set_data(res.data))
                },
              })
            }
          },

        },

        {
          label: '时间段',
          required: true,
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'appointmentMorningOrAfternoon',
          inputType: 'MS',
          layout: '1/3',
          inputProps: {
            marshal: 0,
          }
        },
        {
          label: '缴费情况',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'payment',
          inputType: 'MS',
          layout: '1/3',
          inputProps: {
            marshal: 0,
            options: '未缴费,已缴费'
          }
        },
        {
          label: '登记者',
          disabledDeps: { progressStatus(v) { return !!v } },
          name: 'appointmentPeople',
          inputType: 'MA',
          layout: '1/3',
          inputProps: {
          }
        },
        {
          label: '登记日期',
          disabledDeps: { progressStatus(v) { return true } },
          name: 'registrationDate',
          inputType: 'DatePicker',
          layout: '1/3',
          inputProps: {
            disabled: true
          },

        },
      ]
    },

    {
      label: '',
      inputType: 'MyButton',
      showDeps: {
        progressStatus(v) {
          return !v || v < 2
        }
      },
      span: 4,
      offset: 20,
      inputProps: {
        btn_text: '预约',
        on_btn_click(e, form) {
          if (!form) return
          return ctx.mchcEnv.validate_form(form)
            .then(values => {
              values.progressStatus = 2
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