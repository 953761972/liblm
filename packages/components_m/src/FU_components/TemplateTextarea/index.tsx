import { ITemplateConfig, MODAL_TEMPLATE_TYPES } from '@lm_fe/env';
import { Button, Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import React, { useEffect, useRef, useState } from 'react';
interface ITemplateTextareaProps extends TextAreaProps {
    value?: string
    onChange?(v: any): void
    type?: typeof MODAL_TEMPLATE_TYPES['科室个人']
    style?: React.CSSProperties
    rows?: number
    canOperate?: boolean
    defaultExpandAll?: boolean
    TemplateTextarea_type?: ITemplateConfig[]
}
const SPLIT_KEY = ' / '
export function TemplateTextarea(props: ITemplateTextareaProps) {
    const { value = '', onChange, style, type, TemplateTextarea_type, rows = 3, disabled, defaultExpandAll, canOperate, ...others } = props
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
                window.mchc_modal?.open('template_modal3', {
                    getContainer: () => el.current!,

                    modal_data: {
                        canOperate,
                        defaultExpandAll,
                        simpleTypes: TemplateTextarea_type ?? type,
                        on_tpl_check({ content }) {
                            onChange?.(`${_value ?? ''}${_value ? SPLIT_KEY : ''}${content}`)
                        },
                    }
                })
            }}
            size='small' style={{ position: 'absolute', bottom: 1, right: 1, zIndex: 2, borderRadius: 0, borderRight: 0, borderBottom: 0 }} >模</Button>
    </div>
}

