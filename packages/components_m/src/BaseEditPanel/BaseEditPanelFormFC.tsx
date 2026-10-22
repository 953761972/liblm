import { mchcEvent } from '@lm_fe/env';
import { ButtonProps, Form, FormInstance, message, Space } from 'antd';
import classnames from 'classnames';
import { debounce, get, isFunction, map } from 'lodash';
import { useEffect, useState } from 'react';
// import FormSection from '../BaseModalForm/FormSection';
import { MyIcon, validate_form } from '@lm_fe/components';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_FormDescriptions, IMchc_FormDescriptions_MIX } from '@lm_fe/service';
import { AnyObject } from '@lm_fe/utils';
import React from 'react';
import { MyFormSection } from 'src/FU_components/FormSection';
import styles from './less/base-edit-panel-form.module.less';
import { OkButton } from 'src/FU_components';
export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const FormSection = MyFormSection
interface IProps {
  data?: any;
  formDescriptions_old?: IMchc_FormDescriptions[];
  formDescriptions?: IMchc_FormDescriptions_MIX;
  initialValues?: AnyObject;
  onFinish?: (data: any) => Promise<void>;
  loading?: boolean;
  form?: FormInstance
  targetLabelCol?: number
  getEvents?(): any
  onPrint?(): void
  print_btn_props?: ButtonProps
  onSync?(): void
  onImport?(): void
  onValuesChange?(changedValues: any, allValues: any): void;
  requiredKeys?: { [x: string]: boolean }
  renderBtns?(form: FormInstance): React.JSX.Element
  renderExtraBtns?(form: FormInstance): React.JSX.Element
}
export default function BaseEditPanelFormFC<T = any>(props: IProps) {
  const bg_color = use_provoke(s => s.sys_theme.bg_color)
  const { onFinish, print_btn_props, onValuesChange, data, formDescriptions, formDescriptions_old, onPrint, onSync, onImport, getEvents, targetLabelCol } = props;

  const [_form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const form = props.form ?? _form

  useEffect(() => {

    if (data) {
      form.setFieldsValue(data)
    }
  }, [data])



  const handleReset = () => {
    form.resetFields();
  };

  const handleFinish = async () => {
    setLoading(true)
    const values = await validate_form(form)
    if (values) {
      try {
        await onFinish?.(values);
        message.success('操作成功！')
      } catch (error) {

      }
    }
    setLoading(false)

  };





  const getRegistrationEvents = () => ({});


  const handleFieldsChange = (changedFields: any, allFields: any) => ({});

  const handleItemBlur = () => ({});

  const renderSection = (section: IMchc_FormDescriptions) => {
    return (
      <>
        {/* <Divider key={`${get(section, 'flag')}-divider`} orientation="left">
          {get(section, 'name')}
        </Divider> */}
        <span className={styles["base-edit-panel-form_section_title"]} key={`${get(section, 'flag')}-divider`}>
          {get(section, 'name')}
        </span>
        {(
          <FormSection
            key={`${get(section, 'flag')}-section`}
            data={data}
            requiredKeys={props.requiredKeys}
            formDescriptions={get(section, 'fields')!}
            form={form}
            events={isFunction(getEvents) && getEvents()}
            registrationEvents={isFunction(getRegistrationEvents) && getRegistrationEvents()}
          />
        )}
      </>
    );
  };

  const renderEditContent = () => {
    const oldNode = formDescriptions_old ? map(formDescriptions_old, (section, index) => {
      return (
        <div className={classnames(styles['base-edit-panel-form_section'], { [styles['border']]: !!section.name })} key={index}>
          {renderSection(section)}
        </div>
      );
    }) : null
    const node = formDescriptions ? <FormSection targetLabelCol={targetLabelCol} initialValues={props.initialValues} requiredKeys={props.requiredKeys} formDescriptions={formDescriptions} data={data} form={form} /> : null
    return oldNode ?? node
  };

  const renderResetBtn = () => {
    return (
      <OkButton size="large" htmlType="reset" icon={<MyIcon value='RedoOutlined' />} onClick={handleReset}>
        重置
      </OkButton>
    );
  };

  const renderSubmitBtn = () => {
    return (
      <OkButton
        size="large"
        type="primary"
        icon={<MyIcon value='SaveOutlined' />}
        loading={loading}
        onClick={debounce(handleFinish)}
      >
        保存
      </OkButton>
    );
  };

  const renderPrintBtn = () => {

    return (
      <OkButton
        {...print_btn_props}
        hidden={!onPrint}
        type="primary"
        size="large"
        icon={<MyIcon value='PrinterOutlined' />}
        onClick={onPrint}
      >
        打印
      </OkButton>
    );
  };

  const renderBtns = () => {
    if (props.renderBtns) {
      return props.renderBtns(form)
    }
    return (
      <>
        {props.renderExtraBtns && props.renderExtraBtns(form)}
        {renderResetBtn()}
        {
          onSync ? <OkButton
            hidden={!onSync}
            type="primary"
            size="large"
            icon={<MyIcon value='PrinterOutlined' />}
            onClick={onSync}
          >
            同步
          </OkButton> : null
        }

        {renderSubmitBtn()}
        {renderPrintBtn()}

      </>
    );
  };


  const renderFreeButton = () => {
    return <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 99, width: '100%' }}></div>;
  };



  // 导入按钮
  const renderImportBtn = () => {
    if (!onImport) return null
    return (
      <OkButton
        type="primary"
        htmlType="button"
        icon={<MyIcon value='SolutionOutlined' />}
        onClick={onImport}
      >
        导入信息
      </OkButton>
    );
  };



  const renderModal = () => {
    return <></>;
  };

  return (
    <Form
      autoComplete="off"
      form={form}
      initialValues={{}}
      onBlur={handleItemBlur}
      onValuesChange={(changedValues, values) => {
        onValuesChange?.(changedValues, values)
        mchcEvent.emit('my_form', {
          type: 'onChange',
          name: Object.keys(changedValues)[0],
          value: Object.values(changedValues)[0],
          values,
          setValue: (name, value) => {
            form.setFieldsValue({ [name]: value })
          },
        })
      }}
      onFieldsChange={handleFieldsChange}
      {...formItemLayout}
      style={{ padding: 6, paddingBottom: 64, height: '100%', overflowY: 'auto', overflowX: 'hidden', background: bg_color }}
    >
      {renderImportBtn()}
      {renderEditContent()}
      <div className={styles["right-bottom-btns"]}>
        <Space size="middle">

          {renderBtns()}

        </Space>
      </div>
      {renderFreeButton()}
      {renderModal()}
    </Form>
  );
}
