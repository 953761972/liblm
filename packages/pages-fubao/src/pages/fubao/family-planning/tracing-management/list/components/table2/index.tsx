import { formatRangeDate, fubaoRequest as request } from '@lm_fe/utils'
import { Form, message, Space } from 'antd'
import { get } from 'lodash'
import React, { useState, useEffect } from 'react'

import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env'
import { BF_Wrap2, IdNOButton, MyBaseList, useReadIdNO } from '@lm_fe/pages'
import { ModelService } from '@lm_fe/service'
import { load_form_config } from './form_config/Form'
import styles from './index.module.less'

const s = new ModelService({
    n: 'EarlyPregnancyCheckPacTrackingFileToday',
    prePath: '/family/planning',
    //  apiPrefix: `/fb/api`,
    fuckPage: true,
})

export default function PAC_tracing_management_finished(props: any) {
    // const [modal_form] = Form.useForm()
    const [search_form] = Form.useForm()
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: '今日已随访-列表',
            tableColumns: load_form_config,
            searchConfig: [],
        },
    })
    const [finishedData, setFinishedData] = useState({})

    useEffect(() => {
        getFinishedData()
        mchcEvent.on_rm('my_form', (e) => {
            if (e.type !== 'onClick') return
            const idNO = e.values?.idNO
            if (!idNO) return mchcEnv.warning('请输入证件号码')
            request
                .get<{ uploadMsg: string }>('/api/two/cancer/screening/reportVerification', {
                    params: { 'idNO.equals': idNO },
                    unboxing: true,
                })
                .then(({ data }) => {
                    mchcEnv.info(data.uploadMsg)
                })
        })
    }, [])

    const getFinishedData = async () => {
        const data = await request.get(
            `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileTodayAlready?deleteFlag.equals=0`,
        )
        setFinishedData(get(data, 'data.data', {}))
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }} className={styles['tracing-management-container']}>
            <div className={styles['tracing-management-container-header']}>
                <ul className={styles['tracing-management-container-header-ul']}>
                    <li>
                      <div>随访情况-正常</div>
                      <div className={styles['number']}>{finishedData.normal || 0} 人</div>
                    </li>
                    <li>
                      <div>随访情况-未接听</div>
                      <div className={styles['number']}>{finishedData.notAnswer || 0} 人</div>
                    </li>
                    <li>
                      <div>随访情况-号码错误</div>
                      <div className={styles['number']}>{finishedData.wrongNumber || 0} 人</div>
                    </li>
                    <li>
                      <div>随访情况-失访</div>
                      <div className={styles['number']}>{finishedData.loseTrack || 0} 人</div>
                    </li>
                </ul>
            </div>
            <Wrap>
                <MyBaseList
                    searchForm={search_form}
                    modalFormConfig={{
                        modal_data: {
                            // form: modal_form,
                            onValuesChange(changedValues, values, form) {},
                        },
                    }}
                    customModelService={s}
                    // tableColumns={tableColumns}
                    tableColumns={config?.tableColumns}
                    // get_fuck_page={async (config) => {

                    //   return (await request.get('/api/two/cancer/screening/getTwoCancerScreeningFile/page', { ...config, unboxing: true })).data
                    // }}
                    baseTitle="今日待随访"
                    showAdd={false}
                    // needChecked
                    ActionAddonBefore={({ handleSearch, rowData }) => {
                        return <Space></Space>
                    }}
                    beforeSearch={(v) => {
                        const { filingDay, ...others } = v
                        const rangeData = formatRangeDate({ filingDay })
                        const res = {
                            ...rangeData,
                            ...others,
                        }
                        return res
                    }}
                    searchConfig={config?.searchConfig}
                    searchParams={{ 'followUpSituation.equals': 1 }}
                />
            </Wrap>
        </div>
    )
}
