import { MyBaseList } from '@lm_fe/pages'
import React from 'react'
import { baseTableConfig, useTableConfig } from './config/useTableConfig'
import './index.less'
function newList(props: any) {
    const [config] = useTableConfig(props)
    return <MyBaseList {...config} />
}
export default newList
