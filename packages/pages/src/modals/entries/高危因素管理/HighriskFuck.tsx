import {
    IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_HighriskGradeConfig,
    IMchc_TemplateTree_Item,
    SMchc_TemplateTrees
} from '@lm_fe/service'
import { get, isEmpty, } from '@lm_fe/utils'
import { Col, Empty, Row } from 'antd'
import { DataNode } from 'antd/lib/tree'
import { keyBy, map, split } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'

import { MySelect, Tree_L } from '@lm_fe/components'
import { use_provoke } from '@lm_fe/provoke'
import { ColorSpan, transfer_to_treeNode } from './utils'
import { mchcLogger } from '@lm_fe/env'

const boundSymbol = ':'
interface IProps {
    initData?: Partial<IMchc_Doctor_OutpatientHeaderInfo>
    assign_initData(v?: Partial<IMchc_Doctor_OutpatientHeaderInfo>): void
}
const KEY = 'highriskScreening'
// const KEY = 'highRiskDiagnosis'
export function HighriskSign_高危筛查(props: IProps) {
    const { config } = use_provoke('config')

    const { initData, assign_initData } = props
    const highRiskTreeDataMapping = useRef<{ [x: string]: IMchc_TemplateTree_Item }>({})

    const [currentTreeData, set_currentTreeData] = useState<IMchc_TemplateTree_Item[]>([])

    const [expandedKeys, set_expandedKeys] = useState<string[]>([])
    const [selectTree, set_selectTree] = useState<IMchc_TemplateTree_Item[]>([])
    const multiple = true

    useEffect(() => {
        ; (async () => {

            if (initData) {
                const highriskTreeData = await SMchc_TemplateTrees.getTemplateTree({ type: 24 })
                // const highriskTreeData = await SMchc_Common.getHighriskTree()

                highRiskTreeDataMapping.current = keyBy(highriskTreeData, 'id')
                const data = get(initData, KEY)

                const highriskNote_ = data?.split?.(',')?.filter((_) => _) ?? []

                let _selectTree: IMchc_TemplateTree_Item[] = []
                highriskNote_.map((item) => {
                    map(highRiskTreeDataMapping.current, (v, i) => {
                        const addNote = getTargetNote(v)
                        if (item == addNote) {
                            _selectTree.push(v)
                        }
                    })
                })
                set_selectTree(_selectTree)
                set_expandedKeys(Object.keys(highRiskTreeDataMapping.current))
                set_currentTreeData(highriskTreeData)
            }
        })()

        return () => { }
    }, [initData])

    function handle_select_change(_value: string) {

        const tag_arr = split(_value, ',')

        const tree_items: IMchc_TemplateTree_Item[] = []
        map(tag_arr, (str) => {
            map(highRiskTreeDataMapping.current, (v, i) => {
                const addNote = getTargetNote(v)
                if (str == addNote) {
                    tree_items.push(v)
                }
            })
        })
        mchcLogger.log('handle_select_change', tree_items, tag_arr)
        calAndSetData(tree_items, tag_arr)
    }

    function handle_tree_select(ids: string[], e: any) {
        const aa = get(initData, KEY)
        const custom_tags = aa
            ?.split(',')
            .filter((_) => !_.includes(':')) ?? []
        let tree_items: IMchc_TemplateTree_Item[] = []

        ids.forEach((k) => {
            const _item = highRiskTreeDataMapping.current[k]

            add_item_to_arr(_item, tree_items)
        })

        const tag_to_add = tree_items.map((_item) => {
            const addNote = getTargetNote(_item)
            return addNote
        })

        calAndSetData(tree_items, [...tag_to_add, ...custom_tags])
    }

    function add_item_to_arr(_item: IMchc_TemplateTree_Item, mute_arr: IMchc_TemplateTree_Item[]) {
        const isIn = mute_arr.find((_) => _.id === _item?.id)
        if (isIn) return
        const pid = _item?.pid
        if (!pid) return

        //------
        const ind = mute_arr.findIndex((_) => _.pid == _item?.pid)
        const isBrotherIn = ind != -1

        if (isBrotherIn && !multiple) {
            mute_arr.splice(ind, 1, _item)
        } else {
            mute_arr.push(_item)
        }
    }
    function calAndSetData(tree_items: IMchc_TemplateTree_Item[], tag_arr: string[]) {
        assign_initData({ [KEY]: tag_arr.join(',') })
        set_selectTree([...tree_items])
    }

    function handleExpend(expandedKeys: any) {
        set_expandedKeys(expandedKeys)
    }

    function renderTree({ treeData, expandedKeys }: { treeData?: DataNode[]; expandedKeys: string[] }) {
        return (
            <Tree_L
                multiple
                showLine={{ showLeafIcon: false }}
                treeData={treeData}
                onSelect={handle_tree_select}
                onExpand={handleExpend}
                expandedKeys={expandedKeys}
                selectedKeys={selectTree.map((_) => _.id.toString())}
                titleRender={(treeNode) => {
                    return (
                        <div>
                            {treeNode.children?.length == 0 ? <ColorSpan bg_color={get(treeNode, 'wb')} /> : null}
                            {get(treeNode as any, `title`)}
                        </div>
                    )
                }}
            />
        )
    }

    function renderhiskTree() {
        const treeData__ = transfer_to_treeNode(currentTreeData)
        if (isEmpty(currentTreeData)) return <Empty />
        return renderTree({ treeData: treeData__, expandedKeys })
    }
    function getTargetNote(v: IMchc_TemplateTree_Item) {
        const p = get(highRiskTreeDataMapping.current, v.pid?.toString())
        const addNote = `${p?.val}${boundSymbol}${v?.val}`
        if (!v?.wb) return addNote
        return `${addNote}${boundSymbol}${v?.wb}`
    }

    return (
        <div className={styles['highrisk-sign']}>
            <div className={styles['highrisk-sign-header']}>
                <Row gutter={8}>
                    <Col span={2}>高危筛查:</Col>
                    <Col span={21}>
                        <MySelect
                            mode="tags"
                            style={{ width: '100%' }}
                            marshal={0}
                            className={styles['highrisk-factor']}
                            onChange={handle_select_change}
                            value={get(initData, KEY, '')}
                        ></MySelect>
                    </Col>
                </Row>
            </div>
            {/* style={{ overflow: 'hidden' }} */}
            <div className={styles['highrisk-sign-content']}>{renderhiskTree()}</div>
        </div>
    )
}

// console.dir("mapStateToProps",mapStateToProps);
