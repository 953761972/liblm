import { EMPTY_PLACEHOLDER, safe_json_parse_arr } from "@lm_fe/utils"
import React from "react"
import { use_arr_marshal } from "src/utils/useMarshal"
import { TCommonComponent } from "../types"
interface TakeOutVolumnProps {
    marshal?: boolean
    onBlur?: any
}

export const TakeOutVolumn_DisplayFC: TCommonComponent<TakeOutVolumnProps, any> = (props) => {
    const { value, onChange, marshal = false } = props
    const { safe_value } = use_arr_marshal<any>(marshal, value, onChange)
    const arr = safe_json_parse_arr(safe_value)
    return <span style={{ fontSize: 12, wordBreak: 'break-all' }}>
        {
            arr?.map?.((_, idx) =>
                <span>
                    {_.outcomingContent ?? EMPTY_PLACEHOLDER}
                    <span style={{ color: '#999' }}>
                        (
                        {_.outcomingColor ?? ''}
                        {_.outcomingML ?? EMPTY_PLACEHOLDER}ml
                        )
                    </span>
                    {idx === arr.length - 1 ? '' : '、'}
                </span>
            ) ?? arr
        }
    </span>
}