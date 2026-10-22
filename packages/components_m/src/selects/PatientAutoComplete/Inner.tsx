import { AutoComplete_L } from '@lm_fe/components'
import { mchcEvent } from '@lm_fe/env'
import { request } from '@lm_fe/utils'
import { AutoCompleteProps, Col, FormInstance, Row } from 'antd'
import { debounce, get, map } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getInputStyle } from '@lm_fe/components'

interface IProps extends Omit<AutoCompleteProps, 'onChange'> {
    name?: string
    PatientAutoComplete_url?: string
    PatientAutoComplete_filterKey?: string
    PatientAutoComplete_displayKey?: [string, string, string]
    width?: any
    form?: FormInstance
    onPatientAutoComplete?(v: any, form?: FormInstance): void

    onChange?(v: any): void
}
export default function PatientAutoComplete(props: IProps) {
    const {
        onChange,
        form,
        onPatientAutoComplete,
        name = 'unKnown',
        width,
        value,
        PatientAutoComplete_url = '/api/pregnancies',
        PatientAutoComplete_filterKey = 'outpatientNO',
        PatientAutoComplete_displayKey = ['outpatientNO', 'name', 'telephone'],
        style,
        ...inputProps
    } = props

    const _style = getInputStyle(props)
    const init = useRef(false)
    const [options, setOptions] = useState<any[]>([])
    const [scrollPage, setScrollPage] = useState(0)
    const [data, setData] = useState(value)
    const k0 = PatientAutoComplete_displayKey[0]
    const k1 = PatientAutoComplete_displayKey[1]
    const k2 = PatientAutoComplete_displayKey[2]

    useEffect(() => {
        if (!init.current && value) {
            init.current = true
            handleSearch(value)
        }
    }, [value])

    const handleSearch = async (value?: string) => {
        const result = await request.get<any[]>(`${PatientAutoComplete_url}`, {
            params: {
                size: 10,
                page: 0,
                [`${PatientAutoComplete_filterKey}.contains`]: value,
            },
        })
        const res = result.data ?? []
        setOptions(res)
        return res
    }

    const scrollSearch = async (value?: string, page: number = 0) => {
        const result = await request.get<any[]>(`${PatientAutoComplete_url}`, {
            params: {
                [`${PatientAutoComplete_filterKey}.contains`]: value,
                size: 10,
                page,
            },
        })
        setOptions([...options, ...result.data])
    }

    const handleChange = useMemo(
        () =>
            debounce(async (changed: string) => {
                const arr = await handleSearch(changed)

                if (changed) {
                    const item = arr.find((_) => get(_, k0) === changed)
                    if (item) {
                        mchcEvent.emit('my_form', {
                            name,
                            type: 'onSearch',
                            value: { text: changed, data: item },
                        })
                        // onPatientAutoComplete?.(item, form)
                    }
                }
            }, 400),
        [],
    )

    const handlePopupScroll = (e: any) => {
        e.persist()
        const target = e.target
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            const nextScrollPage = scrollPage + 1
            setScrollPage(nextScrollPage)
            scrollSearch(data, nextScrollPage)
        }
    }

    return (
        <AutoComplete_L
            // bordered={false}
            allowClear
            style={_style}
            {...inputProps}
            value={value}
            popupMatchSelectWidth={get(inputProps, 'popupMatchSelectWidth') || 350}
            onChange={(value) => {
                setData(value)
                onChange?.(value)
                handleChange(value)
            }}
            // onSearch={handleSearch}
            onPopupScroll={handlePopupScroll}
        >
            {options.length > 0 &&
                map(options, (option) => {
                    const _value = get(option, k0)
                    const _name = get(option, k1)
                    const _telephone = get(option, k2)
                    return (
                        <AutoComplete_L.Option key={`${option.id}`} value={_value}>
                            <Row
                                onClick={(e) => {
                                    e?.preventDefault()
                                    onPatientAutoComplete?.(option, form)
                                }}
                            >
                                <Col span={6}>{_name}</Col>
                                <Col span={9} offset={1}>
                                    {_value}
                                </Col>
                                <Col span={7} offset={1}>
                                    {_telephone}
                                </Col>
                            </Row>
                        </AutoComplete_L.Option>
                    )
                })}
        </AutoComplete_L>
    )
}
