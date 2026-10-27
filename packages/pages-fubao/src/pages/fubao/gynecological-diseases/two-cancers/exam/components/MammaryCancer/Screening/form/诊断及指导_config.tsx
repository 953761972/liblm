import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

export function 诊断及指导_config(): IMchc_FormDescriptions_Field[] {

    return [
        {
            "id": 786,
            "moduleName": "mammary-cancer-screening",
            "name": "诊断及建议",
            "flag": "妇女保健-乳腺癌筛查-诊断及建议",
            "sort": 5,
            "children": [
                { key: 'breastCancerDiagnosisAndGuidance.id', form_hidden: true, },
                {
                    "id": 18117,
                    "key": "breastCancerDiagnosisAndGuidance.screeningDiagnosis__",
                    "label": "筛查诊断",
                    "inputType": "MC",
                    "rules": [{ "required": true, "message": "筛查诊断是必填项" }],
                    "inputProps": {
                        inputWidth: 120,
                        "options": [
                            { "value": 1, "label": "未见异常", exclusive: true },
                            {
                                "value": 2, "label": "良性疾病", warning: true, "inputType": "MA",
                                "props": { options: '乳腺纤维腺瘤,乳腺导管内乳头状瘤' }
                            },
                            {
                                "value": 3, "label": "癌前病变", warning: true, "inputType": "MA",
                                "props": { options: '导管不典型增生,小叶不典型增生,小叶原位癌' }
                            },
                            { "value": 4, "label": "导管原位癌", warning: true, },
                            {
                                "value": 5, "label": "浸润癌", warning: true, "inputType": "MA",
                                "props": { options: '浸润性导管癌,浸润性小叶癌' }
                            },
                            { "value": 6, "label": "其他", warning: true, }
                        ]
                    },
                    // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "未见异常", "span": 4, "withInput": false }, { "value": 2, "label": "良性疾病", warning: true, "span": 4, "inputSpan": 4, "inputType": "autoComplete", "inputOption": [{ "value": "乳腺纤维腺瘤" }, { "value": "乳腺导管内乳头状瘤" }] }, { "value": 3, "label": "癌前病变", warning: true, "span": 4, "inputSpan": 4, "inputType": "autoComplete", "inputOption": [{ "value": "导管不典型增生" }, { "value": "小叶不典型增生" }, { "value": "小叶原位癌" }] }, { "value": 4, "label": "导管原位癌", warning: true, "span": 4, "inputSpan": 4 }, { "value": 5, "label": "浸润癌", warning: true, "span": 4, "inputSpan": 4, "inputType": "autoComplete", "inputOption": [{ "value": "浸润性导管癌" }, { "value": "浸润性小叶癌" }] }, { "value": 6, "label": "其他", warning: true, "span": 4, "inputSpan": 4 }] },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                }, {
                    "id": 18118,
                    "key": "breastCancerDiagnosisAndGuidance.screeningSuggest",
                    "label": "筛查建议",
                    "inputType": "checkbox_group",
                    "rules": [{ "required": true, "message": "筛查建议是必填项" }],
                    "specialConfig": { "type": "single", "options": [{ "value": "定期检查", "label": "定期检查", "span": 4, "withInput": false }, { "value": "复查乳腺X线", "label": "复查乳腺X线", "span": 4, "withInput": false }, { "value": "活检", "label": "活检", "span": 4, "withInput": false }] },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                }, {
                    "id": 18119,
                    "key": "breastCancerDiagnosisAndGuidance.checkUnit",
                    "label": "检查单位",
                    "inputType": "input",
                    "rules": [{ "required": true, "message": "检查单位是必填项" }],
                    "span": 8,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 8 }, "wrapperCol": { "span": 12 } },
                }, {
                    "id": 18120,
                    "key": "breastCancerDiagnosisAndGuidance.checkDate",
                    "label": "检查日期",
                    "inputType": "DatePicker",
                    "rules": [{ "required": true, "message": "检查日期是必填项" }],
                    "span": 8,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 8 }, "wrapperCol": { "span": 12 } },
                }, {
                    "id": 18121,
                    "key": "breastCancerDiagnosisAndGuidance.checkDoctor",
                    "inputType": "MA",
                    inputProps: { memorieskey: '妇保-检查医生' },

                    "required": true,
                    "span": 8,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 8 }, "wrapperCol": { "span": 12 } },
                }]
        },

    ]

}
