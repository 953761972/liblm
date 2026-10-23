import { defineFormConfig } from '@lm_fe/service'
import { rt_ctx } from '@lm_fe/env'

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
        inputType: 'MS',
        layout: '1/3',
        inputProps: {
            options: [
                { label: '首次随访', value: '0' },
                { label: '1个月随访', value: '1' },
                { label: '3个月随访', value: '3' },
                { label: '6个月随访', value: '6' },
                { label: '12个月随访', value: '12' },
                { label: '全部', value: '' },
            ],
        },
    },
    {
        key: 'surgeryDoctor',
        label: '手术医生',
        inputType: 'input',
        rules: [{ required: true, message: '手术医生是必填项' }],
        layout: '1/3',
    },
    {
        key: 'followUpType',
        label: '待随访类型',
        inputType: 'MS',
        layout: '1/3',
        inputProps: {
            options: [
                { label: '首次随访', value: '0' },
                { label: '1个月随访', value: '1' },
                { label: '3个月随访', value: '3' },
                { label: '6个月随访', value: '6' },
                { label: '12个月随访', value: '12' },
                { label: '全部', value: '' },
            ],
        },
    },
    {
        key: 'actionsss',
        label: '操作',
        layout: '1/1',
        render: (text, record) => {
            return (
                <ctx.ui.Space>
                    <ctx.ui.Button
                        size="small"
                        type="link"
                        onClick={() => ctx.props.handleShowModal(record, ctx.props.handleSearch)}
                    >
                        随访
                    </ctx.ui.Button>

                </ctx.ui.Space>
            )
        },
    },
])
