import { BaseEditPanelForm } from '@lm_fe/components_m'
import { Space } from 'antd';
import { get, set } from 'lodash';
import { FormInstance } from 'antd/lib/form';
import React from 'react';
export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
export default class AdmissionForm extends BaseEditPanelForm {
  componentDidMount() {
    const { data, formDescriptionsWithoutSection } = this.props;
    this.form = this.formRef.current;
    this.form && this.form.setFieldsValue(data);

    //乳腺彩色超声检查-是否禁用
    if (get(data, 'breastCancerAuxiliaryExamination.breastUltrasoundExamination')) {
      if (get(data, 'breastCancerAuxiliaryExamination.breastUltrasoundExamination.key') === 2) {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
      }
    }
    //乳腺X线BI-RADS分级-是否禁用
    if (get(data, 'breastCancerAuxiliaryExamination.breastXBiRadsExamination')) {
      if (get(data, 'breastCancerAuxiliaryExamination.breastXBiRadsExamination.key') === 2) {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBreastXBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBreastXBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
      }
    }
    this.renderEditItem = this.generateRenderEditItem(formDescriptionsWithoutSection, {
      formItemLayout,
    });
    // 强制渲染获取 form
    this.forceUpdate();
  }

  renderBtns = () => {
    return (
      <Space size="middle">
        {this.renderSubmitBtn()}
        {this.renderPrintBtn()}
      </Space>
    );
  };

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const { formDescriptionsWithoutSection, extraEvents } = this.props as any;
    const form = this.form as unknown as FormInstance;

    //乳腺彩色超声检查-是否禁用
    if (get(changedValues, 'breastCancerAuxiliaryExamination.breastUltrasoundExamination')) {
      const checkedValue = get(changedValues, 'breastCancerAuxiliaryExamination.breastUltrasoundExamination');
      if (get(checkedValue, 'key') === 2) {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        extraEvents.handleDisabled(formDescriptionsWithoutSection);
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { leftBiRadsClassification: null } });
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { rightBiRadsClassification: null } });
      } else {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBiRadsClassification', 'inputProps', 'disabled'],
          false,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBiRadsClassification', 'inputProps', 'disabled'],
          false,
        );
        extraEvents.handleDisabled(formDescriptionsWithoutSection);
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { leftBiRadsClassification: '' } });
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { rightBiRadsClassification: '' } });
      }
    }

    //乳腺X线BI-RADS分级-是否禁用
    if (get(changedValues, 'breastCancerAuxiliaryExamination.breastXBiRadsExamination')) {
      const checkedValue = get(changedValues, 'breastCancerAuxiliaryExamination.breastXBiRadsExamination');
      if (get(checkedValue, 'key') === 2) {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBreastXBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBreastXBiRadsClassification', 'inputProps', 'disabled'],
          true,
        );
        extraEvents.handleDisabled(formDescriptionsWithoutSection);
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { leftBreastXBiRadsClassification: null } });
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { rightBreastXBiRadsClassification: null } });
      } else {
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.leftBreastXBiRadsClassification', 'inputProps', 'disabled'],
          false,
        );
        set(
          formDescriptionsWithoutSection,
          ['breastCancerAuxiliaryExamination.rightBreastXBiRadsClassification', 'inputProps', 'disabled'],
          false,
        );
        extraEvents.handleDisabled(formDescriptionsWithoutSection);
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { leftBreastXBiRadsClassification: '' } });
        form && form.setFieldsValue({ breastCancerAuxiliaryExamination: { rightBreastXBiRadsClassification: '' } });
      }
    }
  };

  // 地址组件 触发按钮
  getEvents = () => ({
    handleButton: (id: string, isCheck: boolean) => {
      // 一键勾选
      if (id === 'selectBtn' && isCheck) {
        const form = this.form as unknown as FormInstance;
        form &&
          form.setFieldsValue({
            breastCancerBreastPalpation: {
              //{\"checkedValues\":[0]}
              // leftBreastSignsNote: '{"checkedValues":[0]}',
              // leftBreastSymptomsNote: '{"checkedValues":[0]}',
              // rightBreastSignsNote: '{"checkedValues":[0]}',
              // rightBreastSymptomsNote: '{"checkedValues":[0]}',
            },
          });
      }
      // 一键取消
      if (id === 'selectBtn' && !isCheck) {
        const form = this.form as unknown as FormInstance;
        form &&
          form.setFieldsValue({
            breastCancerBreastPalpation: {
              // leftBreastSignsNote: '{"checkedValues":[]}',
              // leftBreastSymptomsNote: '{"checkedValues":[]}',
              // rightBreastSignsNote: '{"checkedValues":[]}',
              // rightBreastSymptomsNote: '{"checkedValues":[]}',
            },
          });
      }
    },
  });
}
