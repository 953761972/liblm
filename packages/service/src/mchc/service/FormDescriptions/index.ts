import { expect_array, request, safe_async_call } from "@lm_fe/utils"


import { isFunction, isObject, values } from "lodash"
import { IMchc_FormDescriptions, IMchc_FormDescriptions_Field_Nullable, IMchc_FormDescriptions_Field_Nullable_Arr, IMchc_FormDescriptions_MIX } from './types'
import { get_lazy, getCache, format_itemName_arr_by_name, parseFormDescriptions, setCache } from "./utils"
export * from "./types"
export * from "./utils"


interface IRemoteFilter {
    name: string,
    filter: string[]
}


export const SMchc_FormDescriptions = {

    async extract_form_config(config: IMchc_FormDescriptions_MIX) {

        let d = get_lazy(config)

        if (d) return d

        let f: IMchc_FormDescriptions_Field_Nullable_Arr = []

        if (Array.isArray(config)) {

            f = config

        }
        else if (isFunction(config)) {

            let r = await config()

            // compatible with default export
            r = (r as any).default ?? r

            const res = await Promise.resolve(
                isFunction(r) ? r() : r
            )

            const f = Array.isArray(res)
                ? res
                : get_lazy(res) ?? (res as unknown as IMchc_FormDescriptions_Field_Nullable_Arr) ?? []

            return f

        }
        else if (isObject(config)) {



            f = Object.values(config)

        }

        return f

    },
    async filter_form_config(config: IMchc_FormDescriptions_MIX) {

        let f = await this.extract_form_config(config)

        return this.__filter_form_config(f)

    },
    async __filter_form_config(config: IMchc_FormDescriptions_Field_Nullable_Arr) {

        if (config.every(_ => !_?.remote_filter_key)) return config

        let request_data = config.reduce((sum, _) => {
            if (!sum) return {}
            let remote_filter_key = _?.remote_filter_key
            if (!remote_filter_key) return sum
            const old = sum[remote_filter_key] = sum[remote_filter_key] ?? { name: remote_filter_key, filter: [] };
            const title = this.get_the_fucking_itemLabel(_, true)
            old.filter.push(title)
            return sum

        }, {} as { [x: string]: IRemoteFilter } | undefined)

        const data = await SMchc_FormDescriptions.remote_filter(values(request_data))
        const res = config.filter(_ => {
            if (!_) return false
            if (!_.children) {
                return true
            }
            const title = this.get_the_fucking_itemLabel(_, true)
            const remote_filter_key = _.remote_filter_key!
            const remote_config = data.find(d => d.name === remote_filter_key)
            if (!remote_config) return true
            return remote_config?.filter?.includes(title)

        })
        return res

    },



    set_form_item_name(item: IMchc_FormDescriptions_Field_Nullable, name?: number | string | string[]) {
        if (!item) return

        const arr = format_itemName_arr_by_name(name)
        const str = arr.join('.')
        item.name = str
        item.key = str
        return str
    },
    format_form_item_name_and_label(item: IMchc_FormDescriptions_Field_Nullable) {
        if (!item) return null
        const arr = this.format_itemName_arr(item).filter(_ => _)
        const str = arr.join('.')
        item.name = str
        item.key = str
        // item.dataIndex = str

        const title = this.get_the_fucking_itemLabel(item)
        item.label = title
        item.title = title
        return str

    },
    get_the_fucking_itemName(item: IMchc_FormDescriptions_Field_Nullable) {
        return item?.name || item?.key || item?.dataIndex
    },
    get_the_fucking_itemLabel(item: IMchc_FormDescriptions_Field_Nullable, Compatible = false) {
        return item?.label || item?.title || (Compatible ? this.format_itemName_str(item) : '')
    },
    format_itemName_str(item: IMchc_FormDescriptions_Field_Nullable, separator = '.') {
        const arr = this.format_itemName_arr(item).filter(_ => _)
        const str = arr.join(separator)
        return str
    },

    format_itemName_arr(item: IMchc_FormDescriptions_Field_Nullable) {
        const key = this.get_the_fucking_itemName(item)
        return format_itemName_arr_by_name(key)
    },




    async remote_filter(req_data: IRemoteFilter[],) {
        if (!req_data?.length) return []
        const has_cache = req_data.every(_ => remote_filter_cache[_.name])
        if (has_cache) {
            return req_data.map(_ => remote_filter_cache[_.name])
        }
        try {
            let res = await request.post<IRemoteFilter[]>('/api/form-filter', req_data, { timeout: 2000, showMsg: false, unboxing: true })
            const filtered = expect_array(res.data)
            // .map(f => ({ ...f, filter: f.filter.slice(0, 2) }))

            filtered.forEach(_ => {
                remote_filter_cache[_.name] = _
            })
            return filtered
        } catch (error) {

            return req_data
        }
    },
    async getModule(moduleName: string,) {
        const res = await request.get<IMchc_FormDescriptions<true>[]>('/api/form-descriptions', { params: { moduleName } })
        setCache(moduleName, res.data)
        return res.data
    },
    async getModuleCache(moduleName: string,) {
        return getCache(moduleName) ?? this.getModule(moduleName)
    },
    async getModuleParse(moduleName: string,) {
        const data = await this.getModule(moduleName)
        return parseFormDescriptions(data)
    },
    async getModuleParseCache(moduleName: string,) {
        const data = await this.getModuleCache(moduleName)
        return parseFormDescriptions(data)

    }
}

const remote_filter_cache: { [x: string]: IRemoteFilter } = {
}