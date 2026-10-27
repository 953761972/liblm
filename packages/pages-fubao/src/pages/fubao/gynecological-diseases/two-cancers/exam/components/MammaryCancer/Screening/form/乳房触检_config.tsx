import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

export function 乳房触检_config() {

    const cache: IMchc_FormDescriptions_Field[] = [
        {
            "id": 784,
            "name": "乳房触检",
            "children": [
                { key: 'breastCancerBreastPalpation.id', form_hidden: true },
                {
                    "id": 18104,
                    "key": "breastCancerBreastPalpation.leftBreastSignsNote",
                    "label": "左乳体征",
                    "inputType": "MC",
                    inputProps: {
                        marshal: 2,
                        "options": [
                            { "value": 0, "label": "未见异常", inputType: 'MA', },
                            { "value": 1, "label": "乳房肿块或团块", inputType: 'MA', },
                            { "value": 2, "label": "不对称性增厚或结节", inputType: 'MA', },
                            { "value": 3, "label": "皮肤改变", inputType: 'MA', },
                            { "value": 4, "label": "腋淋巴结节肿大", inputType: 'MA', },
                            { "value": 5, "label": "其他", inputType: 'MA', }
                        ]
                    },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                },
                {
                    "id": 18105,
                    "key": "breastCancerBreastPalpation.leftBreastSymptomsNote",
                    "label": "左乳症状",
                    "inputType": "MC",
                    "inputProps": {
                        marshal: 2,
                        "type": "multiple",
                        "options": [
                            { "value": 0, "label": "无", inputType: 'MA', },
                            { "value": 1, "label": "乳腺疼痛", inputType: 'MA', },
                            { "value": 2, "label": "乳头溢液", inputType: 'MA', }
                        ]
                    },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                },
                {
                    "id": 18106,
                    "key": "breastCancerBreastPalpation.rightBreastSignsNote",
                    "label": "右乳体征",
                    "inputType": "MC",
                    "inputProps": {
                        "type": "multiple",
                        marshal: 2,
                        "options": [
                            { "value": 0, "label": "未见异常", inputType: 'MA', },
                            { "value": 1, "label": "乳房肿块或团块", inputType: 'MA', },
                            { "value": 2, "label": "不对称性增厚或结节", inputType: 'MA', },
                            { "value": 3, "label": "皮肤改变", inputType: 'MA', },
                            { "value": 4, "label": "腋淋巴结节肿大", inputType: 'MA', },
                            { "value": 5, "label": "其他", inputType: 'MA', }
                        ]
                    },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                },
                {
                    "id": 18107,
                    "key": "breastCancerBreastPalpation.rightBreastSymptomsNote",
                    "label": "右乳症状",
                    "inputType": "MC",
                    "inputProps": {
                        marshal: 2,
                        "type": "multiple",
                        "options": [
                            { "value": 0, "label": "无", inputType: 'MA', },
                            { "value": 1, "label": "乳腺疼痛", inputType: 'MA', },
                            { "value": 2, "label": "乳头溢液", inputType: 'MA', }
                        ]
                    },
                    "span": 24,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 4 }, "wrapperCol": { "span": 20 } },
                },
                {
                    "id": 18108,
                    "key": "breastCancerBreastPalpation.other",
                    "label": "其他",
                    "inputType": "input",
                    "span": 12,
                    "offset": 0,
                    "formItemLayout": { "labelCol": { "span": 8 }, "wrapperCol": { "span": 12 } },
                },
                {
                    "id": 18109,
                    "key": "selectBtn",
                    "label": "一键勾选",
                    "inputType": "check_invert_button",
                    "inputProps": { "type": "primary", "size": "middle" },
                    "span": 6,
                    "offset": 0,
                    "isNewRow": 1,
                    "formItemLayout": { "labelCol": { "span": 2 }, "wrapperCol": { "span": 2 } },
                }
            ]
        },
    ]
    return cache
}


