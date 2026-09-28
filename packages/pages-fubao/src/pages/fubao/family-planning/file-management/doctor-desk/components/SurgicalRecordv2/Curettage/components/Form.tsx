import { BaseEditPanelForm } from '@lm_fe/components_m';;
import { Button, message, Space, Popconfirm } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { get, isEqual } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
export default class AdmissionForm extends BaseEditPanelForm {
  state = {
    importModalVisible: false,
    changeFlag: false,
  };

  confirm = async (e: any) => {
    const form = this.form as unknown as FormInstance;
    const { onFinish, data } = this.props;
    form &&
      form
        .validateFields()
        .then(() => {
          const params = {
            ...form.getFieldsValue(),
            id: get(data, 'id'),
            isPrint: true,
          };
          onFinish && onFinish(params);
        })
        .catch((error) => {
          message.error(get(error, 'errorFields.0.errors.0'));
          form.scrollToField(get(error, 'errorFields.0.name.0'));
        });
  };

  cancel = (e: any) => {
    console.log(e);
  };

  handleFieldsChange = async (changedFields: any, allFields: any) => {
    //判断是否触发表单修改，触发了-》打印就弹出提示
    const { changeFlag } = this.state;
    if (!changeFlag) {
      const { data } = this.props;
      const changeValue = get(changedFields, '0.value');
      const changeName = get(changedFields, '0.name');
      const oldValue = get(data, changeName);
      if (!isEqual(changeValue, oldValue)) {
        this.setState({
          changeFlag: true,
        });
      }
    }
  };

  renderBtns = () => {
    return (
      <Space size="middle">
        {this.renderSubmitBtn()}
        {this.renderPrintBtn()}
      </Space>
    );
  };

  renderPrintBtn = () => {
    const { changeFlag } = this.state;
    const { printId, extraEvents } = this.props as any;

    return changeFlag ? (
      <Popconfirm
        title="当前存在新数据，是否保存并打印？"
        onConfirm={this.confirm}
        onCancel={this.cancel}
        okText="确定"
        cancelText="取消"
      >
        <Button type="primary" size="large" icon={<PrinterOutlined />}>
          打印
        </Button>
      </Popconfirm>
    ) : (
      <Button
        type="primary"
        size="large"
        icon={<PrinterOutlined />}
        disabled={!printId}
        onClick={() => {
          extraEvents.handlePrint();
        }}
      >
        打印
      </Button>
    );
  };
}
