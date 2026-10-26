import { isObject } from '@lm_fe/utils';
import { Form, InputProps } from 'antd';
import React, { useEffect } from 'react';
import { MyFormSectionForm } from 'src/FU_components/FormSection/FormSectionForm';

export default function Appgar({ onChange, value }: InputProps) {
  const [my_form] = Form.useForm()
  const { Wrap, config } = window.BF_Wrap2({
    default_conf: {
      title: `组件-appgar`,
      tableColumns: () => import('./form_config'),
    }
  })
  useEffect(() => {
    if (isObject(value)) {
      my_form.setFieldsValue(value)
    }

    return () => {

    }
  }, [value])

  return (
    <Wrap>
      <MyFormSectionForm
        onValuesChange={(changed, values) => {
          setTimeout(() => {
            onChange?.(my_form.getFieldsValue())
          }, 400);
        }}
        form={my_form} bf_config={config} />
    </Wrap>
  );
}
