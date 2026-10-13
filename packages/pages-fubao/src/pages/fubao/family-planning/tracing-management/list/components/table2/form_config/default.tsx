import { defineFormConfig } from '@lm_fe/service'
import { get } from 'lodash'
import React from 'react'

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
        key: 'followUpType',
        label: '随访类型',
        inputType: 'normal_select',
        layout: '1/3',
        render: (text: any, record: any) => {
            return get(record, ['earlyPregnancyCheckPacTrackingFollowUpRecordVMS', '0', 'followUpType'], '')
        }
    },
    {
        key: 'followUpWay',
        label: '随访方式',
        inputType: 'normal_select',
        layout: '1/3',
        render: (text: any, record: any) => {
            return get(record, ['earlyPregnancyCheckPacTrackingFollowUpRecordVMS', '0', 'followUpWay'], '')
        }
    },
    {
        key: 'followUpSituation',
        label: '随访情况',
        inputType: 'input',
        layout: '1/3',
        render: (text: any, record: any) => {
            let _text = get(record, ['earlyPregnancyCheckPacTrackingFollowUpRecordVMS', '0', 'followUpSituation'], '')
            if (_text === '正常') {
                return <span style={{ color: '#21AC8D' }}>{_text}</span>
            } else {
                return <span style={{ color: '#FD617F' }}>{_text}</span>
            }
        },
    },
    {
        label: '随访时间',
        key: 'followUpDate',
        render: (text: any, record: any) => {
            return get(record, ['earlyPregnancyCheckPacTrackingFollowUpRecordVMS', '0', 'followUpDate'], '')
        },
    },
    {
        label: '随访人',
        key: 'followUpPerson',
        render: (text: any, record: any) => {
            return get(record, ['earlyPregnancyCheckPacTrackingFollowUpRecordVMS', '0', 'followUpPerson'], '')
        },
    },
])
