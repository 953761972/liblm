import { MyIcon, OkButton } from "@lm_fe/components_m";
import { mchcConfig, mchcEnv } from "@lm_fe/env";
import { mchcModal__ } from "@lm_fe/pages";
import { use_provoke } from "@lm_fe/provoke";
import { request } from "@lm_fe/utils";
import { Space } from "antd";
import React, { FC, useEffect, useState } from "react";
import styles from './ReloadButton.module.less';
import { create_menu } from "./utils";
export const ReloadButton: FC = (props) => {

    const sys_theme = use_provoke(s => s.sys_theme)


    const [show, setShow] = useState<boolean>()
    const handleOpenModal = (url: string) => {
        mchcModal__.open('modal_page', {
            modal_data: {
                route_conf: { url }
            }
        });
    };
    useEffect(() => {

        setTimeout(() => {

            if (mchcConfig.get('顶部工具栏隐藏') || !mchcEnv.token) return

            setShow(true)
        }, 600);
        return () => {

        }
    }, [])
    if (!show) return null
    return <div className={styles['wrap']}    >
        <div className={styles['tools']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Space.Compact>
                {
                    (mchcEnv.isAdmin)
                        ? <OkButton
                            title="系统配置"
                            size='small'
                            type='primary'
                            onClick={() => handleOpenModal('/system-config')}

                            icon={<MyIcon value='SettingOutlined' />}>
                            系统配置
                        </OkButton>
                        : null
                }
                {
                    (mchcEnv.isAdmin)
                        ? <OkButton
                            btn_text="新增动态页"
                            size='small'
                            type='primary'
                            onClick={() => {
                                create_menu(n => `/happy/dyn-page/${n}`)
                            }}

                            icon={<MyIcon value='SettingOutlined' />} />
                        : null
                }
                {
                    (mchcEnv.isAdmin)
                        ? <OkButton
                            btn_text="新增列表页"
                            size='small'
                            type='primary'
                            onClick={() => {
                                create_menu(n => `/happy/config-table/list2/${n}`)
                            }}

                            icon={<MyIcon value='SettingOutlined' />} />
                        : null
                }
                {
                    (mchcEnv.isAdmin)
                        ? <OkButton
                            title="配置表格测试"
                            size='small'
                            type='primary'
                            onClick={() => handleOpenModal('/happy/config-table/list2/test')}

                            icon={<MyIcon value='SettingOutlined' />}>
                            配置表格测试
                        </OkButton>
                        : null
                }
                {
                    (mchcEnv.isAdmin)
                        ? <OkButton
                            title="配置练习"
                            size='small'
                            type='primary'
                            onClick={() => handleOpenModal('/test')}

                            icon={<MyIcon value='SettingOutlined' />}>
                            配置练习
                        </OkButton>
                        : null
                }
                <OkButton
                    title="刷新缓存"
                    onClick={() => {
                        request.get('/api/clearCache', { successText: '清除成功' })
                    }}
                    size='small'
                    type='primary'
                    icon={<MyIcon value='CoffeeOutlined' />}>
                    刷新缓存
                </OkButton>
                <OkButton
                    title="知识库"
                    onClick={() => handleOpenModal('/knowledge/list')}
                    size='small'
                    type='primary'
                    icon={<MyIcon value='QuestionOutlined' size={12} />}>
                    知识库
                </OkButton>
                <OkButton
                    title="孕册管理"
                    onClick={() => handleOpenModal('/prenatal-visit/pregnancy/list')}
                    size='small'
                    type='primary'
                    icon={<MyIcon value='GlobalOutlined' size={12} />}>
                    孕册管理
                </OkButton>
                <OkButton
                    title="重新进入"
                    onClick={() => mchcEnv.reload()}
                    size='small'
                    type='primary'
                    icon={<MyIcon value='ReloadOutlined' size={12} />}>
                    重新进入
                </OkButton>


            </Space.Compact>

        </div>

        <div className={styles['pull']} style={{}}>
            <span className={styles['pull-icon']} style={{ color: '#fff', background: sys_theme.colorPrimary }} >
                —
            </span>
        </div>
    </div>

}