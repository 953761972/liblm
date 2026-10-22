import { Common_Form_Config_Names, mchcEnv } from "@lm_fe/env"
import { safe_json_parse } from "@lm_fe/utils"
import { FormInstance } from "antd"
import { get, isArray, isNumber, isString } from "lodash"
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable_Arr, IMchc_FormDescriptions_MIX } from "@noah-libjs/components"



const fdCache: { [x: string]: { data?: IMchc_FormDescriptions<true>[], expire?: number } } = window._fdCache = {}



export function parseFormDescriptions(list: IMchc_FormDescriptions<true>[]) {
    const marshed = list.map(fd => {
        const fields = fd.fields ?? []
        return {
            ...fd, fields: fields.map(field => {
                if (!field) return {}
                let styles = safe_json_parse(field.styles, field.styles || {}) as any
                let inputProps = safe_json_parse(field.inputProps, field.inputProps || {}) as any
                let formItemLayout = safe_json_parse(field.formItemLayout, field.formItemLayout || {}) as any
                let specialConfig = safe_json_parse(field.specialConfig, field.specialConfig || {}) as any
                let tranferRules = safe_json_parse(field.tranferRules, field.tranferRules || {}) as any
                let rules = safe_json_parse(field.rules, field.rules || []) as any

                const key = field.key
                let name = key;
                let label = field.label
                if (key) {
                    if (key.startsWith('.')) {
                        name = key.substring(1);
                    }
                } else {
                    name = field.label
                    label = '';
                }

                // fucking 兼容
                return {
                    ...field,
                    name,
                    label,
                    hidden: !field.isActive,
                    input_type: field.inputType,
                    special_config: field.specialConfig,
                    tranfer_rules: field.tranferRules,
                    input_props: inputProps,
                    form_item_layout: field.formItemLayout,

                    inputProps,
                    formItemLayout,
                    rules,
                    styles,
                    specialConfig,
                    tranferRules
                }
            })
        } as IMchc_FormDescriptions
    })
    return marshed
}
export function getCache(name: string) {
    const cache = fdCache[name] ?? {}
    const expire = cache.expire || 0
    const isExpire = +new Date() > expire
    if (isExpire || mchcEnv.isDev) return
    return cache?.data
}
export function setCache(name: string, data: IMchc_FormDescriptions<true>[]) {
    const cache = fdCache[name] ?? {}
    cache.data = data
    cache.expire = +new Date() + 10 * 60 * 1000
    fdCache[name] = cache
}
export function defineFormConfig(config: IMchc_FormDescriptions_Field_Nullable_Arr, first_level_default?: Partial<IMchc_FormDescriptions_Field>) {
    if (first_level_default && Array.isArray(config)) {
        const filterData = config.filter(_ => _) as IMchc_FormDescriptions_Field[]

        config = filterData.map(_ => {
            if (!_.children && !_.fields) return _
            return {
                ..._,
                containerType: _.containerType ?? first_level_default.containerType,
                remote_filter_key: _.remote_filter_key ?? first_level_default.remote_filter_key,
            }
        })
    }
    return { __lazy_config: config }
}

export function set_preset_form_config(confs: { name: Common_Form_Config_Names, conf: IMchc_FormDescriptions_MIX, handler?: (changed: any, all: any, form: FormInstance) => void }[]) {

    mchcEnv.setEnvFormConfig(confs)
}




export function get_preset_form_config(name: Common_Form_Config_Names) {

    const old = mchcEnv.getEnvFormConfig(name)

    if (!old) return
    return old
}



export function get_lazy(config: any) {
    let d = (get(config, '__lazy_config') || get(config, 'default.__lazy_config')) as unknown as IMchc_FormDescriptions_Field_Nullable_Arr
    return d
}
//




export function format_itemName_arr_by_name(name?: number | string | string[]) {
    if (isArray(name)) return name as string[]
    if (isNumber(name)) return [name.toString()]

    if (!isString(name)) return []

    let __name = name?.includes('.') ? name.split('.') : name;

    return Array.isArray(__name) ? __name : [__name]
}
