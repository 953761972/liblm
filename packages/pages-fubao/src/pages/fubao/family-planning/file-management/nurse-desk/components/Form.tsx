import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { BaseEditPanelForm, fubaoHistoryPush, resolveFubaoPath } from '@lm_fe/components_m';
import { mchcEnv, mchcUtils } from '@lm_fe/env';
import { SLocal_History } from '@lm_fe/service';
import { Button, Space, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, size } from 'lodash';
import React from 'react';
export default class AdmissionForm extends BaseEditPanelForm {
  // 地址组件 触发按钮
  getEvents = () => ({
    handleIDNumberChange: (id: string) => {
      if (id === 'residenceAddress') {
        const value = this.form?.getFieldValue('permanentResidenceAddress');
        !value && mchcEnv.info('请先填写完整的户口地址信息！');
        value && this.form?.setFieldsValue({ residenceAddress: value });
      }
    },
  });

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;

    if (
      get(allValues, 'idType') === 1 &&
      size(get(allValues, 'idNO')) === 18 &&
      (get(changedValues, 'idType') || get(changedValues, 'idNO'))
    ) {
      const idNO = get(allValues, 'idNO');
      const personal = mchcUtils.checkIdNo(idNO);
      if (personal.status) {
        form &&
          form.setFieldsValue({
            dob: personal.birth,
            nationality: personal.nationality,
            nativeplace: personal.province,
            age: personal.age,
          });
      } else {
        message.warning(`${get(personal, 'message')}`);
      }
    }
  };

  handleCancel = async () => {
    const { history, data, deleteTab, routerPath, tabs, keepAliveProviderRef, updateTabs } = this.props as any;
    const form = this.form as unknown as FormInstance;
    if (!get(data, 'id')) form.resetFields();

    //删除keepAliveProvider缓存
    // await updateTabs(get(tabs, `tabsMapping./family-planning/file-management/list`));
    // routerPath && (await deleteTab(routerPath));
    // fubaoHistoryPush('/family-planning/file-management/list', this.props as any);
    // const { path, search } = get(tabs, `tabsMapping.${routerPath}`);
    // keepAliveProviderRef?.current.removeCache(`${path}.name.${search}`);

    SLocal_History.closeAndPush(resolveFubaoPath('/family-planning/file-management/list'))

  };
  renderCancelBtn = () => {
    return (
      <Button size="large" icon={<CloseOutlined />} onClick={this.handleCancel}>
        关闭
      </Button>
    );
  };
  renderCheckBtn = () => {
    return (
      <Button
        size="large"
        type="primary"
        icon={<SaveOutlined />}
        htmlType="submit"
        onClick={this.handleFinish}
        disabled={false}
      >
        保存并审核
      </Button>
    );
  };
  renderBtns = () => {
    const { history } = this.props as any;
    return (
      <Space>
        {history && this.renderCancelBtn()}
        {this.renderCheckBtn()}
      </Space>
    );
  };
}
