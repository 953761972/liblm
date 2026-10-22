import { IMchc_FormDescriptions_Field } from "@lm_fe/service"
import { isFunction, safe_json_parse } from "@lm_fe/utils"
import { FormInstance } from "antd"
import { InputStatus } from "antd/es/_util/statusUtils"
import React, { useEffect, useState } from "react"
import { use_chrono } from "src/FU_components/FormSection/use_chrono"

export function InterceptComponent(props: { [x: string]: any, config: IMchc_FormDescriptions_Field, C: any, form?: FormInstance, disabled?: boolean, formName?: any, value?: any, onChange?: (...v: any[]) => void }) {
    const { config = {}, formName, form, C, ...others } = props
    const { chrono, value, onChange, Wrap } = use_chrono(props)
    const { inputProps, processLocal, processRemote, specialConfig, special_config } = config
    const _inputProps: any = inputProps ?? {}
    const __value = value ?? _inputProps.value
    const _value = processRemote?.(__value, form, config) ?? __value
    const formDescriptionSpecialConfig = safe_json_parse(specialConfig,) ?? safe_json_parse(special_config, {})

    const _onChange = (...arg: any[]) => {
        if (isFunction(processLocal)) {
            arg[0] = processLocal(arg[0], form, config) ?? arg[0]
        }
        onChange?.(...arg) ?? _inputProps.onChange?.(...arg)
    }
    const [status, set_status] = useState<InputStatus>('')
    useEffect(() => {
        const s = config.checkWarn?.(_value, form)
        if (s) {
            if (s === true) {
                set_status('error')
            } else {
                set_status(s)
            }

        } else {
            set_status('')
        }
        return () => {

        }
    }, [__value])


    return <Wrap>
        {
            C ? <C
                {...formDescriptionSpecialConfig}
                {...others}
                {...inputProps}
                disabled={inputProps?.disabled ?? others.disabled}
                status={_inputProps?.status ?? status}
                value={_value}
                onChange={_onChange}
                formName={formName}
                name={config.name}
                config={config}
                form={form}
            /> : <></>
        }
    </Wrap>
}

export function InterceptDisplayFC(props: { config: IMchc_FormDescriptions_Field, C: any, value?: any, }) {
    const { config = {}, value, C, ...others } = props
    const { inputProps, processRemote } = config
    const _value = processRemote?.(value) ?? value

    return C.DisplayFC ? <C.DisplayFC  {...inputProps} value={_value} /> : null
}