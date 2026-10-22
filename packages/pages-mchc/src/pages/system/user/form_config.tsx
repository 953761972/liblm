import { MySwitch } from "@lm_fe/components";
import { APP_CONFIG, rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
import { AnyObject } from "@lm_fe/utils";
const ctx = rt_ctx
const React = ctx.React


export default defineFormConfig(
    [
        {
            title: '序号',
            dataIndex: 'index',
            width: 40,
            align: 'center',
            render: (text, record, index) => index + 1,
            isActive: 0
        },
        {
            title: '类型',
            dataIndex: 'userType',
            inputType: 'MS',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            inputProps: { options: '临时用户,永久用户', marshal: 0 },
            layout: '1/2',
        },
        {
            title: '账号',
            dataIndex: 'login',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            layout: '1/2',
        },
        {
            title: '过期',
            dataIndex: 'overdueDate',
            inputType: 'DatePicker',
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            layout: '1/2',
        },
        {
            title: '姓名',
            dataIndex: 'firstName',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            layout: '1/2',
        },
        {
            title: '电子签名',
            dataIndex: 'signBase64',
            inputType: 'SignImageUpload',
            layout: '1/1',
            width: APP_CONFIG.CELL_WIDTH_SMALL * 2,
            render: (value: string) => {
                if (!value) return ''
                const src = value.startsWith('data:') ? value : `data:image/png;base64,${value}`
                return <img src={src} alt="电子签名" style={{ height: 32, maxWidth: 120, objectFit: 'contain' }} />
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createdDate',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
            isActive: 0,
        },
        {
            title: '创建者',
            dataIndex: 'createdBy',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            isActive: 0,

        },
        {
            title: '最近修改时间',
            dataIndex: 'lastModifiedDate',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
            isActive: 0,

        },
        {
            title: '最近修改者',
            dataIndex: 'lastModifiedBy',
            ellipsis: true,
            width: APP_CONFIG.CELL_WIDTH_SMALL,
            isActive: 0,

        },
        {
            title: '活跃状态',
            dataIndex: 'activated',
            inputType: 'MSW',
            layout: '1/2',
            render(value, rowData, index) {

                return <ctx.ui.Switch size="small" onChange={v => {
                    rowData.activated = v
                    ctx.request.put('/api/users', rowData).then(() => ctx.props.table_helper.handleSearch())
                }} value={value} />
            },
        },
        {
            title: '密码',
            dataIndex: 'password',
            inputType: 'input',
            layout: '1/2',
            disabledDeps: { id(v) { return !!v } },

            render(value, rowData, index) {

                return <ctx.ui.Button size="small" onClick={() => {
                    ctx.modal().
                        open('modal_form', {
                            width: '40vw',
                            styles: { body: { height: '40vh', } },
                            modal_data: {

                                onSubmit(new_data: any, old_data: any) {
                                    return ctx.request.post('/api/account/reset-password', new_data, { successText: '操作成功' })
                                },
                                getInitialData() {
                                    return Promise.resolve(ctx.utils.pick(rowData, ['id', 'password', 'login']))
                                },
                                formDescriptions: [
                                    {
                                        label: 'id',
                                        name: 'id',
                                        inputProps: { disabled: true },
                                        layout: '1/1',
                                    },
                                    {
                                        label: 'login',
                                        name: 'login',
                                        inputProps: { disabled: true },
                                        layout: '1/1',


                                    },
                                    {
                                        label: '密码',
                                        name: 'password',
                                        layout: '1/1',

                                    },


                                ]
                            }
                        })
                }}>重置</ctx.ui.Button>
            },
        },
        {
            title: '角色',
            dataIndex: 'groups',
            width: APP_CONFIG.CELL_WIDTH_MIDDLE,
            inputType: 'roles',
            layout: '1/1',

            render: (value, rowData: any) => {
                const { groups } = rowData;
                return ctx.ui.render_arr(value, false, 'nickname')
            },
        },
    ]
)
