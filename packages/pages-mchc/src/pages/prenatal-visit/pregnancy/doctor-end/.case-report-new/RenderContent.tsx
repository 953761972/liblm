import { FormSectionForm } from '@lm_fe/components_m';
import { safe_async_call } from '@lm_fe/utils';
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { IRenderContentProps } from './types';

export function RenderContent(props: IRenderContentProps) {
    const { config, activeItem } = props


    const [form] = Form.useForm()




    useEffect(() => {
        handleInit();
        return () => { }
    }, [activeItem])


    async function handleInit() {
        let data = (await safe_async_call(config?.handleBeforePopup)) || {}
        form.resetFields()
        form.setFieldsValue(data)
    };



    return <FormSectionForm
        form={form}
        bf_config={config}
    />

}
