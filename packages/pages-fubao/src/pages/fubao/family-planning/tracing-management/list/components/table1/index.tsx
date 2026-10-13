import { fubaoHistoryPush, OkButton } from '@lm_fe/components_m'
import { formatRangeDate, fubaoRequest as request, safe_async_call } from '@lm_fe/utils'
import { Form, message, Space } from 'antd'
import { get } from 'lodash'
import React, { useState, useEffect } from 'react'

import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env'
import { BF_Wrap2, IdNOButton, MyBaseList, mchcModal__ } from '@lm_fe/pages'
import { ModelService } from '@lm_fe/service'
import { load_form_config } from './form_config/Form'
import ModalForm from './components/ModalForm'

const s = new ModelService({
    n: 'EarlyPregnancyCheckPacTrackingFileToday',
    prePath: '/family/planning',
    //  apiPrefix: `/fb/api`,
    fuckPage: true,
})

export default function PAC_tracing_management_waiting(props: any) {
    // const [modal_form] = Form.useForm()
    const [search_form] = Form.useForm()
    const { config, Wrap } = BF_Wrap2(
        {
            default_conf: {
                title: '今日待随访-列表',
                tableColumns: load_form_config,
                searchConfig: [],
            },
        },
        {
            handleShowModal: showView,
            handleShowModal2: showView2,
        },
    )

    useEffect(() => {
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

    async function showView(record: any, handleSearch: () => void) {
        mchcModal__.open('modal_form', {
            width: 1360,
            title: 'PAC追踪-随访',
            modal_data: {
                bf_title: 'PAC追踪-随访',
                formDescriptions: [], // form_config,
                getInitialData() {
                    return record.data
                },
                async onSubmit(data) {
                    let fn = data.id ? request.put : request.post
                    await fn('opt_url', data, { successText: '操作成功', ignore_usr: true })

                    safe_async_call(handleSearch)
                },
            },
        })
    }

    async function showView2(record: any, handleSearch: () => void) {
        mchcModal__.open('test', {
            title: 'PAC追踪-随访 TEST',
            width: 1360,
            modal_data: {
                content: (
                    <ModalForm
                        visible={true}
                        id={record?.id}
                        currentRecord={record}
                        onSearch={handleSearch}
                    />
                ),

            },
            onClose: () => {}, // 关闭弹窗 callback
        })
    }

    return (
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
                tableColumns={config?.tableColumns}
                // get_fuck_page={async (config) => {
                //     return (
                //         await request.get('/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday', {
                //             ...config,
                //             'followUpSituation.equals': 0,
                //         })
                //     ).data
                // }}
                baseTitle="今日待随访"
                showAdd={false}
                showAction={false}
                handleDoubleClickRow={() => {}}
                // needChecked
                // ActionAddonBefore={({ handleSearch, rowData }) => {
                //     return (
                //         <Space>
                //             <OkButton size="small" onClick={() => showView(rowData, handleSearch)}>
                //                 随访
                //             </OkButton>
                //         </Space>
                //     )
                // }}
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
                searchParams={{ 'followUpSituation.equals': 0 }}
            />
        </Wrap>
    )
}
