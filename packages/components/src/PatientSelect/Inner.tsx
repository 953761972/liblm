import { mchcEvent, mchcLogger } from '@lm_fe/env';
import { TIdTypeCompatible } from '@lm_fe/service';
import { expect_array, flat, group, isArray, isEmpty, listify, mapValues, request } from '@lm_fe/utils';
import { AutoComplete_L } from '@noah-libjs/components';
import { AutoCompleteProps, Col, Divider, FormInstance, Row } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { debounce, get, map } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getInputStyle } from '@noah-libjs/components';

const mode_reg = /^.*(\[[0-9]\])$/
type KeyType = [DefaultOptionType, DefaultOptionType, DefaultOptionType, DefaultOptionType]
const default_url = '/api/pregnancies'
const default_keys: KeyType = [{ label: '门诊号', value: 'outpatientNO' }, { label: '姓名', value: 'name' }, { label: '末次月经', value: 'lmp' }, { label: '电话', value: __DEV__ ? 'id' : 'telephone' },]

interface IProps extends Omit<AutoCompleteProps, 'onChange'> {
  name?: string,
  PatientSelect_url?: string,
  PatientSelect_filterKey?: string
  PatientSelect_displayKey?: KeyType
  width?: any
  form?: FormInstance
  onPatientSelect?(v: any, form?: FormInstance): void

  onChange?(v: any): void
}
type TRawItem = { [x: string]: any, id: TIdTypeCompatible }
let is_err = false
export default function PatientSelect(props: IProps) {
  const {
    onChange, form, onPatientSelect, name = 'unKnown', width, value,
    PatientSelect_url = default_url,
    PatientSelect_filterKey = 'outpatientNO',
    PatientSelect_displayKey = default_keys,
    style,
    popupMatchSelectWidth,
    ...inputProps
  } = props;
  const url = useRef(is_err ? default_url : PatientSelect_url)
  const keys__ = useRef(is_err ? default_keys : PatientSelect_displayKey)
  const _style = getInputStyle(props)
  const init = useRef(false)
  const [raw_opts, set_raw_opts] = useState<TRawItem[]>([]);
  // const nice_key = keys__.current[0].value!
  const nice_key = PatientSelect_filterKey!
  const scrollPage = useRef(0)

  const key_len = keys__.current.length
  const pre_col = key_len <= 1 ? 24 : ~~(24 / (key_len))
  const last_col = key_len <= 1 ? 0 : (24 - pre_col * (key_len - 1))

  const [local_value, set_local_value] = useState(value);

  function safe_set_options(arr: any[]) {
    set_raw_opts(expect_array(arr))
  }
  function process_repeated(arr: any[]) {
    const x = group(arr, _ => get(_, nice_key)) // {aa:[{key:'aa'},{key:'aa'}]}
    const xx = mapValues(x, arr => arr!.map((_, idx) => ({ ..._, [nice_key]: _[nice_key] + `[${idx + 1}]` }))) // {aa: [{key:'aa[0]'}, {key: 'aa[1]'} ]}
    const xxx = flat(Object.values(xx)) // [{key:'aa[0]'}, {key: 'aa[1]']
    return xxx
  }
  useEffect(() => {
    if (!init.current && value) {
      init.current = true
      handleSearch(value);
    }
    console.log('set_local_value', value)
    set_local_value(value)

  }, [value]);
  const handleSearch = async (text?: string) => {
    let result: any[] = []
    try {
      result = (
        await request.get<any[]>(`${url.current}`, {
          params: {
            size: 10,
            page: 0,
            [`${PatientSelect_filterKey}.contains`]: text,
            // [`${PatientSelect_filterKey}`]: value,
          },
        })
      ).data
    } catch (e) {
      if (is_err)
        return []
      is_err = true
      url.current = default_url
      keys__.current = default_keys
      return handleSearch(text)
    }
    const res = isArray(result) ? result : get(result, 'data')
    safe_set_options(res);
    scrollPage.current = 0
    return res
  };

  const scrollSearch = async (value?: string, page: number = 0) => {
    const result = await request.get<any[]>(`${url.current}`, {
      params: {
        [`${PatientSelect_filterKey}.contains`]: value,
        size: 10,
        page,
      },
    });
    safe_set_options([...raw_opts, ...result.data]);
  };

  const debounce_serach = useMemo(() =>
    debounce(async (text?: string) => {
      return handleSearch(text)

    }, 400), []
  )

  const onPopupScroll = (e: any) => {
    e.persist();
    const target = e.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const nextScrollPage = scrollPage.current + 1;
      scrollPage.current = nextScrollPage
      scrollSearch(local_value, nextScrollPage);
    }
  };
  return (
    <AutoComplete_L
      popupRender={menu => {
        return <>
          <Row style={{ padding: 6 }}>
            {
              keys__.current.map((k, idx) => {
                const key = k.label as string
                return <Col key={key} span={idx === (key_len - 1) ? last_col : pre_col} >{key}</Col>
              })
            }

          </Row>
          <Divider style={{ margin: '4px 0' }} />
          {menu}


        </>
      }}
      onClick={() => {
        // 点击触发
        if (isEmpty(raw_opts) && isEmpty(local_value)) {
          handleSearch()
        }
      }}
      {...inputProps}
      allowClear
      style={_style}
      value={local_value}
      popupMatchSelectWidth={popupMatchSelectWidth || key_len * 150}
      options={
        process_repeated(raw_opts || [])
          .map(_ => {
            const label = get(_, nice_key)
            const opts = { label, value: label, key: _?.id, option_data: _ }
            return opts
          })}
      onChange={(value: string | undefined, option) => {
        let v = get_raw_value(value)
        onChange?.(v);
        set_local_value(v)
        debounce_serach(v)
      }}
      onSelect={(text: string, opt) => {
        mchcLogger.log('PatientSelect onSelect', { text, opt })
        const { option_data } = opt
        let v = get_raw_value(text)


        const raw_item = raw_opts.find(r => r.id === get(option_data, 'id'))
        if (raw_item && v) {

          mchcEvent.emit('my_form', {
            name,
            type: 'onSearch',
            value: { text: v, data: raw_item }
          })
          onPatientSelect?.(raw_item, form)

        }
      }}
      optionRender={({ data }) => {
        const { option_data } = data
        const { id } = option_data
        return (
          <Row key={id}>
            {
              keys__.current.map((k, idx) => {

                const value = get(option_data, k.value!)
                return <Col key={k.label + id} span={idx === (key_len - 1) ? last_col : pre_col}>{value}</Col>
              })
            }

          </Row>
        )
      }}

      onPopupScroll={onPopupScroll}
    >

    </AutoComplete_L>
  );
}


function get_raw_value(mixed_value?: string) {
  let v = mixed_value ?? ''
  const match_result = v.match(mode_reg)
  if (match_result) {
    return v.replace(match_result[1], '')
  }
  return mixed_value
}