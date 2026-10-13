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


            "name": "体格情况",





            "fields": [{

                "key": "womenHealthcarePhysicalExamination.weight",
                "label": "体重(kg)",

                "inputType": "input_number",
                "tranferRules": { 'path': 'physicalExamMeasure.weight' },
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
                "tranferRules": { 'path': 'physicalExamMeasure.weight' },
                required: true,

                "inputProps": { 'placeholder': '请输入体温', 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }]
        }, {


            "name": "病史情况",





            "fields": [
                {
                    "key": "earlyPregnancyCheckMedicalHistory.chiefComplaint",
                    "label": "主诉",
                    layout: '3/4',
                    "inputType": 'textareaWithTemplate',
                    inputProps: {
                        TemplateTextarea_type: [
                            { title: '个人', type: 38 },
                            { title: '科室', type: 38, depid: 2 },
                        ]
                    },
                },
                {

                    "key": "earlyPregnancyCheckMedicalHistory.lmd",
                    "label": "末次月经",

                    "inputType": "DatePicker",
                    inputProps: { format: 'YYYY-MM-DD' },



                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.dueDate",
                    "label": "预产期-日期",

                    "inputType": "DatePicker",
                    inputProps: { format: 'YYYY-MM-DD' },


                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.gestationalWeek",
                    "label": "孕周",

                    "inputType": "input",




                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.menarche",
                    "label": "初潮(岁)",

                    "inputType": "input_number",
                    "tranferRules": { 'path': 'menstrualHistory.menarche' },


                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.menstrualCycle",
                    "label": "月经周期(天)",

                    "inputType": "input_number",
                    "tranferRules": { 'path': 'menstrualHistory.menstrualCycle' },


                    layout: '1/3',





                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.menstrualPeriod",
                    "label": "月经持续天数(天)",

                    "inputType": "input_number",
                    "tranferRules": { 'path': 'menstrualHistory.menstrualPeriod' },


                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.menstrualVolume",
                    "label": "经量",

                    "inputType": "MS",

                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'value': '多', 'label': '多', },
                            { 'value': '中', 'label': '中', },
                            { 'value': '少', 'label': '少', }]
                    },
                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.dysmenorrhea",
                    "label": "痛经",

                    "inputType": "MC",
                    inputProps: { options: 否是_options, marshal: 0 },

                    layout: '1/3',





                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.dysmenorrheaNote",
                    "label": "备注",

                    "inputType": "input",
                    showDeps: {
                        'earlyPregnancyCheckMedicalHistory.dysmenorrhea': [2]
                    },
                    inputProps: {},
                    layout: '1/3',

                },

                {

                    "key": "earlyPregnancyCheckMedicalHistory.takingFolicAcid",
                    "label": "是否服用叶酸",

                    "inputType": "MC",
                    inputProps: { options: 否是_options, marshal: 0 },

                    layout: '1/3',

                },
                {
                    "key": "earlyPregnancyCheckMedicalHistory.takingFolicAcidNote",
                    "label": "备注",

                    "inputType": "input",
                    showDeps: {
                        'earlyPregnancyCheckMedicalHistory.takingFolicAcid': [2]
                    },
                    inputProps: {},
                    layout: '1/3',

                },

                {

                    "key": "earlyPregnancyCheckMedicalHistory.conceived",
                    "label": "孕次",

                    "inputType": "input_number",


                    layout: '1/3',





                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.parity",
                    "label": "产次",

                    "inputType": "input_number",


                    layout: '1/3',





                }, {

                    "key": "earlyPregnancyCheckMedicalHistory.marriageHistory",
                    "label": "婚姻状况",

                    "inputType": "MS",


                    "inputProps": { uniqueKey: 'maritalMapping' },

                    layout: '1/3',






                }, {

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

                    "key": "earlyPregnancyCheckInspection.takingFolicAcid",
                    "label": "叶酸服用",

                    "inputType": "checkbox_with_input",


                    "inputProps": { marshal: 0, 'options': [{ 'value': '规律', 'label': '规律', }, { 'value': '间服', 'label': '间服', }, { 'value': '未服', 'label': '未服', }] },
                    'showDeps': { 'earlyPregnancyCheckMedicalHistory.takingFolicAcid': [2] },
                    layout: '1/3',






                }, {

                    "key": "earlyPregnancyCheckInspection.takingFolicSource",
                    "label": "叶酸来源",

                    "inputType": "MS",


                    "inputProps": { marshal: 0, 'options': [{ 'value': '免费领取', 'label': '免费领取', }, { 'value': '自行购买', 'label': '自行购买', }] },
                    layout: '1/3',

                    'showDeps': { 'earlyPregnancyCheckMedicalHistory.takingFolicAcid': [2] },





                }]
        }, {


            "name": "检验检查",





            "fields": [{

                "key": "earlyPregnancyCheckInspection.hcg",
                "label": "HCG(IU/L)",

                "inputType": "input_number",



                "inputProps": { 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }, {

                "key": "earlyPregnancyCheckInspection.gestationalSac",
                "label": "孕囊(个)",

                "inputType": "input_number",



                "inputProps": { 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





            }, {

                "key": "earlyPregnancyCheckInspection.yolkSac",
                "label": "卵黄囊(个)",

                "inputType": "input_number",



                "inputProps": { 'style': { 'width': 156 } },
                "span": 8,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 8 }, 'wrapperCol': { 'span': 16 } },





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





            "fields": [{

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.earlyPregnancyCheckDiagnosisInformations",
                "label": "诊断",

                "inputType": "diagnosis_list_v2",


                "inputProps": {  list_fuck_off: true },

                "span": 16,
                "offset": 0,
                "isNewRow": 0,
                "formItemLayout": { 'labelCol': { 'span': 4 }, 'wrapperCol': { 'span': 20 } },





            }, {

                "key": "earlyPregnancyCheckDiagnosisAndTreatment.treatmentMeasures",
                "label": "处理措施",

                "inputType": 'textareaWithTemplate',

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
                "label": "登记日期",

                "inputType": "DatePicker",
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





            }]
        }]
)