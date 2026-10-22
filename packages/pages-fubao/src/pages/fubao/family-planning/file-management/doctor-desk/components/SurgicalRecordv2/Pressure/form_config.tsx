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
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.syphilis",
                "label": "梅毒",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hepatitisB",
                "label": "乙肝",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.sixCoagulation",
                "label": "凝血功能",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.leucorrhea",
                "label": "白带",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hepatitisC",
                "label": "丙肝",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.hb",
                "label": "HB",
                "inputType": "input_number",
                'unit': 'g/L',
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.mcv",
                "label": "MCV",
                "inputType": "input_number",
                'unit': 'fL',
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.plt",
                "label": "PLT",
                "inputType": "input_number",
                'unit': 'x10^9/L',
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.nat",
                "label": "核酸",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '阴性', }, { 'value': 2, 'label': '阳性', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.preanestheticEvaluation",
                "label": "麻醉评估",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeExamination.ecg",
                "label": "心电图",
                "inputType": "MS",
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '正常', }, { 'value': 2, 'label': '异常', }, { 'value': 3, 'label': '未查', }] },
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
                "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '是', }, { 'value': 2, 'label': '否', }] },
                layout: '1/3',
            }, {
                "key": "preoperativeNote",
                "label": "备注",
                "inputType": "input",
                "span": 16,
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
                    "key": "operationTypeDetail",
                    "label": "手术类型",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': '负压吸宫术', 'label': '负压吸宫术' }, { 'value': '钳刮术', 'label': '钳刮术' }] },
                    layout: '1/3',
                }, {
                    "key": "uterinePosition",
                    "label": "子宫位置",
                    "inputType": "MS",
                    "inputProps": { 'options': [{ 'label': '前位', 'value': '前位' }, { 'label': '中位', 'value': '中位' }, { 'label': '后位', 'value': '后位' }] },
                    layout: '1/3',
                    "isNewRow": 1,
                }, {
                    "key": "uterineSize",
                    "label": "子宫大小(cm)",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "preoperativeUterineCavity",
                    "label": "术前宫腔(cm)",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "anesthesia",
                    "label": "是否注射麻醉",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '是', }, { 'value': 2, 'label': '否', }] },
                    layout: '1/3',
                }, {
                    "key": "postoperativeUterineCavity",
                    "label": "术后宫腔(cm)",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "cervicalDilation",
                    "label": "宫颈扩张",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '未扩张', }, { 'value': 2, 'label': '扩张', }] },
                    layout: '1/3',
                }, {
                    "key": "strawNumber",
                    "label": "吸管号",
                    "inputType": "input",
                    layout: '1/3',
                }, {
                    "key": "negativePressure",
                    "label": "负压(mmHg)",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "villus",
                    "label": "绒毛(cm)",
                    "inputType": "input_number",
                    layout: '1/3',
                    "isNewRow": 1,
                }, {
                    "key": "embryoSac",
                    "label": "胚囊",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '见', }, { 'value': 2, 'label': '未见', }] },
                    layout: '1/3',
                }, {
                    "key": "bleedingQuantity",
                    "label": "出血量(ml)",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "dilatationAndCurettage",
                    "label": "刮宫",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '无', }, { 'value': 2, 'label': '有', }] },
                    "span": 16,
                    "isNewRow": 1,
                }, {
                    "key": "specimen",
                    "label": "标本",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '无', }, { 'value': 2, 'label': '有', }] },
                    "span": 16,
                    "isNewRow": 1,
                }, {
                    "key": "intrauterineDevice",
                    "label": "人流后放置宫内节育器",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '无', }, { 'value': 2, 'label': '有', }] },
                    "span": 16,
                    "isNewRow": 1,
                }, {
                    "key": "intrauterineDeviceType",
                    "label": "节育器类型",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': '宫铜形IUD', 'label': '宫铜形IUD', }, { 'value': 'TCu220c', 'label': 'TCu220c', }, { 'value': 'TCu280A', 'label': 'TCu280A', }, { 'value': '母体乐铜375', 'label': '母体乐铜375', }, { 'value': '活性Y型', 'label': '活性Y型', }, { 'value': 'VCu200', 'label': 'VCu200', }, { 'value': '铜环165', 'label': '铜环165', }, { 'value': '左炔诺孕酮IUD', 'label': '左炔诺孕酮IUD', }, { 'value': '铜固定式IUD', 'label': '铜固定式IUD', }, { 'value': '其他', 'label': '其他', }] },
                    'showDeps': { 'intrauterineDevice': [2] },
                    "span": 22,
                }, {
                    "key": "intrauterineDeviceSize",
                    "label": "大小(号)",
                    "inputType": "input",

                    'showDeps': { 'intrauterineDevice': [2] },

                    layout: '1/3',
                }, {
                    "key": "tailFiber",
                    "label": "尾丝(cm)",
                    "inputType": "input_number",
                    'showDeps': { 'intrauterineDevice': [2] },

                    layout: '1/3',
                }, {
                    "key": "intrauterineDeviceDurableYears",
                    "label": "节育器使用年限(年)",
                    "inputType": "input_number",
                    "inputProps": { 'dependency': { 'show': { 'key': 'intrauterineDevice', 'value': [2] } } },
                    layout: '1/3',
                }, {
                    "key": "operativeComplication",
                    "label": "手术并发症",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '无', }, { 'value': 2, 'label': '有', }] },
                    "span": 16,
                }, {
                    "key": "operativeSituation",
                    "label": "手术情况",
                    "inputType": "MS",
                    "inputProps": { marshal: 0, 'options': [{ 'value': 1, 'label': '顺利', }, { 'value': 2, 'label': '困难', }] },
                    "span": 16,
                    "isNewRow": 1,
                }, {
                    "key": "specialCases",
                    "label": "特殊情况记录",
                    "inputType": "input",
                    "span": 16,
                    "isNewRow": 1,
                }, {
                    "key": "treatmentAndGuidance",
                    "label": "处理及指导意见",
                    "inputType": "input",
                    "span": 16,
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
                    "key": "anesthesiaDoctor",
                    "label": "麻醉医师",
                    "inputType": "input",
                    "inputProps": { 'dependency': { 'show': { 'key': 'anesthesia', 'value': [1] } } },
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