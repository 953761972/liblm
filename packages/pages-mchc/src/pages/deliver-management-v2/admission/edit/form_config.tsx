import { ICommonOption, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { formatDate } from "@lm_fe/utils";
const ctx = rt_ctx
const 无有option: ICommonOption[] = [
    { label: '无', value: 1 },
    { label: '有', value: 2, warning: true, inputType: 'MI' }
]
export default defineFormConfig([
    {
        "name": "住院信息",
        "children": [
            {
                "key": "areaName",
                "label": "病区",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "roomNO",
                "label": "房号",
                "inputType": "input",
                required: true,
                "isNewRow": 1,
                layout: '1/3',
            },
            {
                "key": "bedNO",
                "label": "床号",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "nurseLevel",
                "label": "护理级别",
                "inputType": "normal_select",
                "specialConfig": { 'type': 'nurseLevelMapping' },
                required: true,
                layout: '1/3',
            },
            {
                "key": "doctor",
                "label": "管床医生",
                "inputType": "input",
                layout: '1/3',
            },
            {
                "key": "nurse",
                "label": "管床护士",
                "inputType": "input",
                layout: '1/3',
            },
        ]
    },
    {
        "name": "患者信息",
        children: [
            {
                "key": "idType",
                "label": "证件类型",
                "inputType": "normal_select",
                required: true,
                layout: '1/3',
            },
            {
                "key": "idNO",
                "label": "证件号码",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "name",
                "label": "孕妇姓名",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },
            {
                "key": "dob",
                "label": "出生日期",
                "inputType": "single_date_picker",
                required: true,
                "inputProps": { "placeholder": "请输入出生日期", "maxDate": "now" },
                layout: '1/3',
            },
            {
                "key": "age",
                "label": "孕妇年龄",
                "inputType": "input",
                required: true,
                layout: '1/3',
            },

            {
                "key": "registeredResidenceNature",
                "label": "户籍属性",
                "inputType": "normal_select",
                "specialConfig": { 'type': 'AddresstypeMapping' },
                required: true,
                layout: '1/3',
                "isNewRow": 1,
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
                "key": "maritalStatus",
                "label": "婚姻状况",
                "inputType": "MS",
                "required": true,
                inputProps: { uniqueKey: '婚姻', marshal: 0 },
                layout: '1/3',
            },


            {
                "key": "education",
                "label": "文化程度",
                "inputType": "normal_select",
                "required": true,
                "specialConfig": { 'type': 'degreeofeducationMapping' },
                layout: '1/3',
            },
            {
                "key": "occupation",
                "label": "职业",
                "inputType": "MS",
                inputProps: { uniqueKey: '职业s', marshal: 0 },
                layout: '1/3',
            },
            {
                "key": "lmp",
                "label": "末次月经",
                "inputType": "DatePicker",
                "required": true,
                inputProps: { format: formatDate.format },
                layout: '1/3',
            },
            {
                "key": "edd",
                "label": "预产期",
                "inputType": "DatePicker",
                "required": true,
                inputProps: { format: formatDate.format },
                layout: '1/3',
            },
            {
                "key": "sureEdd",
                "label": "修订预产期",
                "inputType": "DatePicker",
                "required": true,
                inputProps: { format: formatDate.format },
                layout: '1/3',
            },
            {
                "key": "gestationalWeek",
                "label": "孕周",
                "inputType": "input",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "gravidity",
                "label": "孕次",
                "inputType": "input_number",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "parity",
                "label": "产次",
                "inputType": "input_number",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "embryoNumber",
                "label": "胎数",
                "inputType": "input",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "inpatientNO",
                "label": "住院号",
                "inputType": "input",
                "required": true,
                layout: '1/3',
            },
            {
                "key": "adminDate",
                "label": "住院日期",
                "inputType": "DatePicker",
                "required": true,
                inputProps: { format: formatDate.format },
                layout: '1/3',
            },
            {
                "key": "settlementType",
                "label": "结算方式",
                "inputType": "normal_select",
                "required": true,
                "specialConfig": { 'type': 'settlementTypeMapping' },
                layout: '1/3',
            },


            {
                "key": "permanentResidenceAddress",
                "label": "户籍地址",
                "inputType": "MyAddress",
                layout: '2/3',
                isNewRow: 1,
            },
            {
                "key": "residenceAddress",
                "label": "居住地址",
                "inputType": "MyAddress",
                layout: '2/3',
                isNewRow: 1,
            },
            {
                "key": "telephone",
                "label": "电话",
                "inputType": "input",
                "required": true,
                layout: '1/3',
            },

        ]
    },
    {
        "name": "联系人信息",
        "children": [{
            "key": "contacterName",
            "label": "姓名",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {
            "key": "contacterIdType",
            "label": "证件类型",
            "inputType": "normal_select",
            required: true,
            layout: '1/3',
        }, {
            "key": "contacterIdNO",
            "label": "证件号码",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {
            "key": "contacterRelative",
            "label": "与患者关系",
            "inputType": "normal_select",
            "specialConfig": { 'type': 'relationMapping' },
            required: true,
            layout: '1/3',
        }, {
            "key": "contacterTelephone",
            "label": "电话",
            "inputType": "input",
            required: true,
            layout: '1/3',
        }, {
            "key": "contacterResidenceAddress",
            "label": "居住地址",
            "inputType": "MyAddress",
            "inputProps": {
                addressBtns: [
                    { name: 'residenceAddress', label: '同上' },
                ]
            },
            layout: '2/3',
        },]
    },
    {
        name: '转科登记',
        children: [{
            name: "referrals",

            layout: '1/1',
            inputType: 'MyEditTable',
            inputProps: {
                marshal: 0,
                showEdit: true,
                formDescriptions: [
                    {
                        label: '转入/转出',
                        name: 'referralType',
                        inputType: 'normal_select',
                        "inputProps": {
                            'options': [
                                { 'value': 1, 'label': '转入' },
                                { 'value': 2, 'label': '转出' },
                            ]
                        },
                    },
                    {
                        label: '转入/转出科室',
                        name: 'referralDept',
                        inputType: 'normal_select',
                        "inputProps": {
                            "options": [{
                                "label": "妇科",
                                "value": "妇科"
                            }, {
                                "label": "新生儿科",
                                "value": "新生儿科"
                            }, {
                                "label": "产科",
                                "value": "产科"
                            }]
                        }
                    },
                    { label: '转入/转出日期', name: 'referralDate', inputType: 'single_date_picker' },
                    { label: '备注', name: 'reason', inputType: 'input' },
                ],
            },
        },]
    }
])