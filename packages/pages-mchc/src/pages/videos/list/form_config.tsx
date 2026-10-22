import { rt_ctx } from "@lm_fe/env";
import { defineFormConfig } from "@lm_fe/service";
const ctx = rt_ctx
const React = ctx.React


export default defineFormConfig(
    [
        {
            title: '视频标题',
            dataIndex: 'title',
            layout: '1',
            required: true,
        },
        {
            title: '视频描述',
            dataIndex: 'description',
            layout: '1',
            required: true,
        },
        {
            title: '视频文件',
            dataIndex: 'url',
            layout: '1',
            required: true,
            inputType: 'upload_file',

        },
        {
            title: '创建者',
            dataIndex: ['create_user', 'name'],
            form_hidden: true,
        },
        {
            title: '发布者',
            form_hidden: true,
            dataIndex: ['release_user', 'name'],
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            form_hidden: true,
        },
        {
            title: '发布时间',
            dataIndex: 'release_time',
            form_hidden: true,
        },
        {
            dataIndex: 'release',
            title: '发布',
            width: 50,
            form_hidden: true,

            render: (status: any, rowData: any) => {
                return (
                    <ctx.ui.Switch size="small" checked={status} onChange={() => {
                        ctx.request
                            .put('/api/videos', ctx.utils.set(rowData, 'release', !status))
                            .then(() => { ctx.props.table_helper.handleSearch() })
                    }} />

                );
            },
        },
        {
            title: '预览',
            dataIndex: 'url',
            form_hidden: true,
            render(value, rowData, index) {
                return <ctx.ui.Space>
                    {
                        ctx.ui.render_btn('二维码', () => {
                            ctx.modal().open('box', {
                                width: 240,
                                title: rowData.title,
                                modal_data: {
                                    content: <ctx.ui.QRCode value={value} />
                                },
                            })
                        }, { size: 'small', type: 'link' })
                    }
                    {
                        ctx.ui.render_btn('预览', () => {
                            // ctx.safeTo(value)
                            window.open(value)
                        }, { size: 'small', type: 'link' })
                    }
                </ctx.ui.Space>
            },
        },
    ]
)