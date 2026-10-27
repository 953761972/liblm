import { mchcEvent } from "@lm_fe/env";
import { config_table_fd, is_dyn_page, mchcModal__, MyBaseList } from '@lm_fe/pages';
import { Button, Space } from "antd";
import React, { useEffect } from "react";
import { useHistory } from 'react-router-dom';
import MyConfigTable from './list';
import MyConfigPanel from './panel';

// { title: '检测方法：1. PRP 2.TRUST 3.USR 4.VDRL 5其他,请注明:', inputType: 'title', hidden: true, inputProps: { bold: false } },
export default (props) => {
    const history = useHistory()
    useEffect(() => {
        // const _message = message
        const rm = mchcEvent.on_rm('my_form', (event) => {

            console.log('globalEvent', event)
            if (event.type === 'onChange') {

                const { name, value } = event
                if (name === 'age') {
                    // setValue('name', '1年龄增加到' + value)
                }
            }
            if (event.type === 'onClick') {

                if (event.btnName) {
                    // setValue('age', age + 1)

                }
            }
        })

        return rm
    }, [])
    return <div>

        <MyBaseList
            action_col_width={320}
            size="small"
            showExport
            showPrint
            searchParams={{
            }}
            initialSearchValue={{
                // apiPrefix: '/api'
            }}
            renderBtns={() => {
                return <div>请不要再设置接口前缀!!如果打开空白，请设置对应的菜单权限</div>
            }}
            searchConfig={[
                { inputType: 'MA', label: '名称', name: 'title', inputProps: { options: '动态表格,动态表单' } },
                { inputType: 'MyInput', label: '接口路径', name: 'name', },
                { inputType: 'MyInput', label: '模块', name: 'type', },
                // { inputType: 'MyInput', label: '接口前缀', name: 'apiPrefix', },
            ]}
            baseTitle='梅毒感染孕产妇登记卡'
            // name="/syphilis-quality-control"
            name="/tableConfig"
            tableColumns={[...config_table_fd(props), {
                title: '预览',
                isActive: 0,
                dataIndex: 'id',
                render(value, record) {
                    return <Space>
                        <a target="blank" onClick={() => mchcModal__.open('test', { modal_data: { content: <MyConfigPanel configId={value} id={1} /> }, width: '90vw', title: record.title })}>
                            表单
                        </a>
                        <a target="blank" onClick={() => mchcModal__.open('test', { modal_data: { content: <MyConfigTable configId={value} /> }, width: '90vw', title: record.title })}>
                            表格
                        </a>
                    </Space>
                }
            }]}

            modalFormConfig={
                {
                    width: "96vw",
                    bodyStyle: { height: '80vh', overflowY: 'auto' },
                    modal_data: {
                        modalFormSize: 'small'
                    }
                }
            }
            requestBeforeEdit

            // apiPrefix="/as"
            ActionAddonBefore={({ rowData, createOrUpdate }) => {
                const { id, title, ...newData } = rowData
                const [is_dyn, dyn_title] = is_dyn_page(rowData as any)

                return <Space.Compact>
                    <Button size="small" onClick={() => {
                        createOrUpdate({ ...newData, title: `${title}-复制` })
                    }}>复制</Button>
                    <Button size="small" onClick={() => {
                        createOrUpdate({ ...newData, title: is_dyn ? `${title}-复制` : `动态表格-${title}-复制` })
                    }}>复制为动态表格</Button>
                </Space.Compact>
            }}
        />
        <div style={{ margin: 12 }}></div>
    </div>
}