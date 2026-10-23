import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";

const ctx = rt_ctx

function common_items0(index: '' | 1 | 3 | 6 | 12 = '') {
    return defineFormConfig([
        {
            label: '随访方式',
            key: `followUpWay${index}`,
            inputType: 'MC',
            layout: '1',
            inputProps: {
                marshal: 0,

                options: [
                    { label: '电话', value: '电话' },
                    { label: '微信', value: '微信' },
                    { label: '复诊', value: '复诊' },
                    { label: '现场', value: '现场' },
                ]
            }
        },
        {
            label: '随访情况',
            key: `followUpSituation${index}`,
            inputType: 'MC',
            layout: '1',
            inputProps: {
                marshal: 0,

                options: [
                    { label: '正常', value: '正常' },
                    { label: '未接听', value: '未接听' },
                    { label: '号码错误', value: '号码错误' },
                ]
            }
        },
    ]).__lazy_config
}
function common_items1(index: '' | 1 | 3 | 6 | 12 = '') {
    return defineFormConfig([
        {
            label: '备注',
            key: `note${index}`,
            inputType: 'MA',
            layout: '1/3',
        },
        {
            label: '随访日期',
            key: `followUpDate${index}`,
            inputType: 'DatePicker',
            layout: '1/3',
        },
        {
            label: '随访人',
            key: `followUpPerson${index}`,
            inputType: 'MA',
            layout: '1/3',
        },
    ]).__lazy_config
}
function common_items2(index: 3 | 6 | 12) {
    return defineFormConfig([
        {
            label: '流产后首次落实避孕方法',
            key: `afterMiscarriageFirstContraceptiveMethods${index}`,
            inputType: 'MC',
            layout: '1',
            inputProps: {
                marshal: 0,

                options: same_option
            }
        },

        {
            label: '存在问题',
            key: `person${index}`,
            inputType: 'MA',
            layout: '1/3',
        },

        {
            label: '是否更换其他方法',
            key: `replaceContraceptiveMethods`,
            inputType: 'MC',
            layout: '1/3',
            inputProps: {
                marshal: 0,
                options: '否,是'
            }
        },
        {
            label: '有无再次意外妊娠',
            key: `unexpectedPregnancyAgain`,
            inputType: 'MC',
            layout: '1/3',
            inputProps: {
                marshal: 0,
                options: '否,是'
            }
        },
    ]).__lazy_config
}
const same_option = [
    { label: '复方口服避孕药', value: '复方口服避孕药' },
    { label: 'IUD', value: 'IUD' },
    { label: '曼月乐', value: '曼月乐' },
    { label: '避孕套', value: '避孕套' },
    { label: '杀精剂', value: '杀精剂' },
    { label: '其他', value: '其他', },
]
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
            inputType: 'MixPanel',
            label: '',
            name: 'savedTabs',
            layout: '1',
            inputProps: {
                targetLabelCol: 5,
                conf: [
                    {
                        label: '首次随访',
                        default: true,
                        key: 'followup',
                        fds: [
                            ...common_items0(),
                            {
                                label: '本次意外妊娠原因',
                                key: `pregnancyCauses`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,

                                    options: '未避孕,避孕失败'
                                }
                            },
                            {
                                label: '以往避孕方式',
                                key: `pastContraceptiveMethods`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,

                                    options: [
                                        { label: '复方口服避孕药', value: '复方口服避孕药' },
                                        { label: 'IUD/IUS', value: 'IUD/IUS' },
                                        { label: '体外排精', value: '体外排精' },
                                        { label: '避孕套', value: '避孕套' },
                                        { label: '杀精剂', value: '杀精剂' },
                                        { label: '安全期', value: '安全期' },
                                        { label: '紧急避孕药', value: '紧急避孕药' },
                                        { label: '其他', value: '其他', },
                                    ]
                                }
                            },
                            {
                                label: '本次流产后建议选用方式',
                                key: `afterMiscarriageFirstContraceptiveMethods`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,

                                    options: same_option
                                }
                            },
                            {
                                label: '建议开始时间',
                                key: `suggestBeginTime`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,

                                    options: [
                                        { label: '立即', value: '立即' },
                                        { label: '流产后2周', value: '流产后2周' },
                                        { label: '流产后1月', value: '流产后1月' },
                                        { label: '其他', value: '其他', },
                                    ]
                                }
                            },
                            {
                                label: '是否立即处理落实',
                                key: `pregnancyCauses`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,
                                    options: '否,是'
                                }
                            },

                            {
                                label: '是否告知注意事项',
                                key: `noticeMatters`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,
                                    options: '否,是'
                                }
                            },
                            {
                                label: '是否指导正确使用',
                                key: `guidanceForProperUse`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,
                                    options: '否,是'
                                }
                            },
                            ...common_items1()
                        ]
                    },
                    {
                        label: '1个月随访',
                        default: true,
                        key: 'followup1',
                        fds: [
                            ...common_items0(1),
                            {
                                label: '术后出血天数',
                                key: `postoperativeBleedingDays`,
                                inputType: 'input_number',
                                layout: '1/3',
                            },
                            {
                                label: '月经是否恢复',
                                key: `menstruationRestored`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,
                                    options: '否,是'
                                }
                            },
                            {
                                label: '月经出血量',
                                key: `menstruationBleeding`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,

                                    options: '少,中,多'
                                }
                            },
                            {
                                label: '是否恢复性生活',
                                key: `resumeSex`,
                                inputType: 'MC',
                                layout: '1/3',
                                inputProps: {
                                    marshal: 0,
                                    options: '否,是'
                                }
                            },
                            {
                                label: '目前采取避孕方式',
                                key: `nowContraceptiveMethods`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,
                                    options: same_option
                                }
                            },
                            {
                                label: '今后计划采用避孕方式',
                                key: `afterMiscarriageFirstContraceptiveMethods`,
                                inputType: 'MC',
                                layout: '1',
                                inputProps: {
                                    marshal: 0,
                                    options: same_option
                                }
                            },

                            ...common_items1(1)

                        ]
                    },

                    {
                        label: '3个月随访',
                        default: false,
                        key: 'followup3',
                        fds: [
                            ...common_items0(3),
                            ...common_items2(3),
                            ...common_items1(3)
                        ]
                    },
                    {
                        label: '6个月随访',
                        default: false,
                        key: 'followup6',
                        fds: [
                            ...common_items0(6),
                            ...common_items2(6),
                            ...common_items1(6)
                        ]
                    },
                    {
                        label: '12个月随访',
                        default: false,
                        key: 'followup12',
                        fds: [
                            ...common_items0(12),
                            ...common_items2(12),
                            ...common_items1(12)
                        ]
                    },
                ]
            }
        },





    ]
)