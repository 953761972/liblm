import { isArray, safe_json_parse, safe_json_parse_arr } from "@lm_fe/utils";
import { useEffect, useState } from "react";


export function use_arr_marshal<T = any>(marshal?: 0 | 1, _value?: any, _onChange?: (v: any) => void, ...args: any) {
    const [safe_value, set_safe_value] = useState<T[]>([])
    useEffect(() => {
        const d = marshal ? safe_json_parse_arr(_value, []) : _value
        const arr = isArray(d) ? d : []
        set_safe_value([...arr])

    }, [_value, marshal])

    function onChangeSafeValue(_v: any) {
        const v = marshal ? JSON.stringify(_v) : _v

        _onChange?.(v)
    }
    return { safe_value, set_safe_value, onChangeSafeValue }
}