import { BF_Wrap2 } from '@lm_fe/pages'
import { IIC, ITpl } from './constant_new'
import { FormSectionForm, OkButton } from '@lm_fe/components_m'
import { TIdTypeCompatible } from '@lm_fe/service'
import { AnyObject, isNil, request, set } from '@lm_fe/utils'
import { Card, Form, Space } from 'antd'
import React, { useEffect } from 'react'
interface IProps {
    template: ITpl
    pregnancyId: TIdTypeCompatible
    IC?: IIC
    caseType?: 'pregnancyId' | 'admissionId'
    on_save(item: IIC): void
}
export function ComponentPanl({ template, pregnancyId, caseType, IC, on_save }: IProps) {
    const [form] = Form.useForm()
    const { config, Wrap } = BF_Wrap2({ default_conf: { title: `门诊-个案登记卡-${template.code}`, tableColumns: template.conf } })
    useEffect(() => {
        form.resetFields()
        console.log('IC', IC)
        if (!IC) {
            form.setFieldsValue({ [caseType]: pregnancyId, ...template })
        } else {
            request.get('/api/ic/getDetail', { params: { id: IC.id } })
                .then(r => {
                    form.setFieldsValue(r.data)

                })

        }
        return () => {

        }
    }, [IC])
    function submit(url: string, state?: number,) {
        let values = form.getFieldsValue()
        if (!isNil(state)) {
            values = set(values, 'state', state)
        }
        request
            .post<IIC>(url, values, { successText: '操作成功' })
            .then(r => {
                const res = r.data

                form.setFieldsValue(res)
                on_save(res)

            })
    }
    const state = IC?.state || template.state

    return <Card style={{ height: '100%' }} styles={{ body: { padding: 0, height: '100%', overflow: 'auto' }, title: { textAlign: 'center' } }} >
        <Wrap>
            <FormSectionForm form={form} bf_config={config} />
            <Space.Compact style={{ position: 'fixed', right: 32, bottom: 32 }}>

                {/* <OkButton disabled={!IC} btn_text='打印' /> */}
                <OkButton disabled={state > 1} primary btn_text='保存' onClick={() => submit('/api/ic/saveForm')} />
                <OkButton disabled={state > 2} primary btn_text='提交' onClick={() => submit('/api/ic/submitForm', 2)} />




            </Space.Compact>
        </Wrap>
    </Card>
}
