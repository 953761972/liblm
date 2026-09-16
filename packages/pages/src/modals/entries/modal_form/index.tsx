import { validate_form, handle_form_error, IGlobalModalProps } from '@lm_fe/components';
import { Form, FormInstance, Modal } from 'antd';
import { FieldData } from 'rc-field-form/lib/interface';
import { useEffect, useRef, useState } from 'react';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';
import { mchcDriver, mchcEnv, mchcEvent, mchcLogger } from '@lm_fe/env';
import { FormSection } from '@lm_fe/components_m';
import { noop, safe_async_call, sleep } from '@lm_fe/utils';
import { IMchc_FormDescriptions_Field, IMchc_TableConfig } from '@lm_fe/service';
import { BF_Wrap2, IBF_Default } from '../../../components';
import { ErrorBoundarySmall } from '../../../components/exception/ErrorBoundarySmall';
interface __props<T extends string = any> {
  bf_title?: `${string}-${string}`
  bf_conf?: IBF_Default,
  title?: string
  formDescriptions?: { [x in T]: any } | IMchc_FormDescriptions_Field[]
  onFieldsChange?(changedFields: FieldData[], allFields: FieldData[], form: FormInstance): void
  onValuesChange?(changedValues: { [x in T]: any }, values: { [x in T]: any }, form: FormInstance): void;
  onSubmit?(new_data: any, old_data: any): Promise<any>
  getInitialData?(): Promise<any>
  form?: FormInstance
  targetLabelCol?: number
  defaultFormItemLayout?: string
  modalFormSize?: SizeType
  disableAll?: boolean
}
export type IModalFormProps<T extends string = any> = IGlobalModalProps<__props<T>>


export default function MyModalForm<T extends string>({ modal_data, onOk, bodyStyle = {}, width, ...others }: IModalFormProps<T>) {
  const { title = "", bf_title, bf_conf, formDescriptions = [], targetLabelCol = 4, defaultFormItemLayout, onFieldsChange, onValuesChange, onSubmit, getInitialData, disableAll, modalFormSize = 'middle' } = modal_data
  const [_form] = Form.useForm()
  const form = modal_data.form ?? _form
  const [data, setData] = useState<any>({})
  const { Wrap, config } = BF_Wrap2({ default_conf: bf_conf ?? { title: bf_title!, tableColumns: formDescriptions, handleBeforePopup: (values) => (values ?? {}) } })
  const inited = useRef(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (inited.current) return noop

    if (!bf_title && !bf_conf) {
      base_int().then(finish_init);
      return noop
    }


    if (config) {
      mchcLogger.log('modal_form config', { config })

      if (config.handleBeforePopup) {
        base_int()
          .then(config.handleBeforePopup)
          .then(finish_init);


      } else {
        base_int().then(finish_init);

      }

    }

    return noop
  }, [bf_title, bf_conf, config])

  async function base_int() {
    return safe_async_call(() => getInitialData?.())
      .then(v => {
        let init_data = v ?? {}

        return init_data
      })
  }
  async function finish_init(base = {}) {
    inited.current = true


    setData(base)
    await sleep(400)
    mchcLogger.log('modal_form init', { base, form, xx: form.getFieldsValue() })

    form.setFieldsValue(base);


  }
  useEffect(() => {
    return mchcDriver.on_rm('data', e => {
      if (e.type === 'ReadCard') {
        let res = e.data
        form.setFieldsValue({ idNO: res.idNO, name: res.name })
      }

    })
  }, [])
  function renderEditContent() {
    if (bf_title || bf_conf)
      return <Wrap>
        <FormSection formDescriptions={config?.tableColumns} disableAll={disableAll} defaultFormItemLayout={defaultFormItemLayout} targetLabelCol={targetLabelCol} form={form} />;
      </Wrap>
    return <FormSection formDescriptions={formDescriptions as any[]} disableAll={disableAll} defaultFormItemLayout={defaultFormItemLayout} targetLabelCol={targetLabelCol} form={form} />;
  }
  return (
    <Modal

      title={data?.id ? `编辑${title}` : `新增${title}`}
      okButtonProps={{ loading }}
      centered
      destroyOnHidden
      width={width ?? "60vw"}
      styles={{
        body: { height: '70vh', overflowY: 'auto', overflowX: 'hidden', ...bodyStyle }
      }}

      onOk={async (e) => {
        const formData = await validate_form(form)

        if (!formData) return
        setLoading(true)
        safe_async_call(config?.beforeSubmit ?? onSubmit!, { ...data, ...formData }, data)
          .then(a => {

            if (!a) return
            onOk?.(e)
          })
          .finally(() => setLoading(false))


      }}
      {...others}

    >
      <ErrorBoundarySmall>

        <Form
          size={modalFormSize}
          onFieldsChange={(a, b) => {
            onFieldsChange?.(a, b, form)
          }}
          onValuesChange={(changedValues, b) => {
            const k = Object.keys(changedValues)[0]
            const v = changedValues[k]
            onValuesChange?.(changedValues, b, form)
            mchcEvent.emit('my_form', {
              type: 'onChange', name: k, value: v, values: b, form, setValue(name, value) {
                form.setFieldsValue({ [name]: value })
              },
            })
          }}

          autoComplete="off"
          form={form}
        // style={{ minHeight: 433 }}
        >
          {renderEditContent()}
        </Form>
      </ErrorBoundarySmall>

    </Modal>
  );

};