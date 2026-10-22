import { getPresetOptions, mchcEnv, rt_ctx } from "@lm_fe/env";
import { not_yes_input } from "@lm_fe/pages";
import { defineFormConfig, IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable } from "@lm_fe/service";
import { FormInstance } from "antd";

const trueFalseOptions = [{ value: false, label: '否', }, { value: true, label: '是', inputType: 'Input' }]
const trueFalseOptions2 = [{ value: false, label: '否', }, { value: true, label: '是', }]
const ctx = rt_ctx


function straw_item_过敏(key: string, label: string, child1: IMchc_FormDescriptions_Field = {}, child2: IMchc_FormDescriptions_Field = {}) {
    return {
        label,
        layout: '1/3',
        inputType: "straw",
        children: [
            {
                name: key,
                inputType: 'MSW',
                ...child1
            },
            {
                name: key + 'Note',
                inputType: "MA",
                inputProps: {
                    width: 120,
                    status: 'error',

                },
                showDeps: { [key]: [true] },
                ...child2

            }
        ]
    } as IMchc_FormDescriptions_Field
}

export function 既往史_pack(isPure = false, needOther = false) {
    const 过敏_nothing_key = isPure ? 'nothing' : 'pregnancyInfo.amh.nothing'
    const 过敏_unknown_key = isPure ? 'unknown' : 'pregnancyInfo.amh.unknown'
    const 过敏_drug_key = isPure ? 'allergyDrug' : 'pregnancyInfo.amh.drug'
    const 过敏_food_key = isPure ? 'allergyFood' : 'pregnancyInfo.amh.food'
    // const 过敏_food_key = isPure ? 'allergyFood__' : 'pregnancyInfo.amh.food__'
    const 过敏_other_key = isPure ? 'allergyOther' : 'pregnancyInfo.amh.other'
    const 清空_不详_未发现 = isPure
        ? (v, f) => {
            if (v && f) {
                var value = ctx.utils.set({}, 'unknown', false)
                value = ctx.utils.set(value, 'nothing', false)
                f.setFieldsValue(value)
            }
        }
        : (v, f) => {
            if (v && f) {
                var value = ctx.utils.set({}, 'pregnancyInfo.amh.unknown', false)
                value = ctx.utils.set(value, 'pregnancyInfo.amh.nothing', false)
                f.setFieldsValue(value)
            }
        }
    const required = isPure && !mchcEnv.in(['广州市八'])
    let f_k = (k: string) => `${isPure ? '' : 'pregnancyInfo.'}${k}`
    const res = defineFormConfig([
        // {
        //     "key": `${isPure ? '' : 'pregnancyInfo.'}hypertension__`,
        //     "label": "高血压",
        //     "inputType": "MC",
        //     required: required,
        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },
        not_yes_input(f_k('hypertension'), '高血压'),
        // {

        //     "key": `${isPure ? '' : 'pregnancyInfo.'}diabetes__`,
        //     required: required,

        //     "label": "糖尿病",

        //     "inputType": "MC",
        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },
        not_yes_input(f_k('diabetes'), '糖尿病'),

        // {

        //     "key": `${isPure ? '' : 'pregnancyInfo.'}cardiacDisease__`,

        //     required: required,

        //     "label": "心脏病",
        //     "inputType": "MC",
        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },
        not_yes_input(f_k('cardiacDisease'), '心脏病'),





        // nurse_既往史_结核(isPure),
        // nurse_既往史_肝炎(isPure),
        // nurse_既往史_肾病(isPure),
        // nurse_既往史_甲亢(isPure),
        // nurse_既往史_性病(isPure),

        // not_yes_input(f_k('tuberculosis'), '结核', { isActive: mchcEnv.in(['广三']), }),
        // not_yes_input(f_k('hepaticDisease'), '肝炎', { isActive: mchcEnv.in(['广三']), }),
        // not_yes_input(f_k('nephropathy'), '肾病', { isActive: mchcEnv.in(['广三']), }),
        // not_yes_input(f_k('thyroidDisease'), '甲亢', { isActive: mchcEnv.in(['广三']), }),
        // not_yes_input(f_k('std'), '性病', { isActive: mchcEnv.in(['广三']), }),


        // {
        //     "key": `${isPure ? '' : 'pregnancyInfo.'}infection__`,

        //     "label": "传染病",
        //     required: required,
        //     isActive: mchcEnv.in(['广三']),

        //     "inputType": "MC",
        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },
        // not_yes_input(f_k('infection'), '传染病', { isActive: mchcEnv.in(['广三']), }),


        // {
        //     "key": `${isPure ? '' : 'pregnancyInfo.'}${isPure ? 'operationHistory__' : 'operationmh__'}`,

        //     "label": "手术史",
        //     required: required || mchcEnv.in(['广三']),

        //     "inputType": "MC",
        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },

        not_yes_input(`${isPure ? '' : 'pregnancyInfo.'}${isPure ? 'operationHistory' : 'operationmh'}`, '手术史',),


        // {
        //     "key": `${isPure ? '' : 'pregnancyInfo.'}transfusionHistory__`,

        //     "label": "输血史",

        //     "inputType": "MC",
        //     required: required,

        //     "inputProps": { marshal: 1, options: trueFalseOptions },

        //     layout: '1/3',
        // },
        not_yes_input(f_k('transfusionHistory'), '输血史',),

        {


            "label": "过敏史",

            children: [
                {
                    name: 过敏_nothing_key,
                    layout: '1/3',
                    label: '暂未发现',
                    inputType: 'MySwitch',
                    processLocal:
                        isPure
                            ? (v, f) => {
                                if (v && f) {
                                    var value = ctx.utils.set({}, 'allergyDrug', null)
                                    value = ctx.utils.set(value, 'allergyFood', null)
                                    value = ctx.utils.set(value, 'allergyOther', null)
                                    value = ctx.utils.set(value, 'unknown', false)
                                    f.setFieldsValue(value)
                                }
                            }
                            : (v, f) => {
                                if (v && f) {


                                    var value = ctx.utils.set({}, 'pregnancyInfo.amh.drug', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.food', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.other', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.unknown', false)
                                    f.setFieldsValue(value)
                                }
                            },
                },
                {
                    name: 过敏_unknown_key,
                    layout: '1/3',
                    label: '不详',
                    inputType: 'MySwitch',
                    processLocal:
                        isPure

                            ? (v, f) => {
                                if (v && f) {
                                    var value = ctx.utils.set({}, 'allergyDrug', null)
                                    value = ctx.utils.set(value, 'allergyFood', null)
                                    value = ctx.utils.set(value, 'allergyOther', null)
                                    value = ctx.utils.set(value, 'nothing', false)
                                    f.setFieldsValue(value)
                                }
                            }
                            : (v, f) => {
                                if (v && f) {


                                    var value = ctx.utils.set({}, 'pregnancyInfo.amh.drug', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.food', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.other', null)
                                    value = ctx.utils.set(value, 'pregnancyInfo.amh.nothing', false)
                                    f.setFieldsValue(value)
                                }
                            },
                    inputProps: { marshal: 0, options: mchcEnv.get_options('yesOrNoMapping') }
                },
                straw_item_过敏(
                    过敏_drug_key,
                    '药物',
                    { processLocal: 清空_不详_未发现, inputType: 'MySwitch' },
                    {
                        inputType: 'MS',
                        inputProps: {
                            style: { minWidth: 120 },
                            type: 'tags',
                            marshal: 0,
                            uniqueKey: '过敏药物'
                        }
                    }),

                // {
                //     name: 过敏_drug_key,
                //     isNewRow: 1,
                //     layout: '1/3',
                //     label: '药物',
                //     inputType: 'MC',
                //     processLocal: 清空_不详_未发现,
                //     inputProps: {
                //         options: [
                //             { value: false, label: '否', },
                //             {
                //                 value: true,
                //                 label: '是',
                //                 inputType: 'MS',
                //                 props: {
                //                     type: 'tags',
                //                     marshal: 0,
                //                     uniqueKey: '过敏药物'
                //                 }
                //             }]
                //     }
                // },

                straw_item_过敏(过敏_food_key, '食物', { processLocal: 清空_不详_未发现, inputType: 'MySwitch' }),

                // {
                //     name: 过敏_food_key,
                //     layout: '1/3',
                //     processLocal: 清空_不详_未发现,
                //     label: '食物',
                //     inputType: 'MC',
                //     inputProps: { options: trueFalseOptions }
                // },
                straw_item_过敏(过敏_other_key, '其他', { processLocal: 清空_不详_未发现, inputType: 'MySwitch' }),

                // {
                //     name: 过敏_other_key,
                //     layout: '1/3',
                //     processLocal: 清空_不详_未发现,
                //     label: '其他',
                //     inputType: 'MC',
                //     inputProps: { options: trueFalseOptions }
                // },

                // {
                //     name: isPure ? 'unknown' : 'pregnancyInfo.amh.unknown',
                //     layout: '1/3',
                //     label: '不详',
                //     inputType: 'MC',
                //     inputProps: { marshal: 0, options: mchcEnv.get_options('yesOrNoMapping') }
                // },

            ],
            layout: '1/1',
        },
        // {
        //     "key": `${isPure ? '' : 'pregnancyInfo.'}${isPure ? 'allergy__' : 'amh___'}`,

        //     required: required || mchcEnv.in(['广三']),

        //     "label": "过敏史",
        //     "inputType": "MC",

        //     "inputProps": {
        //         marshal: 1, options: '无,药物i,食物i,其他i,不详', type: 'multiple',
        //         sp: [{
        //             label: '药物', inputType: 'Select', props: {
        //                 type: 'tags',
        //                 marshal: 0,
        //                 options: getPresetOptions('过敏药物s').map(_ => _.value).join(',')
        //             }
        //         }]
        //     },
        //     layout: '1/1',
        // },

    ]).__lazy_config
    if (needOther) {
        res.push(nurse_既往史_其他(isPure))
    }
    return res
}






// function nurse_既往史_结核(isPure = false): IMchc_FormDescriptions_Field_Nullable {
//     return {
//         // "key": "pregnancyInfo.tuberculosis__",
//         "key": `${isPure ? '' : 'pregnancyInfo.'}tuberculosis__`,
//         isActive: mchcEnv.in(['广三']),
//         required: isPure,
//         "label": "结核",

//         "inputType": "MC",
//         "inputProps": { marshal: 1, options: trueFalseOptions },

//         layout: '1/3',
//     }
// }
// function nurse_既往史_肝炎(isPure = false): IMchc_FormDescriptions_Field_Nullable {
//     return {
//         // "key": "pregnancyInfo.hepaticDisease__",
//         "key": `${isPure ? '' : 'pregnancyInfo.'}hepaticDisease__`,

//         "label": "肝炎",
//         required: isPure,
//         isActive: mchcEnv.in(['广三']),

//         "inputType": "MC",
//         "inputProps": { marshal: 1, options: trueFalseOptions },

//         layout: '1/3',
//     }
// }
// function nurse_既往史_肾病(isPure = false): IMchc_FormDescriptions_Field_Nullable {
//     return {
//         // "key": "pregnancyInfo.nephropathy__",
//         "key": `${isPure ? '' : 'pregnancyInfo.'}nephropathy__`,
//         required: isPure,

//         "label": "肾病",
//         isActive: mchcEnv.in(['广三']),

//         "inputType": "MC",
//         "inputProps": { marshal: 1, options: trueFalseOptions },

//         layout: '1/3',
//     }
// }
// function nurse_既往史_甲亢(isPure = false): IMchc_FormDescriptions_Field_Nullable {
//     return {
//         // "key": "pregnancyInfo.thyroidDisease__",
//         "key": `${isPure ? '' : 'pregnancyInfo.'}thyroidDisease__`,
//         required: isPure,

//         "label": "甲亢",
//         isActive: mchcEnv.in(['广三']),

//         "inputType": "MC",
//         "inputProps": { marshal: 1, options: trueFalseOptions },

//         layout: '1/3',
//     }
// }
// function nurse_既往史_性病(isPure = false): IMchc_FormDescriptions_Field_Nullable {
//     return {
//         // "key": "pregnancyInfo.std__",
//         "key": `${isPure ? '' : 'pregnancyInfo.'}std__`,
//         required: isPure,

//         "label": "性病",
//         isActive: mchcEnv.in(['广三']),

//         "inputType": "MC",
//         "inputProps": { marshal: 1, options: trueFalseOptions },

//         layout: '1/3',
//     }
// }

function nurse_既往史_其他(isPure = false): IMchc_FormDescriptions_Field_Nullable {
    return {

        // "key": "pregnancyInfo.otherNote",
        "key": `${isPure ? '' : 'pregnancyInfo.'}otherNote`,


        "label": "其他",
        "inputType": 'text_area',
        isNewRow: 1,
        layout: '2/3',
    }
}
