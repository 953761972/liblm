import { pressure_fd } from "@lm_fe/pages";
import { defineFormConfig } from "@lm_fe/service";
const 否是_options = [{ value: 1, label: '否' }, { value: 2, label: '是' },]
export default defineFormConfig(
    [
        { key: 'earlyPregnancyCheckDiagnosisAndTreatment.id', form_hidden: true },
        { key: 'earlyPregnancyCheckInspection.id', form_hidden: true },
        { key: 'earlyPregnancyCheckMedicalHistory.id', form_hidden: true },
        { key: 'womenHealthcarePhysicalExamination.id', form_hidden: true },
        {

            "name": "病史情况",
            "sort": 0,



            "fields": [
                {
                    "key": "earlyPregnancyCheckMedicalHistory.familyHistory",
                    "label": "家族史",

                    "inputType": "MC",

                    inputProps: { options: 否是_options, marshal: 0 },
                    layout: '1/3',

                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.familyHistoryNote",
                    "label": "备注",

                    "inputType": "input",
                    showDeps: {
                        'earlyPregnancyCheckMedicalHistory.familyHistory': [2]
                    },
                    inputProps: {},
                    layout: '1/3',

                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.chiefComplaint",
                    "label": "主诉",

                    "inputType": 'textareaWithTemplate',
                    inputProps: {
                        TemplateTextarea_type: [
                            { title: '个人', type: 38 },
                            { title: '科室', type: 38, depid: 2 },
                        ]
                    },

                    layout: '1/2',


                },
                {

                    "key": "earlyPregnancyCheckMedicalHistory.medicalHistoryNow",
                    "label": "现病史",

                    "inputType": "MC",

                    inputProps: { options: 否是_options, marshal: 0 },
                    layout: '1/3',

                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.medicalHistoryNowNote",
                    "label": "备注",

                    "inputType": "input",
                    showDeps: {
                        'earlyPregnancyCheckMedicalHistory.medicalHistoryNow': [2]
                    },
                    inputProps: {},
                    layout: '1/3',

                },
                {

                    "key": "earlyPregnancyCheckMedicalHistory.personalHistory",
                    "label": "个人史",

                    "inputType": "MC",

                    inputProps: { options: 否是_options, marshal: 0 },
                    layout: '1/3',

                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.personalHistoryNote",
                    "label": "备注",

                    "inputType": "input",
                    showDeps: {
                        'earlyPregnancyCheckMedicalHistory.personalHistory': [2]
                    },
                    inputProps: {},
                    layout: '1/3',

                },

            ]
        }, {

            "name": "体格情况",
            "flag": "专科病例-常规接诊-体格情况",
            "sort": 0,



            "fields": [{

                "key": "womenHealthcarePhysicalExamination.weight",
                "label": "体重(kg)",

                "inputType": "input_number",

                required: true,

                "inputProps": { 'placeholder': '请输入体重', 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            },

            pressure_fd(
                { label: '血压(mmHg)', layout: '1/3', },
                { name: 'womenHealthcarePhysicalExamination.systolic' },
                { name: 'womenHealthcarePhysicalExamination.diastolic' }
            ),


            {

                "key": "womenHealthcarePhysicalExamination.bodyTemperature",
                "label": "体温(°C)",

                "inputType": "input_number",

                required: true,

                "inputProps": { 'placeholder': '请输入体温', 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }]
        }, {

            "name": "检验检查",
            "sort": 0,



            "fields": [{

                "key": "earlyPregnancyCheckInspection.checkInspection",
                "label": "检验检查",

                "inputType": "text_area",




                "span": 16,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





            }, {

                "key": "earlyPregnancyCheckInspection.ultrasoundDiagnosis",
                "label": "B超诊断",

                "inputType": "text_area",




                "span": 16,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





            }]
        }, {

            "name": "诊断及处理",
            "sort": 0,



            "fields": [{

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.earlyPregnancyCheckDiagnosisInformations",
                "label": "诊断",

                "inputType": "diagnosis_list_v2",


                "inputProps": { list_fuck_off: true },


                "span": 16,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.treatmentMeasures",
                "label": "处理措施",

                "inputType": 'TemplateTextarea',



                inputProps: {
                    TemplateTextarea_type: [
                        { title: '个人', type: 37 },
                        { title: '科室', type: 37, depid: 2 },
                    ]
                },
                "span": 16,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentWeeksLater",
                "label": "预约复诊",

                "inputType": "MS",


                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '1周后' }, { 'value': 2, 'label': '2周后' }, { 'value': 3, 'label': '3周后' }] },
                "span": 8,
                "offset": 0,
                "isNewRow": 1,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentSpecificDate",
                "label": "",

                "inputType": "DatePicker",
                inputProps: { format: 'YYYY-MM-DD' },


                "span": 4,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 0 }, 'wrapperCol': { 'span': 24 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.appointmentMorningOrAfternoon",
                "label": "",

                "inputType": "MS",


                "inputProps": { marshal: 0, 'options': [{ 'value': '上午', 'label': '上午' }, { 'value': '下午', 'label': '下午' }] },
                "span": 4,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 0 }, 'wrapperCol': { 'span': 24 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.registrationDate",
                "label": "登记日期.",

                "inputType": 'DatePicker',

                inputProps: { format: 'YYYY-MM-DD' },

                "span": 8,
                "offset": 0,
                "isNewRow": 1,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.diagnoseDoctor",
                "label": "接诊医生",

                "inputType": "input",




                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }]
        }]
)