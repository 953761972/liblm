import { BaseEditPanelFormFC } from '@lm_fe/components_m'
import { mchcModal__ } from '@lm_fe/pages'
import { IMchc_TableConfig } from '@lm_fe/service'
import { AnyObject, request, safe_async_call } from '@lm_fe/utils'
import { Form } from 'antd'
import { get } from 'lodash'
import React, { useEffect, useState } from 'react'
export interface IRenderContentProps {
    outpatientNo: string
    config?: IMchc_TableConfig
    activeItem?: AnyObject
    active_key: string
    onRefresh: () => void
}
export function RenderContent(props: IRenderContentProps) {
    const { config, activeItem, active_key, onRefresh, outpatientNo } = props
    const [data_cache, set_data_cache] = useState<AnyObject>()

    const [form] = Form.useForm()

    useEffect(() => {
        handleInit()
        return () => {}
    }, [activeItem])

    async function handleInit() {
        let res: AnyObject = { outpatientNo };
        if (get(activeItem, 'id')) {
            res = (await request.get<{ data: AnyObject[] }>(
                `/api/family/planning/getFamilyPlanningEarlyPregnancyCheck?id.equals=${get(
                    activeItem,
                    'id',
                )}&checkType.equals=${get(activeItem, 'checkType')}&deleteFlag.equals=0`,
            )).data.data[0]
        }
        let data = (await safe_async_call(config?.handleBeforePopup, res)) || res
        form.resetFields()

        form.setFieldsValue(data)
        set_data_cache(data)
    }

    async function handleImport(outpatientNo: string) {
        const res = await request.get(`/api/family/planning/importCheckInspection?outpatientNO=${outpatientNo}`)
        return res
    }

    async function handleSubmit(values: any) {
        let params = await safe_async_call(config?.beforeSubmit, values)

        params = {
            ...data_cache,
            ...params,
        }

        let res: AnyObject
        if (get(values, 'id')) {
            // 修改
            res = await request.put('/api/family/planning/updateFamilyPlanningEarlyPregnancyCheck', params)
        } else {
            // 新建
            const syncRes = await handleImport(values?.outpatientNo)
            const syncData = get(syncRes, ['data', 'data']) || {}
            res = await request.post('/api/family/planning/addFamilyPlanningEarlyPregnancyCheck', {
                ...params,
                earlyPregnancyCheckInspection: syncData
            })
        }
        set_data_cache(get(res.data, 'data'))
        onRefresh && onRefresh()
    }
    //打印
    function handlePrint() {
        mchcModal__.open('print_modal', {
            modal_data: {
                request,
                requestData: {
                    url: '/api/family/planning/medicalRecordPdfPreview',
                    resource: active_key,
                    template: '',
                    version: '',
                    note: '',
                    id: data_cache?.id,
                },
            },
        })
    }
    return (
        <BaseEditPanelFormFC
            // renderBtns={config?.}
            targetLabelCol={5}
            print_btn_props={{ disabled: !data_cache?.id }}
            onPrint={handlePrint}
            form={form}
            formDescriptions={config?.tableColumns}
            onFinish={handleSubmit}
        />
    )
}
