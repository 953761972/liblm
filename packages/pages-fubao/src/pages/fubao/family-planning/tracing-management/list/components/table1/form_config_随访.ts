import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";

const ctx = rt_ctx

export default defineFormConfig(
    [
        {

            label: "姓名",
            name: "name",
            inputType: 'MA',
            inputProps: {
            },
            layout: '1/3'
        },
        {

            label: "孕次",
            name: "conceived",
            inputType: 'input_number',
            inputProps: {
            },
            layout: '1/3'
        },
        {

            label: "产次",
            name: "parity",
            inputType: 'input_number',
            inputProps: {
            },
            layout: '1/3'
        },


        {

            label: "出生日期",
            name: "dob",
            inputType: 'DatePicker',
            layout: '1/3'
        },

        {
            label: "年龄",
            name: "age",
            inputType: 'input_number',
            layout: '1/3'
        },
        {

            label: "电话号码",
            name: "telephone",
            inputType: 'MA',
            inputProps: {
            },
            layout: '1/3'
        },


        {

            label: "首次随访",
            children: [
                {
                    label: '随访方式',
                    key: 'followUpWay',
                    inputType: 'MC',
                    inputProps: {
                        marshal: 0,
                        useString: true,
                        options: '电话,微信,复诊,现场'
                    }
                },
                {
                    label: '随访情况',
                    key: 'followUpWay',
                    inputType: 'MC',
                    inputProps: {
                        marshal: 0,
                        useString: true,
                        options: '正常,未接听,号码错误'
                    }
                },
            ],
            containerType: 'segs'
        },
        {

            label: "1个月随访",
            children: [
                {
                    label: '随访方式',
                    key: 'followUpWay',
                    inputType: 'MC',
                    inputProps: {
                        marshal: 0,
                        useString: true,
                        options: '电话,微信,复诊,现场'
                    }
                },
                {
                    label: '随访情况',
                    key: 'followUpWay',
                    inputType: 'MC',
                    inputProps: {
                        marshal: 0,
                        useString: true,
                        options: '正常,未接听,号码错误'
                    }
                },
            ],
            containerType: 'segs'
        },
        {
            label: '历史',
            key: '',
            inputType: 'MyEditTable',
            inputProps: {
                disabled: true,
                formDescriptions: [
                    { title: '怀孕状态', dataIndex: 'pregnancyStatus', inputType: 'MS', inputProps: { uniqueKey: 'Pregnancy.pregnancyStatus', marshal: 0 } },
                    { title: '传染病内容', dataIndex: 'infectionContent', inputType: 'Input', },
                    { title: '随访内容', dataIndex: 'followupContent', inputType: 'Input', },
                    { title: '随访状态', dataIndex: 'followupState', inputType: 'MS', inputProps: { uniqueKey: '随访状态', marshal: 0 } },
                ]
            }
        }


    ]
)