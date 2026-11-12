import { MyIcon, OkButton } from "@lm_fe/components_m";
import React, { FC, useEffect } from "react";
import { create_menu } from './utils';
export const NewListPage: FC = (props) => {


    useEffect(() => {

    }, [])
    return <OkButton
        btn_text="新增列表页"
        size='small'
        type='primary'
        onClick={() => {
            create_menu(n => `/happy/config-table/list2/${n}`)
        }}

        icon={<MyIcon value='SettingOutlined' />} />



}