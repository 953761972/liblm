import { formatRangeDate, fubaoRequest as request, safe_async_call } from '@lm_fe/utils'
import { Form, message, Space, Button } from 'antd'
import { get } from 'lodash'
import React, { useEffect } from 'react'

import { mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env'
import { BF_Wrap2, MyBaseList, mchcModal__ } from '@lm_fe/pages';
import { ModelService } from '@lm_fe/service'
import { load_form_config } from './form_config/Form'

const s = new ModelService({
    n: 'EarlyPregnancyCheckPacTrackingFile',
    prePath: '/family/planning',
    //  apiPrefix: `/fb/api`,
    fuckPage: true,
})

export default function PAC_tracing_management_all(props: any) {
    // const [modal_form] = Form.useForm()
    const [search_form] = Form.useForm()
    const { config, Wrap } = BF_Wrap2(
        {
            default_conf: {
                title: '全部随访-列表',
                tableColumns: load_form_config,
                searchConfig: [
                    {
                        label: '随访类型',
                        name: 'followUpType',
                        inputType: 'MS',
                        inputProps: {
                            options: [
                                { label: '首次随访', value: '0' },
                                { label: '1个月随访', value: '1' },
                                { label: '3个月随访', value: '3' },
                                { label: '6个月随访', value: '6' },
                                { label: '12个月随访', value: '12' },
                                { label: '全部', value: '' },
                            ],
                        },
                    },
                    {
                        inputType: 'MS',
                        name: 'followUpState',
                        label: '随访状态',
                        props: {},
                        inputProps: {
                            options: [
                                { label: '已完成', value: '已完成' },
                                { label: '待随访', value: '待随访' },
                                { label: '未到', value: '未到' },
                                { label: '失访', value: '失访' },
                                { label: '全部', value: '' },
                            ],
                        },
                    },
                    { inputType: 'input', name: 'outpatientNo', label: '门诊号', props: {} },
                    { inputType: 'input', name: 'name', label: '姓名', props: {} },
                    { inputType: 'surgeryDate', name: 'checkDate', label: '手术日期', props: {} },
                ],
            },
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
            modal_data: {
                bf_title: '两癌筛查-随访',
                formDescriptions: form_config,
                getInitialData() {
                    return record.data
                },
                async onSubmit(data) {
                    let fn = data.id ? request.put : request.post
                    await fn(opt_url, data, { successText: '操作成功', ignore_usr: true })

                    safe_async_call(handleSearch)
                },
            },
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
                // tableColumns={tableColumns}
                tableColumns={config?.tableColumns}
                // get_fuck_page={async (config) => {

                //   return (await request.get('/api/two/cancer/screening/getTwoCancerScreeningFile/page', { ...config, unboxing: true })).data
                // }}
                baseTitle="全部随访"
                showAdd={false}
                showAction={false}
                // needChecked
                ActionAddonBefore={({ handleSearch, rowData }) => {
                    return <Space>
                      <Button onClick={() => showView(rowData, handleSearch)}>BTN</Button>
                    </Space>
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
                searchParams={{ 'followUpSituation.equals': 0 }}
            />
        </Wrap>
    )
}
