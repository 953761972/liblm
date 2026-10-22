import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { uuid } from '@lm_fe/utils';
import { Button, ButtonProps, Divider, FormInstance } from 'antd';
import React, { useEffect, useRef } from 'react';
// import FormSection, { IFormSectionProps } from '../../BaseModalForm/FormSection';
// import { RenderEditItemStandalone, formatFormConfig } from '../../BaseModalForm/utils';
import { MyIcon } from '@lm_fe/components';
import { use_arr_marshal } from '../../utils/useMarshal';
import { MyFormSection } from '../FormSection';
import { IFormSectionProps } from '../FormSection/types';
import { formatFormConfig, RenderEditItemStandalone } from '../FormSection/utils';
import { TCommonComponent } from '../types';
interface IProps extends IFormSectionProps {
    tip?: string
    addBtnStyle?: ButtonProps
    marshal?: 0 | 1
    rowKey?: string

    actionConfig?: IMchc_FormDescriptions_Field
    genRowData?: (list: any[]) => any
    on_row_value_change(data: any[], index: number, changed?: any, form?: FormInstance): void

}
const ArrayPanel: TCommonComponent<IProps, string | any[]> = (props) => {
    const {
        tip,
        disabled,
        actionConfig = {},
        fds: formDescriptions = [],
        targetLabelCol = 4,
        span = 6,
        value,
        form,
        onChange,
        marshal = 1,
        addBtnStyle = {},
        on_row_value_change,
        rowKey = '_key',
        genRowData,
        ...others
    } = props

    const defaultValue = useRef<any[]>([])

    const { safe_value = [], set_safe_value, onChangeSafeValue } = use_arr_marshal<any>(marshal, value ?? defaultValue.current, onChange, 'ArrayPanel')
    useEffect(() => {


    }, [])
    function genDefaultData() {
        const userData = genRowData?.(safe_value) ?? {}

        return { ...userData, [rowKey]: uuid() }
    }
    function onDel(idx: number) {
        safe_value.splice(idx, 1)
        onChangeSafeValue?.([...safe_value])
    }
    function getKey(item: any) {
        return item?.id ?? item?.[rowKey]
    }
    function onChangeValue(idx: number, _key: any, _value: any) {
        const old = safe_value[idx]
        safe_value.splice(idx, 1, { ...old, [_key]: _value })
        const new_data = [...safe_value]
        onChangeSafeValue?.(new_data)
        on_row_value_change?.(new_data, idx, { [_key]: _value }, form)
    }
    return <div>
        {/* <Button disabled={disabled} onClick={() => onChangeSafeValue?.([...safe_value, genDefaultData()])}>新增</Button>
         */}

        {
            safe_value.map((rowData, idx) => {
                return <div key={getKey(rowData)}>
                    {
                        tip
                            ? <Divider style={{ margin: '4px 0', fontSize: 12, color: '#ccc' }} > {tip}{idx + 1}</Divider>
                            : null
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>


                        <div style={{ flex: 1 }}>
                            <MyFormSection disableAll={disabled} key={getKey(rowData)}
                                renderEditItemInner={RenderEditItemStandalone}
                                targetLabelCol={targetLabelCol} span={span} {...others} fds={[
                                    ...formDescriptions.map(_fd => {
                                        if (!_fd) return _fd!
                                        const fd = formatFormConfig(_fd, targetLabelCol)
                                        const _key = fd.key
                                        const _inputProps = fd?.inputProps
                                        return {
                                            ...fd, inputProps: {
                                                ..._inputProps,
                                                placeholder: '',
                                                value: rowData[_key!],
                                                onChange(_value: any) {
                                                    onChangeValue(idx, _key, _value)
                                                }
                                            }
                                        }
                                    })
                                ]}
                            />
                        </div>
                        <div style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <MyIcon value='MinusCircleOutlined' style={{ color: 'red' }} rev={''} onClick={() => onDel(idx)} />
                        </div>

                    </div>

                </div>
            })
        }
        <Button disabled={disabled} style={{ marginTop: 6 }} type="dashed" block icon={<MyIcon value='PlusOutlined' rev={''} />} {...addBtnStyle} onClick={() => onChangeSafeValue([...safe_value, genDefaultData()])} >
            新增{tip}
        </Button>

    </div>
}
export default ArrayPanel