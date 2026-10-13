import { rt_ctx } from "@lm_fe/env";
import { pressure_fd } from "@lm_fe/pages";
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig(
    [
        {
            "name": "基本信息",
            "fields": [
                {
                    "key": "preoperativeDiagnosis",
                    "label": "术前诊断",
                    "inputType": "text_area",
                    layout: '2/3',
                },
                {
                    "key": "operationName",
                    "label": "手术名称",
                    "inputType": "MA",
                    layout: '1/3',
                    "inputProps": { 'disabled': true, uniqueKey: 'surgicalMapping', marshal: 0 },
                    "isNewRow": 1,
                },
                {
                    "key": "surgicalGrade",
                    "label": "手术级别",
                    layout: '1/3',
                    "inputType": "MS",
                    "inputProps": { 'uniqueKey': 'PdOperation.grade.手术级别', marshal: 0 },
                },
                {
                    "key": "surgicalNumber",
                    layout: '1/3',
                    "label": "手术编号",
                    "inputType": "input",
                },
                {
                    "key": "appointmentDate",
                    layout: '1/3',
                    "label": "预约日期",
                    "inputType": "single_date_picker",
                    "inputProps": { 'disabled': true },
                },
                {
                    "key": "surgicalDate",
                    layout: '1/3',
                    "label": "手术日期",
                    "inputType": "single_date_picker",
                },
                {
                    "key": "appointmentPeople",
                    layout: '1/3',
                    "label": "登记者",
                    "inputType": "input",
                }
            ],
        },
        {
            "name": "术前检查",
            "fields": [{
                "key": "preoperativeExamination.hiv",
                "label": "HIV",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [
                        { 'value': 1, 'label': '正常', },
                        { 'value': 2, 'label': '异常', },
                        {
                            'value': 3, 'label': '未查',
                        }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.syphilis",
                "label": "梅毒",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hepatitisB",
                "label": "乙肝",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.sixCoagulation",
                "label": "凝血功能",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.leucorrhea",
                "label": "白带",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hepatitisC",
                "label": "丙肝",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hb",
                "label": "HB",
                "inputType": "input_number",
                "inputProps": { 'unit': 'g/L' },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.mcv",
                "label": "MCV",
                "inputType": "input_number",
                "inputProps": { 'unit': 'fL' },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.plt",
                "label": "PLT",
                "inputType": "input_number",
                "inputProps": { 'unit': 'x10^9/L' },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.preanestheticEvaluation",
                "label": "麻醉评估",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.ecg",
                "label": "心电图",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.nat",
                "label": "核酸",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '阴性', }, { 'value': 2, 'label': '阳性', }, {
                        'value': 3, 'label': '未查',
                    }]
                },
                layout: '1/3',
            },
            pressure_fd(
                { label: '血压(mmHg)', layout: '1/3', },
                { name: 'preoperativeSystolic' },
                { name: 'preoperativeDiastolic' }
            ),
            {
                "key": "preoperativeBodyTemperature",
                "label": "体温(°C)",
                "inputType": "input_number",
                layout: '1/3',
            }, {
                "key": "preoperativeFasting",
                "label": "是否空腹",
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '是', }, { 'value': 2, 'label': '否', }]
                },
                layout: '1/3',
            }, {
                "key": "preoperativeNote",
                "label": "备注",
                "inputType": "input",
                layout: '1/3',
            }],
        }, {
            "name": "手术过程",
            "fields": [
                {
                    "label": "手术起止时间",
                    "layout": "2/3",
                    "inputType": "straw",
                    "children": [
                        {
                            "key": "operationTimeStart",
                            layout: '1/2',
                            "inputType": "single_time_picker",
                            "inputProps": { 'format': 'HH:mm' },
                        },
                        {
                            "key": "operationTimeEnd",
                            layout: '1/2',
                            "inputType": "single_time_picker",
                            "inputProps": { 'format': 'HH:mm', },
                        },
                    ],
                },

                {
                    "key": "disposableSurgicalKit",
                    "label": "一次性手术包",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'value': '宫安康', 'label': '宫安康', },
                            { 'value': '可视管', 'label': '可视管', }
                        ]
                    },
                    layout: '1/3',
                }, {
                    "key": "injectUterineFluid",
                    "label": "注入宫腔药液(ml）",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "feelTheResistance",
                    "label": "手感阻力",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'value': '小', 'label': '小', },
                            { 'value': '较大', 'label': '较大', },
                            { 'value': '大', 'label': '大', }
                        ]
                    },
                    layout: '1/3',
                }, {
                    "key": "liquidReflux",
                    "label": "药液返流",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [{ 'value': 1, 'label': '无', }, { 'value': 2, 'label': '有', }]
                    },
                    layout: '1/3',
                }, {
                    "key": "patientsFeel",
                    "label": "患者感觉",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [{ 'value': 1, 'label': '无腹痛', }, { 'value': 2, 'label': '轻微腹痛', }, { 'value': 3, 'label': '疼痛难忍', }]
                    },
                    layout: '1/3',
                }, {
                    "key": "operativeComplication",
                    "label": "手术并发症",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [{ 'value': 1, 'label': '无', }, {
                            'value': 2, 'label': '有',
                        }]
                    },
                    layout: '1/3',
                    "isNewRow": 1,
                }, {
                    "key": "operativeSituation",
                    "label": "手术情况",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'value': 1, 'label': '顺利', }, {
                                'value': 2, 'label': '困难',
                            }]
                    },
                    layout: '1/3',
                    "isNewRow": 1,
                }, {
                    "key": "specialCases",
                    "label": "特殊情况记录",
                    "inputType": "input",
                    layout: '1/3',
                    "isNewRow": 1,
                }, {
                    "key": "treatmentAndGuidance",
                    "label": "处理及指导意见",
                    "inputType": "input",
                    layout: '1/3',
                }, {
                    "key": "appointmentSubsequenVisitDate",
                    "label": "预约复诊时间",
                    "inputType": "single_date_picker",
                    layout: '1/3',
                }, {
                    "key": "surgicalDoctor",
                    "label": "手术医师",
                    "inputType": "input",
                    layout: '1/3',
                }, {
                    "key": "surgicalNurse",
                    "label": "手术护士",
                    "inputType": "input",
                    layout: '1/3',
                }],
        },
        {
            "name": "宣教记录",
            "fields": [
                {
                    "key": "postoperationMissions",
                    "label": "健康宣教",
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        "options": [
                            {
                                "value": 1,
                                "label": "自定义",
                            },
                            {
                                "value": 2,
                                "label": "知识库",
                            }
                        ]
                    },
                    "layout": "1/3",
                },
                {
                    "key": "postoperationMissionsType",
                    "label": "知识库",
                    "inputType": "knowledge_base",
                    "inputProps": {
                    },
                    "showDeps": {
                        "postoperationMissions": [2]
                    },
                    "layout": "1",
                },
                {
                    "key": "postoperationMissionsContent",
                    "label": "宣教内容",
                    "inputType": 'TemplateTextarea',
                    inputProps: {
                        TemplateTextarea_type: [
                            { title: '个人', type: 37 },
                            { title: '科室', type: 37, depid: 2 },
                        ]
                    },
                    "showDeps": {
                        "postoperationMissions": [1]
                    },
                    "layout": "1",
                }
            ],
        }
    ]
)