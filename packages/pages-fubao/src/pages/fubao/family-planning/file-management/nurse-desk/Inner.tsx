import { get, set } from 'lodash'
import { BaseEditPanelFormFC, OkButton } from '@lm_fe/components_m'
import { mchcDriver, mchcUtils } from '@lm_fe/env'
import { use_provoke } from '@lm_fe/provoke'
import { AnyObject, request } from '@lm_fe/utils'
import { Form, Space } from 'antd'
import { RedoOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { BF_Wrap2 } from '@lm_fe/pages'

const form_fn = () => import('./form_config')

function FamilyPlanning_FileManagement_NurseDesk_Inner(props: any) {
    const id = mchcUtils.single_id(props)
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '妇科专病-基本信息',
            tableColumns: form_fn,
        },
    })

    const user = use_provoke((s) => s.user_info)
    const [form] = Form.useForm()
    const [data, set_data] = useState<AnyObject>({})

    useEffect(() => {
        handleInit()
    }, [])

    async function handleInit() {
        let data = {}

        if (!id) {
            set(data, 'registerPerson', get(user, 'firstName'))
        }

        if (id) {
            const res = await request.get(`/api/family/planning/getFamilyPlanningFile/page?id.equals=${id}`)
            data = get(res, ['data', 'data', 'pageData', 0])
        }

        set_data(data)
        form.setFieldsValue(data)
    }

    async function handleSubmit() {
        const values = form.validateFields()
        // const values = form.getFieldsValue()
        let submit_values = { ...values }

        if (values?.id) {
            // 修改、审核
            submit_values = {
                ...data,
                ...submit_values,
                fileState: 1,
            }
            await request.put('/api/family/planning/updateFamilyPlanningFile', submit_values)
        }
        // 新建
        submit_values = {
            ...submit_values,
            // ...syncData,
            fileState: 1,
        }

        await request.post('/api/family/planning/addFamilyPlanningFile', submit_values)
    }

    return (
        <Wrap>
            <BaseEditPanelFormFC
                form={form}
                formDescriptions={__DEV__ ? form_fn : config?.tableColumns}
                renderBtns={() => {
                    return (
                        <Space>
                            <OkButton size="large" type="primary" icon={<RedoOutlined />} onClick={() => form.resetFields()}>
                                重置
                            </OkButton>
                            <OkButton type="primary" size="large" icon={<SaveOutlined />} onClick={handleSubmit}>
                                {`${get(data, ['fileState']) == 1 ? '保存' : '保存并审核'}`}
                            </OkButton>
                        </Space>
                    )
                }}
                // onFinish={async (values) => {
                //     return handleSubmit(values)
                // }}
            />
        </Wrap>
    )
}
export default FamilyPlanning_FileManagement_NurseDesk_Inner
