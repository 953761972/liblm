import { defineFormConfig } from '@lm_fe/service'
import { get } from 'lodash'
import { rt_ctx } from "@lm_fe/env";

const ctx = rt_ctx
const React = ctx.React

export default defineFormConfig([
    {
        key: 'outpatientNo',
        label: '门诊号',
        inputType: 'input',
        layout: '1/3',
    },
    {
        key: 'name',
        label: '姓名',
        inputType: 'input',
        required: true,
        inputProps: { placeholder: '请输入姓名' },
        layout: '1/3',
    },
    {
        key: 'age',
        label: '年龄',
        inputType: 'input_number',
        rules: [{ required: true, message: '年龄是必填项' }],
        layout: '1/3',
    },
    {
        key: 'telephone',
        label: '手机号码',
        inputType: 'input',
        rules: [
            { required: true, message: '手机号码是必填项' },
            { type: 'string', min: 11, message: '请输入11位手机号码' },
            { max: 11, message: '请输入正确的手机号码格式' },
        ],
        inputProps: { placeholder: '请输入手机号码' },
        layout: '1/3',
    },
    {
        key: 'surgeryDate',
        label: '手术日期',
        hidden: true,
        inputType: 'single_date_picker',
        rules: [{ required: true, message: '手术日期是必填项' }],
        inputProps: { placeholder: '请输入手术日期', maxDate: 'now' },
        layout: '1/3',
    },
    {
        key: 'surgeryType',
        label: '手术类型',
        inputType: 'normal_select',
        layout: '1/3',
    },
    {
        key: 'surgeryDoctor',
        label: '手术医生',
        inputType: 'input',
        rules: [{ required: true, message: '手术医生是必填项' }],
        layout: '1/3',
    },
    {
        title: '随访记录',
        align: 'center',
        children: [
            {
                key: 'firstFollowUpState',
                label: '首次',
                inputType: 'input',
                layout: '1/3',
            },
            {
                key: 'oneMonthFollowUpState',
                label: '1个月',
                inputType: 'input',
                layout: '1/3',
            },
            {
                key: 'threeMonthFollowUpState',
                label: '3个月',
                inputType: 'input',
                layout: '1/3',
            },
            {
                key: 'sixMonthFollowUpState',
                label: '6个月',
                inputType: 'input',
                layout: '1/3',
            },
            {
                key: 'twelveMonthFollowUpState',
                label: '12个月',
                inputType: 'input',
                layout: '1/3',
            },
        ],
    },
    // {
    //     key: 'remark',
    //     label: '备注',
    //     inputType: 'input',
    //     layout: '1/1',
    //     render: (text, record) => {
    //         return <div onClick={() => ctx.props.handleShowModal(record)}>BTN</div>
    //     }
    // }
])
