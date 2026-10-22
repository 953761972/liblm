import { BaseEditPanelForm } from '@lm_fe/components_m'
import { Space } from 'antd';
import React from 'react';

export default class AdmissionForm extends BaseEditPanelForm {
  renderBtns = () => {
    return (
      <Space size="middle">
        {this.renderSubmitBtn()}
        {this.renderPrintBtn()}
      </Space>
    );
  };
}
