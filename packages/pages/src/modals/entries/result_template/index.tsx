import { ArrayInput, IGlobalModalProps, Tree_L } from '@lm_fe/components';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
import { AnyObject, get, isArray, isObject, request } from '@lm_fe/utils';
import { Button, message, Modal, Space, Tabs } from 'antd';

import { forEach, isEmpty, isString } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less'
import { OkButton } from '@lm_fe/components_m';
import { FormInstance } from 'antd/lib';
import { IMchc_LabExamImportTree_Item } from '@lm_fe/service';
interface IProps {
    form?: FormInstance,
    gen_obj?: (form?: FormInstance) => AnyObject
    simpleTypes: { url: string, title: string, method?: 'get' | 'post' }[]
    on_tpl_check?: (e: { leaf: Partial<{ title: string }>[], result: Partial<{ title: string }>[], content: string }) => void

}

function make_key(item?: { title: string, id: number, raw_title?: string }) {
    if (!item) return ''
    if (item.raw_title)
        return `${item.id}@@${item.raw_title}`
    return `${item.id}@@${item.title}`;
}
function get_title_form_key(key?: any) {
    if (!isString(key)) return ''
    const arr = key.split('@@')
    const title = arr[1]
    return title || key
}
export default function ResultImport(props: IGlobalModalProps<IProps>) {

    const { modal_data, onClose, close, ...others } = props
    const { simpleTypes = [], gen_obj, form, on_tpl_check } = modal_data;

    const el = useRef<(typeof Tree_L)['RCTree']>(null)

    const [activeTabKey, set_activeTabKey] = useState('')
    const [defaultExpandedKey, set_defaultExpandedKey] = useState('')
    const [check_keys, setCheck_keys] = useState<string[]>([])

    const abnormal_key = useRef<string[]>([])
    const key_map = useRef<AnyObject>({})

    const [arr, setArr] = useState<any[]>([])
    useEffect(() => {
        fetch_data(simpleTypes[0])


        return () => {

        }
    }, [])



    async function handleTabChange(key: string) {
        const target = simpleTypes.find(_ => _.title === key)
        fetch_data(target)

    };
    async function fetch_data(target?: typeof simpleTypes[number]) {
        if (!target?.url) return
        abnormal_key.current = []
        setCheck_keys([])

        const method = target.method ?? 'get'
        const url = target.url

        const params = gen_obj?.(form) ?? {}
        let res = (await request.ins({ method, url, data: params, params: params })).data;


        set_activeTabKey(target.title)
        set_defaultExpandedKey(make_key(res?.[0]))
        const format_data = transferTemplateData(res, abnormal_key.current, key_map.current,)
        setArr(format_data)

    };

    function handleOk(e?: React.MouseEvent<HTMLElement>) {
        const ins = el.current
        if (ins) {
            const state = ins.state
            const keys = state.checkedKeys
            const checkedItems = keys.map(_ => key_map.current[_])

            const half_keys = state.halfCheckedKeys
            const half_keys_items = half_keys.map(_ => key_map.current[_])

            const all_keys = [...keys, ...half_keys]
            const all_keys_items = all_keys.map(_ => key_map.current[_])
            const parents = all_keys_items.filter(_ => _.pid === 0)
            const labels: string[] = []
            parents.forEach(p => {
                fuck_join_label(p, labels, all_keys)
            })

            let content = checkedItems
                .sort((a, b) => (a.pid === 0) ? -1 : 1) // 使祖先节点最前
                .map(_ => _.raw_title).join(' / ');
            if (!isEmpty(half_keys)) {

                const half_title = half_keys.map(get_title_form_key).reverse().join(' / ')
                mchcLogger.log('el half_title', half_title, half_keys, half_keys_items)
                content = `${half_title} / ${content}`
            }
            const leaf = checkedItems.filter(_ => _.isLeaf && !_.children?.length)

            on_tpl_check?.({ result: checkedItems, leaf, content: labels.join(' / ') })
        }

        close?.(true, e)
    };
    // checkedKeys, e:{checked: bool, checkedNodes, node, event, halfCheckedKeys}
    function handleCheck(keys: any, e) {
        setCheck_keys(keys)
        const { checkedNodes, halfCheckedKeys } = e
    };

    function transferTemplateData(data: any, abnormal: any[], map: AnyObject, pid = 0,) {
        const treeData: any = [];
        forEach(data, (item) => {
            if (item.pid === pid) {
                if (isObject(item.title)) {

                } else {
                    item.raw_title = item.title
                    item.title = item.unusual ? <span style={{ color: 'red' }}>{item.title} {item.unusualDesc}</span> : item.title

                }
                item.key = make_key(item);
                map[item.key] = item
                item.children = transferTemplateData(item.items, abnormal, map, item.id);
                if (isEmpty(item.children)) {
                    item.isLeaf = true;
                    if (item.unusual) {
                        abnormal.push(item.key)

                    }
                } else {
                    item.isLeaf = false;
                }
                treeData.push(item);
            }
        });
        return treeData;
    };


    return (
        <Modal
            {...others}
            centered={false}
            title="结果导入"
            width={1100}
            onOk={handleOk}
        >

            <Tabs defaultActiveKey={activeTabKey} onChange={handleTabChange}>
                {
                    simpleTypes.map(({ title, url }) => {
                        return <Tabs.TabPane tab={<Button className="list-btn">{title}</Button>} key={title}>
                            {!isEmpty(arr) && activeTabKey === title
                                ? <>
                                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        <Space.Compact >

                                            <OkButton primary onClick={() => {

                                                setCheck_keys(Array.from(new Set([...check_keys, ...abnormal_key.current])))
                                            }}>勾选异常</OkButton>
                                            <OkButton onClick={() => setCheck_keys([])}>全部取消</OkButton>
                                        </Space.Compact>
                                    </div>

                                    <Tree_L
                                        ref={el}
                                        checkable
                                        defaultExpandedKeys={[defaultExpandedKey]}
                                        onCheck={handleCheck}
                                        treeData={arr}
                                        checkedKeys={check_keys}
                                    />
                                </>
                                : '暂无结果~'
                            }
                        </Tabs.TabPane>
                    })
                }


            </Tabs>
        </Modal>
    );
}

function fuck_join_label(data: IMchc_LabExamImportTree_Item, last_result: string[], filter_keys: any[]) {
    if (!filter_keys.includes(get(data, 'key')))
        return

    last_result.push(get(data, 'raw_title'))
    if (isArray(data.items)) {
        data.items.forEach(d => {
            fuck_join_label(d, last_result, filter_keys)
        })
    }
    return last_result
}