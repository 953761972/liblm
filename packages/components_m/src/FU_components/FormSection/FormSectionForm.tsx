import { mchcEvent } from '@lm_fe/env'
import { Anchor, Form, FormInstance, FormProps, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { MyFormSection } from './FormSection'
import { IFormSectionProps } from './types'
import { IMchc_TableConfig } from '@lm_fe/service'
import { use_form_config } from './helper'
import { isEmpty, map, filter } from 'lodash'

type IBase<T = any> = Omit<FormProps<T>, 'labelCol' | 'onFieldsChange' | 'onValuesChange' | 'wrapperCol'> &
    IFormSectionProps
export interface IFormSectionFormProps<T = any> extends IBase {
    onFieldsChange?(changedFields: any[], allFields: any[], form: FormInstance): void
    onValuesChange?(changedValues: { [x in keyof T]: any }, values: T, form: FormInstance): void
    bf_config?: IMchc_TableConfig
    data?: T
    disableAll?: boolean
    fsync?: boolean
}

export function MyFormSectionForm<T extends Object>(props: IFormSectionFormProps<T>) {
    const { onFieldsChange, onValuesChange, data, style = {}, bf_config, fsync, ...others } = props
    const [_form] = Form.useForm<any>()
    const form = props.form ?? _form

    const [f_config, form_anchor] = use_form_config(props)

    const onChange = onValuesChange ?? bf_config?.watchScript

    useEffect(() => {
        if (data && fsync) {
            if (!form) message.info('MyFormSectionForm has a empty form')

            form.resetFields()
            form.setFieldsValue(data)
        }

        return () => {}
    }, [data])

    function renderEditContent() {
        return (
            <MyFormSection form={form} targetLabelCol={bf_config?.targetLabelCol} {...others} bf_config={bf_config} />
        )
    }

    function CMyLazyComponent({ children }: { children: React.ReactNode }) {
        if (!form_anchor || isEmpty(form_anchor)) return <>{children}</>
        return (
            <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                <div style={{ minWidth: 86, paddingTop: 12, paddingRight: 12, height: '100%' }}>
                    <Anchor bounds={-50} getContainer={() => document.getElementById('Form-Anchor-Container')}>
                        {map(form_anchor.data, (item) => {
                            return <Anchor.Link key={item.id} href={`#${item.id}`} title={item.title} />
                        })}
                    </Anchor>
                </div>
                <div id="Form-Anchor-Container" style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <CMyLazyComponent>
            <Form
                {...others}
                onFieldsChange={(a, b) => {
                    onFieldsChange?.(a, b, form)
                }}
                onValuesChange={(changedValues, values) => {
                    onChange?.(changedValues, values, form)
                    mchcEvent.emit('my_form', {
                        form,
                        type: 'onChange',
                        name: Object.keys(changedValues)[0],
                        value: Object.values(changedValues)[0],
                        values,
                        setValue: (name, value) => {
                            const a = { [name]: value } as any
                            form.setFieldsValue(a)
                        },
                    })
                }}
                autoComplete="off"
                style={{
                    padding: 12,
                    ...style,
                }}
                form={form}
            >
                {renderEditContent()}
            </Form>
        </CMyLazyComponent>
    )
}
