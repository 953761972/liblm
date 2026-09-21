
// import { message } from "antd"
import { BF_Wrap2, MyBaseList } from "@lm_fe/pages"
import { get_global_happy_arg } from "@lm_fe/utils"
import { ICommonProps } from "../utils"
import { defineFormConfig } from "@lm_fe/service"
import { rt_ctx, mchcLogger } from "@lm_fe/env"
const ctx = rt_ctx
const React = rt_ctx.React
function MyConfigTable2(props: ICommonProps) {

    const conf_title: string = decodeURI(get_global_happy_arg('usr1') ?? props.configId)
    if (!conf_title || conf_title === 'undefined') return <div>请配置title</div>
    return <MyBaseList

        {...props}
        size="small"
        // name="/syphilis-quality-control"
        modalFormConfig={{
            width: '80vw',
            modal_data: {
                targetLabelCol: 4
            }
        }}
        table_preset={
            {
                title: conf_title.includes('-') ? (conf_title as any) : `动态表格-${conf_title}`,
                name: '/api/users',
                showAction: 1,
                initialSearchValue: { nationality: '中' },
                searchParams: { args: 'abcd' },
                searchConfig: defineFormConfig([
                    { label: '姓名', name: 'name', inputType: 'Input' },
                    { label: '门诊号', name: 'outpatientNO', inputType: 'Input' },
                    { label: '日期', name: 'date', inputType: 'rangeDate' },
                    { label: '状态', name: 'status', inputType: 'MS', inputProps: { options: [{ value: 0, label: '无' }, { value: 1, label: '有' }] } },
                    {
                        "inputType": "straw",
                        "title": "年龄范围",
                        "children": [
                            {
                                "dataIndex": "ageLimit.type",
                                "inputType": "MS",
                                "inputProps": {
                                    "width": 100,
                                    "uniqueKey": "Task.appointRange"
                                }
                            },
                            {
                                "name": "ageLimit.gt",
                                "inputType": "InputNumber",
                                "inputProps": {
                                    "width": 90,
                                    "suffix": "岁"
                                },
                                "showDeps": {
                                    "ageLimit.type": [
                                        1
                                    ]
                                }
                            },
                            {
                                "showDeps": {
                                    "ageLimit.type": [
                                        1
                                    ]
                                },
                                "inputType": "node",
                                "inputProps": {
                                    "node": "~"
                                }
                            },
                            {
                                "name": "ageLimit.lt",
                                "inputType": "InputNumber",
                                "inputProps": {
                                    "width": 90,

                                    "suffix": "岁"
                                },
                                "showDeps": {
                                    "ageLimit.type": [
                                        1
                                    ]
                                }
                            },
                            {
                                "name": "ageLimit.value",
                                "inputType": "InputNumber",
                                inputProps: {
                                    "width": 90,

                                },
                                "showDeps": {
                                    "ageLimit.type": [
                                        2,
                                        3,
                                        4,
                                        5
                                    ]
                                }
                            }
                        ]
                    },
                ]),
                renderBtns: (actions) => {

                    return <>
                        {ctx.ui.render_btn('自定义按钮-上报', () => {
                            const ids = actions.getCheckRows().map(_ => _.id)
                            ctx.request.post('/api/dataReport/reportPregnancy', { ids }).then(() => actions.handleSearch())
                        })}
                        {ctx.ui.render_btn('自定义按钮-导出', () => {
                            ctx.request.get('/api/export/admissions', {
                                responseType: 'blob',
                                params: actions.getSearchParams(),
                            }).then(res => ctx.utils.downloadFile(res.data, '导出数据.xls', 'application/vnd.ms-excel'))

                        })}
                    </>
                },
                tableColumns: () => import('./form_config')
            }
        }
    />

}
export default MyConfigTable2