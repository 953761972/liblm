import { IMchc_FormDescriptions_Field, IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from "@lm_fe/service"
import { AnyObject, flat, get, ICommonOption, isObject, isString, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils"


export function format_dataIndex(record?: AnyObject) {
    const _dataIndex = record?.dataIndex ?? record?.name ?? record?.key
    if (isString(_dataIndex) && _dataIndex.includes('.')) {
        return _dataIndex.split('.')
    }
    return _dataIndex
}

export function tranform_query_data(search_values?: AnyObject, searchConfig: IMchc_FormDescriptions_Field_Nullable[] = [], isFuck = false) {
    const newValues = search_values ? { ...search_values } : {}
    const straws = flat(searchConfig.filter(_ => _?.inputType === 'straw')?.map(_ => _?.children ?? [])).map(_ => ({ ..._, straw_children: true }))
    const kvArr = [...searchConfig, ...straws]
        .filter(_ => _)
        .map(conf => {
            // const k = _?.name!
            const k = SMchc_FormDescriptions.format_itemName_str(conf)
            const v = get(newValues, k)
            return [k, v, conf] as const
        })
    return kvArr.reduce((sum, [k, v, conf]) => {

        if (isFuck) return { ...sum, [k]: v }
        const res = (conf && !get(conf, 'straw_children')) ? calcKeyByType(k, v, conf) : { [k]: v }
        return { ...sum, ...res }
    }, {} as AnyObject)

}
function calcKeyByType(k: string, v: any, config: IMchc_FormDescriptions_Field) {

    const filter_type = config.filterType
    if (filter_type === null) return { [k]: v }

    const input_type = config.inputType! ?? 'input'
    const filter_type_arr = filter_type?.split?.(',') ?? []

    const type = config.inputProps?.type || config.inputProps?.mode
    const is_multiple = type === 'multiple' || type === 'tags'

    const f1 = filter_type_arr[0]
    const f2 = filter_type_arr[1]

    if (['input', 'Input', 'MyInput', 'address', 'MyAddress', 'MA'].includes(input_type)) {
        return { [`${k}.${f1 || 'contains'}`]: v }
    }
    if (['input_number', 'InputNumber', 'DatePicker', 'MSW', 'MySwitch', 'switch'].includes(input_type)) {
        return { [`${k}.${f1 || 'equals'}`]: v }
    }
    if (['select', 'Select', 'MySelect', 'MS'].includes(input_type)) {
        const obj = safe_json_parse(v, v)
        if (Array.isArray(obj)) {



            const arr = obj.map(_ => isObject(_) ? (_ as ICommonOption).value : _)

            const _v = arr.length > 1 ? arr.join(',') : arr[0]

            const has_comma = isString(_v) && _v.includes(',')

            const _df = (is_multiple || has_comma) ? 'in' : 'equals'

            return { [`${k}.${f1 || _df}`]: _v }

        } else {
            const has_comma = isString(v) && v.includes(',')

            const _df = (is_multiple || has_comma) ? 'in' : 'equals'
            return { [`${k}.${f1 || _df}`]: v }

        }
    }
    if (['RangePicker', 'rangeDate', 'MyRangeDate', 'rangeDateTime', 'MyRangeDateTime', 'ArrayInput'].includes(input_type)) {
        const value = safe_json_parse_arr(v)
        return {
            [`${k}.${f1 || 'greaterOrEqualThan'}`]: value[0],
            [`${k}.${f2 || 'lessOrEqualThan'}`]: value[1],

        }
    }

    return f1 ? { [`${k}.${f1}`]: v } : { [k]: v }
}
