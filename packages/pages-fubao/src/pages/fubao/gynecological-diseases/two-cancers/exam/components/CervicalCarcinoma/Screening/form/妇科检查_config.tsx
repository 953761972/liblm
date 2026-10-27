import { IMchc_FormDescriptions_Field } from "@lm_fe/service";

export function 妇科检查_config() {

    const cache: IMchc_FormDescriptions_Field[] = [
        {
            "name": "妇科检查",
            "sort": 0,
            "children": [
                { key: 'cervicalCancerGynecologicExamination.id', form_hidden: true },
                {
                    "key": "cervicalCancerGynecologicExamination.vulva__",
                    "label": "外阴",
                    "inputType": "MC",

                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '白斑,溃疡,疱疹,肿物' } }]
                    },
                    layout: "1/3",
                }, {
                    "key": "cervicalCancerGynecologicExamination.secretions__",
                    "label": "分泌物",
                    "inputType": "MC",
                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '异位,血性,脓性,泡沫样,豆腐渣' } }]
                    },
                    layout: "1/3",

                }, {
                    "key": "cervicalCancerGynecologicExamination.vaginal__",
                    "label": "阴道",
                    "inputType": "MC",
                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '充血,溃疡,湿疣,疱疹,肿物' } }]
                    },
                    layout: "1/3",

                }, {
                    "key": "cervicalCancerGynecologicExamination.cervix__",
                    "label": "子宫颈",
                    "inputType": "MC",


                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '触血,息肉,糜烂样,菜花样' } }]
                    },
                    layout: "1/3",

                }, {
                    "key": "cervicalCancerGynecologicExamination.zg__",
                    "label": "子宫",
                    "inputType": "MC",
                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '大小,肿物' } }]
                    },
                    layout: "1/3",

                }, {
                    "key": "cervicalCancerGynecologicExamination.appendix__",
                    "label": "附件",
                    "inputType": "MC",
                    "inputProps": {
                        options: '未见异常,异常',
                        sp: [{ label: '异常', inputType: 'MA', props: { options: '压痛,肿物' } }]
                    },
                    layout: "1/3",

                }, {
                    "key": "cervicalCancerGynecologicExamination.other",
                    "label": "其他",
                    "inputType": "input",
                    "inputProps": {},
                    layout: "1/3",

                }, {
                    "key": "selectBtn",
                    "label": "一键勾选",
                    "inputType": "check_invert_button",

                    layout: "1/3",

                }]
        }]
    return cache
}

