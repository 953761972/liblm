import { rt_ctx } from "@lm_fe/env";
import { pressure_fd } from "@lm_fe/pages";
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service";
const ctx = rt_ctx
export default defineFormConfig(
    [
        { key: 'id', form_hidden: true, },
        { key: 'preoperativeExamination.id', form_hidden: true, },
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
                layout: '1/3',
                "inputType": "MS",
                inputProps: {
                    marshal: 0,
                    'options': [
                        { 'value': 1, 'label': '正常', },
                        { 'value': 2, 'label': '异常', },
                        { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.syphilis",
                "label": "梅毒",
                layout: '1/3',
                "inputType": "MS",
                "inputProps": {
                    marshal: 0,
                    'options': [
                        { 'value': 1, 'label': '正常', },
                        { 'value': 2, 'label': '异常', },
                        { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.hepatitisB",
                layout: '1/3',
                "label": "乙肝",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,
                    'options': [
                        { 'value': 1, 'label': '正常', },
                        { 'value': 2, 'label': '异常', },
                        { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.sixCoagulation",
                layout: '1/3',
                "label": "凝血功能",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.leucorrhea",
                layout: '1/3',
                "label": "白带",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.hepatitisC",
                layout: '1/3',
                "label": "丙肝",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.hb",
                layout: '1/3',
                "label": "HB",
                "inputType": "input_number",
                unit: 'g/L',
            },
            {
                "key": "preoperativeExamination.mcv",
                "label": "MCV",
                "inputType": "input_number",
                layout: '1/3',
                unit: 'fL',
            },
            {
                "key": "preoperativeExamination.plt",
                layout: '1/3',
                "label": "PLT",
                "inputType": "input_number",
                unit: 'x10^9/L',
            },
            {
                "key": "preoperativeExamination.preanestheticEvaluation",
                layout: '1/3',
                "label": "麻醉评估",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.ecg",
                "label": "心电图",
                layout: '1/3',
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '正常', },
                    { 'value': 2, 'label': '异常', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },
            {
                "key": "preoperativeExamination.nat",
                layout: '1/3',
                "label": "核酸",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '阴性', },
                    { 'value': 2, 'label': '阳性', },
                    { 'value': 3, 'label': '未查', }
                    ]
                },
            },

            pressure_fd(

                { label: '血压(mmHg)', layout: '1/3', },
                { name: 'preoperativeSystolic' },
                { name: 'preoperativeDiastolic' }
            ),
            {
                "key": "preoperativeBodyTemperature",
                layout: '1/3',
                "label": "体温(°C)",
                "inputType": "input_number",
                "inputProps": { 'placeholder': '请输入体温', 'style': { 'width': 156 } },
            },
            {
                "key": "preoperativeFasting",
                layout: '1/3',
                "label": "是否空腹",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,

                    'options': [{ 'value': 1, 'label': '是', },
                    { 'value': 2, 'label': '否', }
                    ]
                },
            },
            {
                "key": "preoperativeNote",
                layout: '2/3',
                "label": "备注",
                "inputType": "input",
            }
            ],
        },
        {
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
                    "key": "operationTypeDetail",
                    "label": "手术类型",
                    layout: '1/3',
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'value': '分段诊刮术', 'label': '分段诊刮术' },
                            { 'value': '一般诊刮术', 'label': '一般诊刮术' },
                            { 'value': '人流不全清宫', 'label': '人流不全清宫' },
                            { 'value': '不全流产清宫', 'label': '不全流产清宫' },
                            { 'value': '药物不全清宫', 'label': '药物不全清宫' },
                            { 'value': '稽留流产清宫', 'label': '稽留流产清宫' }
                        ]
                    },
                },
                {
                    "key": "uterinePosition",
                    "label": "子宫位置",
                    layout: '1/3',
                    "inputType": "MS",
                    "inputProps": {
                        marshal: 0,
                        'options': [
                            { 'label': '前位', 'value': '前位' },
                            { 'label': '中位', 'value': '中位' },
                            { 'label': '后位', 'value': '后位' }
                        ]
                    },
                    "isNewRow": 1,
                },
                {
                    "key": "uterineSize",
                    layout: '1/3',
                    "label": "子宫大小(cm)",
                    "inputType": "input_number",
                },
                {
                    "key": "preoperativeUterineCavity",
                    layout: '1/3',
                    "label": "术前宫腔(cm)",
                    "inputType": "input_number",

                },
                {
                    "key": "anesthesia",
                    "label": "是否注射麻醉",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,
                        'options': [
                            { 'value': 1, 'label': '是', },
                            { 'value': 2, 'label': '否', }
                        ]
                    },
                },
                {
                    "key": "cervicalDilation",
                    "label": "宫颈扩张",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,

                        'options': [{ 'value': 1, 'label': '未扩张', },
                        { 'value': 2, 'label': '扩张', }
                        ]
                    },
                },
                {
                    "key": "curettageDirection",
                    "label": "刮匙进入宫腔",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,

                        'options': [{ 'value': 1, 'label': '顺时针', },
                        { 'value': 2, 'label': '逆时针', }
                        ]
                    },
                },
                {
                    "key": "curettageWeeks",
                    layout: '1/3',
                    "label": "搔刮周数",
                    "inputType": "input_number",
                },
                {
                    "key": "postoperativeUterineCavity",
                    layout: '1/3',
                    "label": "术后宫腔(cm)",
                    "inputType": "input_number",
                },
                {
                    "key": "bleedingQuantity",
                    layout: '1/3',
                    "label": "出血量(ml)",
                    "inputType": "input_number",
                },
                {
                    "key": "specimen",
                    "label": "标本",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,

                        'options': [
                            { 'value': 1, 'label': '无', },
                            { 'value': 2, 'label': '有', }
                        ]
                    },
                },
                {
                    "key": "operativeComplication",
                    "label": "手术并发症",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,
                        'options': [{ 'value': 1, 'label': '无', },
                        { 'value': 2, 'label': '有', }
                        ]
                    },
                },
                {
                    "key": "operativeSituation",
                    "label": "手术情况",
                    layout: '1/3',
                    "inputType": "MS",
                    inputProps: {
                        marshal: 0,

                        'options': [{ 'value': 1, 'label': '顺利', },
                        { 'value': 2, 'label': '困难', }
                        ]
                    },
                },
                {
                    "key": "specialCases",
                    layout: '1/3',
                    "label": "特殊情况记录",
                    "inputType": "input",
                },
                {
                    "key": "treatmentAndGuidance",
                    layout: '1/3',
                    "label": "处理及指导意见",
                    "inputType": "input",
                },
                {
                    "key": "appointmentSubsequenVisitDate",
                    layout: '1/3',
                    "label": "预约复诊时间",
                    "inputType": "single_date_picker",
                },
                {
                    "key": "surgicalDoctor",
                    layout: '1/3',
                    "label": "手术医师",
                    "inputType": "input",
                },
                {
                    "key": "anesthesiaDoctor",
                    "label": "麻醉医师",
                    layout: '1/3',
                    "inputType": "input",
                    "inputProps": { 'dependency': { 'show': { 'key': 'anesthesia', 'value': [1] } } },
                },
                {
                    "key": "surgicalNurse",
                    layout: '1/3',
                    "label": "手术护士",
                    "inputType": "input",
                }
            ],
        },
        {
            "name": "宣教记录",

            "fields": [{
                "key": "postoperationMissions",
                layout: '1/3',
                "label": "健康宣教",
                "inputType": "MS",
                inputProps: {
                    marshal: 0,
                    'options': [{ 'value': 1, 'label': '自定义', },
                    { 'value': 2, 'label': '知识库', }
                    ]
                },
            },
            {
                "key": "postoperationMissionsType",
                layout: '1/1',
                "label": "知识库",
                showDeps: { 'postoperationMissions': [2] },
                "inputType": "knowledge_base",
            },
            {
                "key": "postoperationMissionsContent",
                "label": "宣教内容",
                layout: '1/1',
                "inputType": 'TemplateTextarea',
                inputProps: {
                    TemplateTextarea_type: [
                        { title: '个人', type: 37 },
                        { title: '科室', type: 37, depid: 2 },
                    ]
                },
                showDeps: { 'postoperationMissions': [1] }
            }
            ],
        },

    ]
)