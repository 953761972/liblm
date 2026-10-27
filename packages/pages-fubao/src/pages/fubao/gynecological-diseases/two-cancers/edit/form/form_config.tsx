import { getDualModeOptions, getSameOptions, mchcEnv } from "@lm_fe/env";
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { formatDate } from "@lm_fe/utils";
export function form_config(): IMchc_FormDescriptions_Field[] {
    if (mchcEnv.is('建瓯')) {
        return form_config_建瓯()
    }
    return [{
        "name": "基本信息",
        "sort": 0,
        "children": [
            {
                "key": "name",
                "label": "姓名",
                "inputType": "input",
                "rules": [{ "required": true, "message": "姓名是必填项" }],
                "inputProps": { "placeholder": "请输入姓名" },
                layout: '1/3',
            },
            {
                "key": "telephone",
                "label": "手机号码",
                "inputType": "input",
                "rules": [{ "required": true, "message": "手机号码是必填项" }, { "type": "string", "min": 11, "message": "请输入11位手机号码" }, { "max": 11, "message": "请输入正确的手机号码格式" }],
                "inputProps": { "placeholder": "请输入手机号码" },
                layout: '1/3',
            },
            {
                "key": "outpatientNo",
                "label": "门诊号",
                "inputType": "input",
                layout: '1/3',
            },

            {
                "key": "idType",
                "label": "证件类型",
                "inputType": "normal_select",
                layout: '1/3',
            },
            {
                "key": "idNO",
                "label": "证件号码",
                "inputType": "input",
                "rules": [{ "required": true, "message": "证件号码是必填项" }],
                layout: '1/3',
            },

            {
                "key": "dob",
                "label": "出生日期",
                "inputType": "single_date_picker",
                "rules": [{ "required": true, "message": "出生日期是必填项" }],
                "inputProps": { "placeholder": "请输入出生日期", "maxDate": "now" },
                layout: '1/3',
            },

            {
                "key": "ethnic",
                "label": "民族",
                "inputType": "MS",
                "required": true,
                inputProps: { uniqueKey: '民族s', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "age",
                "label": "年龄",
                "inputType": "input_number",
                "rules": [{ "required": true, "message": "年龄是必填项" }],
                layout: '1/3',
            },

            {
                "key": "maritalStatus",
                "label": "婚姻状态",
                "inputType": "MS",
                "rules": [{ "required": true, "message": "婚姻状态是必填项" }],
                inputProps: { uniqueKey: '婚姻', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "education",
                "label": "文化程度",
                "inputType": "MS",
                inputProps: { uniqueKey: '文化程度s', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "profession",
                "label": "职业",
                "inputType": "MS",
                inputProps: { uniqueKey: '职业s', marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "householdType",
                "label": "户口类型",
                "inputType": "MS",
                // "specialConfig": { "type": "familyTypeMapping" },
                inputProps: { options: ['农村', '城市'].map((_, idx) => ({ value: idx + '', label: _ })), marshal: 0 },
                layout: '1/3',
            },

            {
                "key": "permanentResidenceAddress",
                "label": "户口地址",
                "inputType": "MyAddress",
                layout: '2/3',
                isNewRow: 1,
            },
            {
                "key": "residenceAddress",
                "label": "居住地址",
                isNewRow: 1,
                "inputType": "MyAddress",
                "inputProps": {
                    addressBtns: [
                        { name: 'permanentResidenceAddress', label: '同上' },
                    ]
                },
                layout: '2/3',
            }]
    },
    ...两癌月经史form_config(),
    {
        "name": "其他信息",
        "sort": 0,
        "children": [{
            "key": "testingFacility",
            "label": "检测机构",
            "inputType": "input",
            layout: '1/3',
        }, {
            "key": "registerDate",
            "label": "登记日期",
            "inputType": "single_date_picker",
            layout: '1/3',
        }, {
            "key": "registerPerson",
            "label": "登记者",
            "inputType": "input",
            layout: '1/3',
        }]
    }]
}
function form_config_建瓯(): IMchc_FormDescriptions_Field[] {
    return [{
        "name": "基本信息",
        "sort": 0,
        "children": [
            {
                "key": "name",
                "label": "姓名",
                "inputType": "input",
                required: true,
                "inputProps": { "placeholder": "请输入姓名" },
                layout: '1/3',
            },
            {
                "key": "idNO",
                "label": "身份证号",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "dob",
                "label": "出生日期",
                "inputType": "DatePicker",
                required: true,

                layout: '1/3',
            },
            {
                "key": "age",
                "label": "年龄",
                "inputType": "input_number",
                required: true,

                layout: '1/3',
            },
            {
                "key": "telephone",
                "label": "电话",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "ethnic",
                "label": "民族",
                "inputType": "MS",
                "required": true,
                inputProps: { uniqueKey: '民族s', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "outpatientNo",
                "label": "门诊号",
                "inputType": "input",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "reportYear",
                "label": "上报年份",
                "inputType": 'DatePicker',
                "required": true,
                layout: '1/3',
            },

            {
                "key": "poorWomenCard",
                "label": "贫困妇女立卡",
                "inputType": "MS",
                "required": true,
                inputProps: { options: '否,是', marshal: 0 },
                layout: '1/3',
            },



            {
                "key": "residenceAddress",
                "label": "居住地址",
                isNewRow: 1,
                "inputType": "MyAddress",
                "inputProps": {
                },
                layout: '2/3',
            }]
    },
    ...两癌月经史form_config(true),
    {
        "name": "其他信息",
        "sort": 0,
        "children": [{
            "key": "testingFacility",
            "label": "检测机构",
            "inputType": "input",
            layout: '1/3',
        }, {
            "key": "registerDate",
            "label": "登记日期",
            "inputType": "single_date_picker",
            layout: '1/3',
        }, {
            "key": "registerPerson",
            "label": "登记者",
            "inputType": "input",
            layout: '1/3',
        }]
    }]
}

export function 两癌月经史form_config(append = false): IMchc_FormDescriptions_Field[] {
    return [
        {
            "moduleName": "two-cancers",
            "name": "月经史",
            "flag": "妇女保健-两癌筛查添加-月经史",
            "sort": 0,
            "fields": [
                { key: 'womenHealthcareMenstrualHistory.id', form_hidden: true },
                {
                    "key": "womenHealthcareMenstrualHistory.menarche",
                    "label": "初潮(岁)",
                    "inputType": "input_number",
                    required: true,
                    inputProps: { unknown: true },
                    layout: '1/3',
                },
                {
                    "key": "womenHealthcareMenstrualHistory.primiparityAge",
                    "label": "初产(岁)",
                    "inputType": "input_number",
                    "required": true,
                    layout: '1/3',
                },
                mchcEnv.in(['建瓯'])
                    ? null
                    : {
                        "key": "womenHealthcareMenstrualHistory.menstrualCycle",
                        "label": "月经周期(天)",
                        "inputType": "input_number",
                        "rules": [{ "required": true, "message": "月经周期(天)是必填项" }],
                        layout: '1/3',
                    },
                mchcEnv.in(['建瓯'])
                    ? null
                    : {
                        "key": "womenHealthcareMenstrualHistory.menstrualPeriod",
                        "label": "月经持续天数",
                        "inputType": "input_number",
                        "rules": [{ "required": true, "message": "月经持续天数是必填项" }],
                        layout: '1/3',
                    },
                mchcEnv.in(['建瓯'])
                    ? null
                    : {
                        "key": "womenHealthcareMenstrualHistory.menstrualVolume",
                        "label": "经量",
                        "inputType": "MC",
                        "rules": [{ "required": true, "message": "经量是必填项" }],
                        inputProps: {
                            options: getSameOptions('多,中,少'),
                            marshal: 0
                        },
                        layout: '1/3',
                    },
                mchcEnv.in(['建瓯'])
                    ? null
                    : {
                        "key": "womenHealthcareMenstrualHistory.dysmenorrhea__",
                        "label": "痛经",
                        "inputType": "MC",
                        // "inputType": "checkbox_with_input",
                        "rules": [{ "required": true, "message": "痛经是必填项" }],
                        // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "无", "withInput": false, "span": 6 }, { "value": 2, "label": "有", "withInput": true, "isIssue": true, "inputSpan": 12, "span": 6 }] },
                        inputProps: { options: '否,是i', marshal: 2, },
                        layout: '1/3',
                    },
                {
                    "key": "womenHealthcareMenstrualHistory.lmd",
                    "label": "末次月经",
                    "inputType": "DatePicker",
                    inputProps: { format: formatDate.format },
                    layout: '1/3',
                },
                {
                    "key": "womenHealthcareMenstrualHistory.menopause",
                    "label": "绝经",
                    "inputType": "MC",
                    // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "否", "withInput": false, "span": 6 }, { "value": 2, "label": "是", "withInput": true, "isIssue": true, "inputSpan": 12, "span": 6 }] },
                    inputProps: { marshal: 0, options: '否,是,不详', },
                    layout: '1/3',
                },
                {
                    "key": "womenHealthcareMenstrualHistory.menopauseNote",
                    "label": "绝经年龄",
                    "inputType": 'input_number',
                    // "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "否", "withInput": false, "span": 6 }, { "value": 2, "label": "是", "withInput": true, "isIssue": true, "inputSpan": 12, "span": 6 }] },
                    layout: '1/3',
                    requiredDeps: {
                        'womenHealthcareMenstrualHistory.menopause': [1]
                    }
                },
                //  {
                //     
                //     "key": "womenHealthcareMenstrualHistory.menopauseAge",
                //     "label": "绝经年龄",
                //     "inputType": "input_number",
                //     
                //     "inputProps": { "dependency": { "show": { "key": "womenHealthcareMenstrualHistory.menopause", "value": [2] } } },
                //     layout: '1/3',
                //     
                // }, 
                mchcEnv.in(['建瓯'])
                    ? null
                    : {
                        "key": "womenHealthcareMenstrualHistory.menopauseSurgery",
                        "label": "绝经手术",
                        "inputType": "checkbox_group",
                        "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "否", "span": 6, "withInput": false }, { "value": 2, "label": "是", "withInput": false, "isIssue": true, "span": 6, "inputSpan": 12 }] },
                        layout: '1/3',
                    },

                append ? {
                    "key": "womenHealthcareMenstrualHistory.sfbr",
                    "label": "是否哺乳",
                    "inputType": "checkbox_group",
                    required: true,
                    "specialConfig": { "type": "single", "options": [{ "value": 1, "label": "否", "span": 8, "withInput": false }, { "value": 2, "label": "是", "withInput": false, "span": 8, "inputSpan": 8 }] },
                    layout: '1/3',

                } : null,
                {
                    "key": "womenHealthcareMenstrualHistory.conceived",
                    "label": "孕次",
                    "inputType": "input_number",
                    layout: '1/3',
                }, {
                    "key": "womenHealthcareMenstrualHistory.parity",
                    "label": "产次",
                    "inputType": "input_number",
                    layout: '1/3',
                },
            ]
        },
    ]
}