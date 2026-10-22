import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { expect_array, isEmpty, isNil } from '@lm_fe/utils';
import { Button, Dropdown, Empty, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
// import FormSection, { IFormSectionProps } from '../../BaseModalForm/FormSection';
// import { RenderEditItemStandalone, formatFormConfig } from '../../BaseModalForm/utils';
import { MyIcon, MySelect } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { MyFormSection } from '../FormSection';
import { IFormSectionProps } from '../FormSection/types';
import { TCommonComponent } from '../types';

interface IProps extends Omit<IFormSectionProps, 'value'> {
    conf: ConfType[]


}
interface ConfType { fds: IMchc_FormDescriptions_Field[], label: string, key: string, default?: boolean }
const MixPanel: TCommonComponent<IProps, string[]> = (props) => {
    const {
        disabled,
        formDescriptions = [],
        targetLabelCol,
        span,
        value,
        form,
        onChange,
        conf = [{
            label: '测试11', key: 'aa',
            fds: [{ label: 'aa1', name: 'aa1', inputType: 'MA' }]
        },
        {
            label: '测试22', key: 'bb',
            fds: [
                { label: 'bb1', name: 'bb1', layout: '1/3', inputType: 'text_area' },
                { label: 'bb2', name: 'bb2', layout: '2/3', inputType: 'MA' },
            ]
        }] as ConfType[],
        ...others
    } = props

    const [_activeKey, set_activeKey] = useState('')

    const arr_value = expect_array(value)
    const safe_value = isNil(value) ? conf.filter(_ => _.default).map(_ => _.key) : arr_value

    useEffect(() => {
        mchcLogger.log('MixPanel value', value, _activeKey)
        if (!_activeKey) {
            if (arr_value.length) {
                set_activeKey(arr_value[0]?.toString())
            } else if (safe_value.length) {
                const k = safe_value[0]?.toString()
                set_activeKey(k)
                onChange?.(safe_value)

            }
        }

    }, [value, _activeKey, onChange])

    // const [tabs, setTabs] = useState<T[]>([genDefaultData(`${title}1`, '0')])



    function remove(k: string) {
        const idx = safe_value.findIndex(_ => _ === k)
        safe_value.splice(idx, 1)
        onChange?.([...safe_value])
        if (_activeKey === k) {
            set_activeKey(safe_value[0])
        }
    }
    function add(k: string) {
        onChange?.([...safe_value, k])
        set_activeKey(k)

    }

    function _onChange(k: string) {
        set_activeKey(k)
    };
    const filtered_conf = conf.filter(_ => safe_value.includes(_.key))
    const un_filtered_conf = conf.filter(_ => !safe_value.includes(_.key))
    return <div>
        <Tabs
            type='editable-card'
            onChange={_onChange}
            tabBarExtraContent={
                // <MySelect style={{ minWidth: 120 }} placeholder='请选择' options={conf} marshal={3} type='multiple' onChange={onChange} value={value} />
                isEmpty(un_filtered_conf)
                    ? null
                    : <Dropdown menu={{ items: un_filtered_conf.map(_ => ({ ..._, onClick: () => add(_.key) })) }}>
                        <Button icon={<MyIcon value='PlusOutlined' />} />
                    </Dropdown>
            }
            activeKey={_activeKey}
            onEdit={(k, act) => {
                mchcLogger.log('MixPanel act', k, act)

                if (act === 'remove') {
                    confirm(`确定删除${k}吗`) && remove(k as string)
                }
            }}
            hideAdd

        >
            {filtered_conf.map((conf_item, index) => {

                return <Tabs.TabPane tab={conf_item.label} key={conf_item.key} forceRender closable={true}>
                    <div style={{ position: 'relative' }}>
                        <MyFormSection disableAll={disabled} key={conf_item.key}
                            // renderEditItemInner={RenderEditItemStandalone}
                            targetLabelCol={targetLabelCol} span={span} {...others} formDescriptions={conf_item.fds}
                        />
                    </div>

                </Tabs.TabPane >
            }

            )}
        </Tabs >
        {
            filtered_conf.length ? null : <Empty />
        }



    </div >
}
export default MixPanel