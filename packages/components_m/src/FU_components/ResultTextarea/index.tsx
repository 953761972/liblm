import { ITemplateConfig, mchcLogger, MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { AnyObject, getSearchParamsValue } from '@lm_fe/utils';
import { Button, Input } from 'antd';
import { FormInstance } from 'antd/lib';
import { TextAreaProps } from 'antd/lib/input';
import React, { useEffect, useRef, useState } from 'react';
interface ITemplateTextareaProps extends Omit<TextAreaProps, 'form'> {
    value?: string
    onChange?(v: any): void
    gen_obj?: (form?: FormInstance) => AnyObject,
    style?: React.CSSProperties
    rows?: number
    form?: FormInstance,
    TemplateTextarea_type?: { title: string, url: string, method?: 'get' | 'postF' }[]
}
const SPLIT_KEY = ' / '
export function ResultTextarea(props: ITemplateTextareaProps) {
    const {
        value = '',
        onChange,
        style,
        TemplateTextarea_type = [{ title: '检验结果', url: '/api/getLabExamImportTree' }, { title: '超声结果', url: '/api/getImageExamImportTree' }],
        rows = 3,
        disabled,
        form,
        gen_obj = function () {
            return { pregnancyId: getSearchParamsValue('id') }
        },
        ...others } = props
    const [_value, set_value] = useState(value)
    useEffect(() => {
        set_value(value)
    }, [value])
    const el = useRef<HTMLDivElement>(null)
    return <div ref={el} style={{ display: 'inline-block', position: 'relative', width: '100%' }}>
        <Input.TextArea disabled={disabled} rows={rows} value={_value} onChange={e => {
            const v = e.target.value
            onChange?.(v)
            set_value(v)
        }} style={{ ...style, zIndex: 1 }} {...others} />
        <Button
            type="text"
            disabled={disabled}
            onClick={() => {
                window.mchc_modal.open('result_template', {
                    modal_data: {
                        gen_obj,
                        form,
                        on_tpl_check(result: any) {
                            mchcLogger.log('result', result)
                            const { content } = result
                            onChange?.(`${_value ?? ''}${_value ? SPLIT_KEY : ''}${content}`)
                        },
                        simpleTypes: TemplateTextarea_type
                        // simpleTypes: [{ title: 'aa', url: '/api/getLabExamImportTree' }, { title: 'bb', url: '/api/getImageExamImportTree' }]
                    }
                })
            }}
            size='small' style={{ position: 'absolute', bottom: 1, right: 1, zIndex: 2, borderRadius: 0, borderRight: 0, borderBottom: 0 }} >模</Button>
    </div>
}

