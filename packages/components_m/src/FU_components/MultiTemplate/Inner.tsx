import { fuck_the_form } from '@lm_fe/components';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { AnyObject, get, set } from '@lm_fe/utils';
import { Button, Space } from 'antd';
import React, { useRef } from 'react';
import { OkButton } from '../OkButton';
import { MultiTemplateTemplateGroup } from './Templates';
import { IMultiTemplateProps, IMultiTemplate_item } from './types';

const SPLIT_KEY = ' / '
export default function MultiTemplateInner(props: IMultiTemplateProps) {
    const { btn_text = '导入', onChange, style, MultiTemplate_type, modal_props = {}, disabled, form, fds = [], ...others } = props

    const active = useRef<IMultiTemplate_item>()
    function run_one(action: '覆' | '插') {
        if (!form) {
            mchcEnv.warning('form 不存在')
            return
        }
        const isOk = action === '插' || confirm('确定覆？')
        if (!isOk) return

        const keys = fds.map((conf) => { return SMchc_FormDescriptions.get_form_item_name_raw(conf) as string })
        const templates_data: AnyObject = active.current ?? {}

        fuck_the_form(action, form, templates_data, keys)
        window.mchc_modal?.pop()
    }

    const el = useRef<HTMLDivElement>(null)
    return <div ref={el} style={{ display: 'inline-block', position: 'relative', width: '100%' }}>

        <Button
            disabled={disabled}
            onClick={() => {
                window.mchc_modal?.open('box', {
                    width: '90vw',
                    title: '模板',
                    getContainer: () => el.current!,
                    // okText: '导入',
                    footer: <Space>
                        <OkButton btn_text='覆盖' primary onClick={() => run_one('覆')} />
                        <OkButton btn_text='插入' primary onClick={() => run_one('插')} />
                    </Space>,

                    ...modal_props,
                    modal_data: {
                        content: <MultiTemplateTemplateGroup on_select={item => { active.current = item }} {...props} />
                    },
                    onClose(status: Boolean) {
                        if (!status) return
                        const old_data = form?.getFieldsValue() ?? {}
                        const templates_data: AnyObject = active.current ?? {}
                        const new_data = fds.reduce((result, conf) => {
                            const key = SMchc_FormDescriptions.get_form_item_name_raw(conf) as string
                            const old_value = get(old_data, key)
                            const new_value = get(result, key)
                            if (!new_value) {
                                delete result[key]
                                return result
                            }
                            const mixed = old_value ? `${old_value} ${SPLIT_KEY} ${new_value}` : new_value

                            return set(result, key, mixed)

                        }, templates_data)

                        mchcLogger.log('导入', { status, old_data, templates_data, new_data })

                        form?.setFieldsValue(new_data)
                    }
                })
            }}
            style={{}}
            {...others}
        >{btn_text}</Button>
    </div>
}

