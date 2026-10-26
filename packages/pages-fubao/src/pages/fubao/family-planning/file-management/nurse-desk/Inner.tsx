import { get, set } from 'lodash'
import { BaseEditPanelFormFC } from '@lm_fe/components_m'
import { mchcDriver, mchcUtils } from '@lm_fe/env'
import { use_provoke } from '@lm_fe/provoke'
import { AnyObject, request } from '@lm_fe/utils'
import { Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { BF_Wrap2 } from '@lm_fe/pages'

const baseUrl = '/api/family/planning/updateFamilyPlanningFile'

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

    async function handleSubmit(values: any) {
        let submit_values = {...values}
        //判断是否继续新建还是保存审核
        if (!values?.id) {
            submit_values = {
                ...submit_values,
                fileStatus: 1,
            }

            await request.post('/api/family/planning/addFamilyPlanningFile', submit_values)
        } else if (get(values, 'id')) {
            // 修改档案
            submit_values = {
                ...data,
                ...submit_values,
                fileStatus: 1,
            }
            await request.put('/api/family/planning/updateFamilyPlanningFile', submit_values)
        }
    }

    return (
        <Wrap>
            <BaseEditPanelFormFC
                form={form}
                formDescriptions={__DEV__ ? form_fn : config?.tableColumns}
                onFinish={async (values) => {
                    return handleSubmit(values)
                }}
            />
        </Wrap>
    )
}
export default FamilyPlanning_FileManagement_NurseDesk_Inner
