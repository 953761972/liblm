import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import TemplateSelect from './components/TemplateSelect';
import { MODAL_NAVS } from './common';
import { map } from 'lodash';
import { LazyAntd } from '@lm_fe/components';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default function EditModal(props) {
  const { onCancel, onSubmit, visible, templateType, userid, data } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form &&
      form.setFieldsValue({
        ...data,
        pid: 0,
        type: templateType,
      });
  }, []);

  const handleSubmit = () => {
    const formData = form && form.getFieldsValue();
    onSubmit && onSubmit(formData);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      closable={false}
      width={'50vw'}
      styles={{ body: { height: '50vh' } }}
    >
      <Form autoComplete="off" form={form}>
        <Form.Item label="所属模块" name="type">
          <Select>
            {map(MODAL_NAVS, (nav, key) => {
              return (
                <Select.Option value={nav.type} key={key}>
                  {nav.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="上级模板" name="pid">
          <TemplateSelect templateType={templateType} userid={userid} />
        </Form.Item>
        <Form.Item label="模板内容" name="val">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
