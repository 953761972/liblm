import { IGlobalModalProps } from '@lm_fe/components'
import { mchcEnv, mchcLogger } from '@lm_fe/env'
import { use_provoke } from '@lm_fe/provoke'
import {
    IMchc_Doctor_OutpatientHeaderInfo,
    SMchc_Doctor,
    TIdTypeCompatible
} from '@lm_fe/service'
import { get, request, ROMAN_NUMERALS, set } from '@lm_fe/utils'
import { message, Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { 高危时间轴 } from '../高危时间轴/HighriskTimeline'
import { HighriskSign_高危筛查 } from './HighriskFuck'
import { HighriskSign_高危因素管理 } from './HighriskSign'
import styles from './index.module.less'
const boundSymbol = ':'
interface IProps {
    data?: IMchc_Doctor_OutpatientHeaderInfo
    pregnancyId: TIdTypeCompatible
    // 如果存在 onFinish 调用 onFinish，否则调用 handleSubmit
    onFinish?(v: IMchc_Doctor_OutpatientHeaderInfo): void
    handleSubmit?(): void

}
export default function HighriskFactor(props: IGlobalModalProps<IProps>) {
    const { modal_data, close, ...others } = props
    const { data, onFinish, handleSubmit, pregnancyId, } = modal_data

    const { 可选高危等级, 可选传染病, config } = use_provoke('可选高危等级', '可选传染病', 'config')

    const [activeTabKey, set_activeTabKey] = useState('1')

    const [initData, set_initData] = useState<Partial<IMchc_Doctor_OutpatientHeaderInfo>>({})

    function assign_initData(part: Partial<IMchc_Doctor_OutpatientHeaderInfo> = {}) {
        set_initData(Object.assign({}, initData, part))
    }
    useEffect(() => {
        if (data) {
            let _data = data
            const level_value = get(data, 'highriskLable')
            const fallback_value = get(data, 'hishRiskLable') || get(data, 'highriskGrade')
            if (!level_value && fallback_value) {
                _data = set(_data, 'highriskLable', fallback_value)
            }
            assign_initData(_data)
        } else {
            SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId).then(assign_initData)
        }

        return () => { }
    }, [])

    async function onOk() {

        if (!initData?.infectionNote) {
            return message.info('请选择传染病!')
        }

        if (initData.highriskLable && initData.highriskLable !== ROMAN_NUMERALS[1]) {
            if (!initData.highriskNote) {
                message.error('请填写高危因素!')
                return
            }
        }
        if (initData.highriskNote) {
            if (!initData.highriskLable) {
                message.error('请填写高危等级!')
                return
            }
        }
        mchcLogger.log('initData', { initData })
        if (onFinish) {
            // 新建孕册
            onFinish({
                ...initData as IMchc_Doctor_OutpatientHeaderInfo,
                highriskGrade: initData.highriskLable,
            })
        } else {
            await updateRiskRecords()
            handleSubmit?.()
        }
        close?.(true)
    }

    async function updateRiskRecords() {
        const postData = {
            outEmrId: get(initData, 'id'),
            // infectionNote: initData?.infectionNote,
            // tags: initData?.tags,
            // highriskNote: initData?.highriskNote,
            highriskGrade: initData?.highriskLable,
            // gestationalWeek: get(headerInfo, `gesweek`),
            ...initData
        }

        const res = await request.put('/api/doctor/assessHighRisk', postData)
        mchcEnv.success('信息保存成功!')
        // saveHeaderInfo({
        //   ...props.data,
        //   ...pick(post, ['infectionNote', 'highriskNote']),
        //   highriskLable: get(post, `highriskLable`),
        // });
        // saveHeaderInfo(ress);
    }

    function handleClose() {
        close?.()
    }

    function handleTabChange(key: string) {
        set_activeTabKey(key)
    }

    return (
        <Modal
            {...others}
            className={styles['highrisk-pop']}
            styles={{
                body: {
                    padding: 0,
                    maxHeight: 700,
                },
            }}
            width={'80vw'}
            onCancel={handleClose}
            onOk={onOk}
        >
            <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
                <Tabs.TabPane tab="高危标记" key="1">
                    <HighriskSign_高危因素管理
                        initData={initData}
                        assign_initData={assign_initData}
                        gradeOptions={可选高危等级}
                        contagionOptions={可选传染病?.options}
                    />
                </Tabs.TabPane>
                {
                    config.高危管理_隐藏高危筛查
                        ? null
                        : <Tabs.TabPane tab="高危筛查" key="3">
                            <HighriskSign_高危筛查
                                initData={initData}
                                assign_initData={assign_initData}
                            />
                        </Tabs.TabPane>
                }

                <Tabs.TabPane tab="高危时间轴" key="2">
                    <高危时间轴 id={pregnancyId ?? initData?.id} gradeOptions={可选高危等级} />
                </Tabs.TabPane>

            </Tabs>
        </Modal>
    )
}

// console.dir("mapStateToProps",mapStateToProps);
