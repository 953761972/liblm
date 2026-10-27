import { mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

export function 病史情况_config(): IMchc_FormDescriptions_Field[] {
    return [

        {
            "moduleName": "cervical-carcinoma-screening",
            "name": "病史情况",
            "flag": "妇女保健-宫颈癌筛查-病史情况",
            "sort": 0,
            "fields": [
                { key: 'cervicalCancerMedicalHistory.id', form_hidden: true },
                {
                    "key": "cervicalCancerMedicalHistory.previousCervicalScreening__",
                    "label": "既往接受宫颈癌筛查",
                    inputType: 'MC',
                    inputProps: { options: [{ label: '否', value: 1 }, { label: '是', value: 2, inputType: 'Input' }] },
                    // "inputType": "checkbox_with_single_input",
                    // "specialConfig": {
                    //     "type": "single", "options": [
                    //         { "value": 1, "label": "否", "span": 4, "withInput": false },
                    //         { "value": 2, "label": "是", "withInput": true, "isIssue": true, "span": 4, "inputSpan": 12 }
                    //     ]
                    // },
                    layout: '1/1',
                },
                {
                    "key": "cervicalCancerMedicalHistory.discomfortItems",
                    "label": "不适症状",
                    "inputType": "MC",
                    inputProps: {
                        type: 'multiple',
                        options: `无,月经不规律,外阴瘙痒,宫颈出血,性交疼痛,性交出血,绝经后阴道出血,下腹不适,失眠,其他i`
                    },
                    // "inputType": "checkbox_with_inputv2",
                    // "specialConfig": {
                    //     "type": "multiple",
                    //     "options": [
                    //         { "value": 0, "label": "无",  "along": true, "span": 4 },
                    //         { "value": 1, "label": "月经不规律",  "span": 4 },
                    //         { "value": 2, "label": "外阴瘙痒",  "span": 4 },
                    //         { "value": 3, "label": "宫颈出血",  "span": 4 },
                    //         { "value": 4, "label": "性交疼痛",  "span": 4 },
                    //         { "value": 5, "label": "性交出血",  "span": 4 },
                    //         { "value": 6, "label": "绝经后阴道出血",  "span": 4 },
                    //         { "value": 7, "label": "下腹不适",  "span": 4 },
                    //         { "value": 8, "label": "失眠",  "span": 4 },
                    //         { "value": 9, "label": "其他", "withInput": true, "span": 4 }
                    //     ]
                    // },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerMedicalHistory.contraceptiveMethodItems",
                    "label": "避孕方式",
                    "inputType": "MC",
                    inputProps: {
                        type: 'multiple',
                        options: `无,避孕药物i,避孕工具i,皮下埋植i,IUDi,结扎手术i,安全期i,其他i`
                    },
                    // "inputType": "checkbox_with_inputv2",
                    // "specialConfig": {
                    //     "type": "multiple",
                    //     "options": [
                    //         { "value": 0, "label": "无",  "along": true, "span": 4 },
                    //         { "value": 1, "label": "避孕药物", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 2, "label": "避孕工具", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 3, "label": "皮下埋植", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 4, "label": "IUD", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 5, "label": "结扎手术", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 6, "label": "安全期", "withInput": true, "span": 4, "inputSpan": 4 },
                    //         { "value": 7, "label": "其他", "withInput": true, "span": 4, "inputSpan": 4 }
                    //     ]
                    // },
                    layout: '1/1',

                }, {
                    "key": "cervicalCancerMedicalHistory.gynecologicalDiseasesHistory__",
                    "label": "妇科疾病史",
                    inputType: 'MC',
                    inputProps: { options: [{ label: '无', value: 1 }, { label: '有', value: 2, inputType: 'Input' }] },

                    // "inputType": "checkbox_with_single_input",
                    // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "无", "span": 4, "withInput": false }, { "value": 2, "label": "有", "withInput": true, "isIssue": true, "span": 4, "inputSpan": 12 }] },

                    layout: '1/1',

                },
                // {
                //     "key": "cervicalCancerMedicalHistory.familyTumorHistoryVOS",
                //     "label": "家族肿瘤史!!",
                //     "inputType": "family_tumor_history",
                //     layout: '1/1',
                // }
                {
                    "key": "cervicalCancerMedicalHistory.familyTumorHistoryVOS",
                    "label": "家族肿瘤史!!",
                    "inputType": 'ArrayPanel',
                    "inputProps": {
                        "marshal": 0,
                        "targetLabelCol": 2,
                        "formDescriptions": [
                            {
                                "layout": "1/3",
                                "inputType": "MA",
                                "label": "疾病",
                                "name": "tumorName",
                            },
                            {
                                "layout": "1/3",
                                "inputType": "MA",
                                "label": "与本人关系",
                                "name": "relationshipWithPatients",
                                "inputProps": {
                                    "options": '父母,子女,兄弟姐妹'
                                }
                            },


                        ]
                    },
                    layout: '1/1',
                }
            ]
        },

    ]
}




