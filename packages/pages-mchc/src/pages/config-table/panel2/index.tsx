import { BaseEditPanelFormFC, } from "@lm_fe/components_m"
import { get_global_happy_arg, getSearchParamsAll, getSearchParamsValue, request, safeExec } from "@lm_fe/utils"
import React, { useState } from "react"
// import { message } from "antd"
import { mchcEnv } from "@lm_fe/env"
import { BF_Wrap2, mchcModal__ } from "@lm_fe/pages"
import { defineFormConfig } from "@lm_fe/service"
import { Form } from "antd"
import { useEffect } from "react"
import { getConfigFullUrl, getM, ICommonProps } from "../utils"
function MyConfigPanel(props: ICommonProps) {

    const title: any = get_global_happy_arg('usr1') ?? props.configId
    if (!title) return <div>请配置title</div>
    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: `动态表单-${title}`,
            name: '/api/pregnancies',
            tableColumns: defineFormConfig([
                { label: '姓名', name: 'name', inputType: 'Input', layout: '1/3' },
                { label: '出生日期', name: 'dob', inputType: 'MyDatePicker', layout: '1/3' },
                { label: '胎方位', name: 'fetalPosition', inputType: 'MC', inputProps: { options: '左枕前,左枕后,其他i' }, layout: '1/3' },
                { label: '国籍', name: 'nationality', inputType: 'MA', inputProps: { uniqueKey: '国家s', }, layout: '1/3' },
                { label: '证件类型', name: 'idType', inputType: 'MS', inputProps: { uniqueKey: '证件类型', marshal: 1 }, layout: '1/3' },
                { inputType: 'check_invert_button', layout: '1/3', hidden: true },
            ])
        }
    })

    const id = getSearchParamsValue('id') ?? props.id

    const [form] = Form.useForm()

    const model = getM(config)
    const [data, setData] = useState<ICommonProps>()

    function sync() {
        model?.sync(getSearchParamsAll()).then(processData)
    }
    async function processData(data: any = {}) {
        let _data = data
        if (config?.handleBeforePopup) {
            _data = await config.handleBeforePopup(data)
        }

        setData(_data)
        form.setFieldsValue(_data)
    }
    useEffect(() => {
        const params = getSearchParamsAll()
        if (id) {
            model?.getOne(id, { params }).then(processData)
        } else if (config?.name) {
            request.get(config?.name, { params }).then(r => processData(r.data))
        }

        return () => {

        }
    }, [config])
    return <Wrap>
        <div style={{ height: '100%', overflowY: 'auto', padding: 12, paddingBottom: 64 }}>
            <BaseEditPanelFormFC form={form} data={data} formDescriptions={config?.tableColumns}
                onPrint={() => {
                    mchcModal__.open('print_modal', {
                        modal_data: {
                            requestData: { url: `${getConfigFullUrl(config)}/print` }
                        }
                    })
                }}
                onSync={config?.needSync ? sync : undefined}
                onFinish={async v => {
                    const _data = { ...data, ...v }
                    const value = safeExec(config?.beforeSubmit, _data) ?? _data
                    model?.postOrPut(value)?.then(() => mchcEnv.success('操作成功'))
                }} />

        </div>
    </Wrap>
}
export default MyConfigPanel