import React, { FC, useState } from 'react';
import { Button, FormInstance, message } from 'antd';
import { event } from '@lm_fe/utils'
import { isArray, isObject, set } from 'lodash';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from '@lm_fe/service';
import { get_check_invert_values } from '@lm_fe/components';
const CheckAndCancelButton: FC<any> = function CheckAndCancelButton(props: { [x: string]: any, form?: FormInstance, check_invert_values?: { [x: string]: [any, any] }, config?: IMchc_FormDescriptions_Field_Nullable }) {
  const {
    name,
    type = 'primary',
    check_invert_values,
    form,
    size = 'middle',
    value = true,
    onChange,
    onClick,
    config,
    ...input_props
  } = props
  const [isCheck, setIsCheck] = useState(value);

  const handleClick = () => {
    setIsCheck(!isCheck);
    const k = SMchc_FormDescriptions.format_itemName_str(config!)
    if (k) {
      onChange?.(isCheck)
    }


    onClick?.(name, isCheck);
    event.emit(CheckAndCancelButton.displayName!, `${name}`, isCheck)
    // mchcLogger.log('CheckAndCancelButton 111', { check_invert_values, form, isCheck })
    if (!form) {
      message.warning('请设置 form !')
      return
    }
    const s = config?.siblings
    if (!s) return
    const checkValues = isObject(check_invert_values)
      ? check_invert_values
      : get_check_invert_values(s)
    if (checkValues) {
      const keys = Object.keys(checkValues)
      const old = form.getFieldsValue()

      keys.forEach((k, idx) => {
        const v = checkValues[k]
        const checkValue = isCheck ? v?.[0] : v?.[1]
        set(old, k, checkValue)
      })
      // mchcLogger.log('CheckAndCancelButton 222', { check_invert_values, old })
      form.setFieldsValue(old)
    }

  };

  return (
    <Button type={isCheck ? 'primary' : undefined} size={size} onClick={handleClick} {...input_props} >
      {isCheck ? '一键勾选' : '一键取消'}
    </Button>
  );
}
CheckAndCancelButton.displayName = 'CheckAndCancelButton'
export default CheckAndCancelButton