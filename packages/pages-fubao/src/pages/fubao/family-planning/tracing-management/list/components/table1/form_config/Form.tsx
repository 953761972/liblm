import { MyFormSectionForm } from '@lm_fe/components_m'
import { mchcEnv, mchcEvent } from '@lm_fe/env'
import { Form, FormInstance } from 'antd'
import React, { useEffect } from 'react'

interface IProps {
    form?: FormInstance
}
interface IDataShape {
    name: string
}

export function load_form_config() {
    return import('./default')
}

export default (props: IProps) => {
    const [_form] = Form.useForm()
    const form = props.form ?? _form

    useEffect(() => {
        const rm = mchcEvent.on_rm('my_form', (e) => {
            if (e.type === 'onChange') {
            } else if (e.type === 'onClick') {
            }
        })
        return rm
    }, [])

    //@ts-ignore
    return (
        <MyFormSectionForm<IDataShape>
            formDescriptions={load_form_config}
            form={form}
            onValuesChange={(changedValues, values) => {}}
        />
    )
}
