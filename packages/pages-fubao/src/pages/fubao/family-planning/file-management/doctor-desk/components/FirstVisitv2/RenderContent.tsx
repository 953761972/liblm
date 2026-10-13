import { BaseEditPanelFormFC } from '@lm_fe/components_m';
import { mchcModal__ } from '@lm_fe/pages';
import { IMchc_TableConfig } from '@lm_fe/service';
import { AnyObject, request, safe_async_call } from '@lm_fe/utils';
import { Form } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
export interface IRenderContentProps {
    config?: IMchc_TableConfig
    activeItem?: AnyObject
    active_key: string
    onRefresh: () => void
}
export function RenderContent(props: IRenderContentProps) {
    const { config, activeItem, active_key, onRefresh } = props
    const [data_cache, set_data_cache] = useState<AnyObject>({})


    const [form] = Form.useForm()




    useEffect(() => {
        handleInit();
        return () => { }
    }, [activeItem])


    async function handleInit() {
        let res: AnyObject = {};
        if (get(activeItem, 'id')) {
            res = await request.get(
                `/api/family/planning/getFamilyPlanningEarlyPregnancyCheck?id.equals=${get(
                    activeItem,
                    'id',
                )}&checkType.equals=${get(activeItem, 'checkType')}&deleteFlag.equals=0`,
            )
        }
        let data = (await safe_async_call(config?.handleBeforePopup, get(res, 'data.data.0'))) || {}
        form.setFieldsValue(data)
        set_data_cache(data)
    };

    async function handleSubmit(values: any) {
        let params = await safe_async_call(config?.beforeSubmit, values)

        params = {
            ...data_cache,
            ...params,
        };


        let res: AnyObject
        if (get(values, 'id')) {
            // 修改
            res = await request.put('/api/family/planning/updateFamilyPlanningEarlyPregnancyCheck', params)
        } else {
            res = await request.post('/api/family/planning/addFamilyPlanningEarlyPregnancyCheck', params)

        }
        set_data_cache(get(res.data, 'data'))
        onRefresh && onRefresh();
    };
    //打印
    function handlePrint() {

        mchcModal__.open('print_modal', {
            modal_data: {
                request,
                requestData: {
                    url: '/api/family/planning/casePdfPreview',
                    resource: active_key,
                    template: '',
                    version: '',
                    note: '',
                    id: data_cache.id,
                }
            }
        })
    }
    return <BaseEditPanelFormFC
        // renderBtns={config?.}
        targetLabelCol={5}
        // print_btn_props={{ disabled: !data_cache.id }}
        // onPrint={handlePrint}
        form={form}
        formDescriptions={config?.tableColumns}
        onFinish={handleSubmit}
    />
}
