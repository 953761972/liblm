import { FormInstance } from "antd"
import { IBaseType } from "./common"
import { AnyObject } from "@lm_fe/utils"


interface I_onChange extends IBaseType<'onChange'> {
    name: string
    value: any
    values?: AnyObject
    config?: any
    setValue?(name: string, value: any): void
    setValues?(obj: AnyObject): void
    setOptions?(obj: any[]): void
}


interface I_onSearch extends IBaseType<'onSearch'> {
    name: string
    value: { text: string, data?: any }
    values?: AnyObject
    setValue?(name: string, value: any): void
    setValues?(obj: AnyObject): void
}
interface I_onClick extends IBaseType<'onClick'> {
    btnName: string
    values?: any
    setValue?(name: string, value: any): void
    setValues?(obj: AnyObject): void

}
interface I_onBlur extends IBaseType<'onBlur'> {
    value?: any
    name?: string
}
interface I_onFocus extends IBaseType<'onFocus'> {
    value?: any
    name?: string
}
interface I_onLoad extends IBaseType<'onLoad'> {
    formName?: string
}
interface I_onTabChange extends IBaseType<'onTabChange'> {
    activeKey: string
    oldKey: string
}

interface I_item extends IBaseType<'item'> {
    name: string
    action?: 'set_options'
    data: any
}

export type IMyForm_Event = [I_item | I_onChange | I_onSearch | I_onClick | I_onTabChange | I_onBlur | I_onFocus |
    I_onLoad
]