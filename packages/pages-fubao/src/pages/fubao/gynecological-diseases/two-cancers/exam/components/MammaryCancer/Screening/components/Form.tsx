import { BaseEditPanelForm, getBMI } from '@lm_fe/components_m'
import { Space, message, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { get, set } from 'lodash';
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
    console.log('changedValues', changedValues)
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

    if (
      (get(changedValues, 'womenHealthcarePhysicalExamination.weight') &&
        get(allValues, 'womenHealthcarePhysicalExamination.height')) ||
      (get(changedValues, 'womenHealthcarePhysicalExamination.height') &&
        get(allValues, 'womenHealthcarePhysicalExamination.weight'))
    ) {
      const bmi = getBMI(
        get(allValues, 'womenHealthcarePhysicalExamination.weight'),
        get(allValues, 'womenHealthcarePhysicalExamination.height'),
      );
      form && form.setFieldsValue({ womenHealthcarePhysicalExamination: { bmi: bmi } });
    }

    if (get(allValues, 'womenHealthcareMenstrualHistory.parity')) {
      if (
        get(allValues, 'womenHealthcareMenstrualHistory.parity') >
        get(allValues, 'womenHealthcareMenstrualHistory.conceived')
      ) {
        message.warning('产次＞孕次，请检查孕次、产次输入的内容!');
      }
    }

    // 1、若患者仅包含B超检查结果，且BI-RADS分类为1级、2级；且医生勾选【活检】则异常提示。
    // 2、若患者仅包含B超检查结果，且BI-RADS分类为3级、0级；且医生勾选【活检】或【定期检查】则异常提示。
    // 3、若患者仅包含B超检查结果，且BI-RADS分类为4级、5级；且医生勾选【定期检查】或【复查乳腺X线则异常提示。
    // 4、若患者包含乳腺X线检查；且BI-RADS分类为1级、2级；且医生勾选【活检】则异常提示。
    // 5、若患者包含乳腺X线检查；且BI-RADS分类为3级、0级；且医生勾选【定期检查】则异常提示。
    // 6、若患者包含乳腺X线检查；且BI-RADS分类为4级、5级；且医生勾选【定期检查】或【复查乳腺X线】则异常提示。
    if (get(changedValues, 'breastCancerDiagnosisAndGuidance.screeningSuggest')) {
      let content1 = '';
      let content2 = '';
      let content3 = '';
      const screeningSuggest = get(changedValues, 'breastCancerDiagnosisAndGuidance.screeningSuggest');
      const leftBiRadsClassification = get(allValues, 'breastCancerAuxiliaryExamination.leftBiRadsClassification');
      const rightBiRadsClassification = get(allValues, 'breastCancerAuxiliaryExamination.rightBiRadsClassification');
      const leftBreastXBiRadsClassification = get(
        allValues,
        'breastCancerAuxiliaryExamination.leftBreastXBiRadsClassification',
      );
      const rightBreastXBiRadsClassification = get(
        allValues,
        'breastCancerAuxiliaryExamination.rightBreastXBiRadsClassification',
      );

      if ([0, 3, 4, 5].includes(leftBiRadsClassification) || [0, 3, 4, 5].includes(rightBiRadsClassification)) {
        content1 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【B超检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[0, 3, 4, 5].includes(leftBiRadsClassification) ? leftBiRadsClassification : rightBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if (
        [0, 3, 4, 5].includes(leftBreastXBiRadsClassification) ||
        [0, 3, 4, 5].includes(rightBreastXBiRadsClassification)
      ) {
        content1 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【乳腺X线检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[0, 3, 4, 5].includes(leftBreastXBiRadsClassification)
            ? leftBreastXBiRadsClassification
            : rightBreastXBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if ([4, 5].includes(leftBiRadsClassification) || [4, 5].includes(rightBiRadsClassification)) {
        content2 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【B超检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[4, 5].includes(leftBiRadsClassification) ? leftBiRadsClassification : rightBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if ([4, 5].includes(leftBreastXBiRadsClassification) || [4, 5].includes(rightBreastXBiRadsClassification)) {
        content2 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【乳腺X线检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[4, 5].includes(leftBreastXBiRadsClassification)
            ? leftBreastXBiRadsClassification
            : rightBreastXBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if ([0, 1, 2, 3].includes(leftBiRadsClassification) || [0, 1, 2, 3].includes(rightBiRadsClassification)) {
        content3 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【B超检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[0, 1, 2, 3].includes(leftBiRadsClassification) ? leftBiRadsClassification : rightBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if ([1, 2].includes(leftBreastXBiRadsClassification) || [1, 2].includes(rightBreastXBiRadsClassification)) {
        content3 += `
          <span>
            患者<span style="color: rgb(61, 139, 247)">【乳腺X线检查】</span>检查结果
            <span style="color: rgb(61, 139, 247)">【${[1, 2].includes(leftBreastXBiRadsClassification)
            ? leftBreastXBiRadsClassification
            : rightBreastXBiRadsClassification
          }级】</span>；
          </span>`;
      }

      if (
        (screeningSuggest === '定期检查' && [0, 3, 4, 5].includes(leftBiRadsClassification)) ||
        (screeningSuggest === '定期检查' && [0, 3, 4, 5].includes(rightBiRadsClassification)) ||
        (screeningSuggest === '定期检查' && [0, 3, 4, 5].includes(leftBreastXBiRadsClassification)) ||
        (screeningSuggest === '定期检查' && [0, 3, 4, 5].includes(rightBreastXBiRadsClassification))
      ) {
        Modal.warning({
          title: '提示信息',
          content: (
            <>
              <span dangerouslySetInnerHTML={{ __html: content1 }} />
              <span>请核对筛查建议！</span>
            </>
          ),
        });
      }

      if (
        (screeningSuggest === '复查乳腺X线' && [4, 5].includes(leftBiRadsClassification)) ||
        (screeningSuggest === '复查乳腺X线' && [4, 5].includes(rightBiRadsClassification)) ||
        (screeningSuggest === '复查乳腺X线' && [4, 5].includes(leftBreastXBiRadsClassification)) ||
        (screeningSuggest === '复查乳腺X线' && [4, 5].includes(rightBreastXBiRadsClassification))
      ) {
        Modal.warning({
          title: '提示信息',
          content: (
            <>
              <span dangerouslySetInnerHTML={{ __html: content2 }} />
              <span>请核对筛查建议！</span>
            </>
          ),
        });
      }

      if (
        (screeningSuggest === '活检' && [0, 1, 2, 3].includes(leftBiRadsClassification)) ||
        (screeningSuggest === '活检' && [0, 1, 2, 3].includes(rightBiRadsClassification)) ||
        (screeningSuggest === '活检' && [1, 2].includes(leftBreastXBiRadsClassification)) ||
        (screeningSuggest === '活检' && [1, 2].includes(rightBreastXBiRadsClassification))
      ) {
        Modal.warning({
          title: '提示信息',
          content: (
            <>
              <span dangerouslySetInnerHTML={{ __html: content3 }} />
              <span>请核对筛查建议！</span>
            </>
          ),
        });
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
              leftBreastSignsNote: '{"checkedValues":[0]}',
              leftBreastSymptomsNote: '{"checkedValues":[0]}',
              rightBreastSignsNote: '{"checkedValues":[0]}',
              rightBreastSymptomsNote: '{"checkedValues":[0]}',
            },
          });
      }
      // 一键取消
      if (id === 'selectBtn' && !isCheck) {
        const form = this.form as unknown as FormInstance;
        form &&
          form.setFieldsValue({
            breastCancerBreastPalpation: {
              leftBreastSignsNote: '{"checkedValues":[]}',
              leftBreastSymptomsNote: '{"checkedValues":[]}',
              rightBreastSignsNote: '{"checkedValues":[]}',
              rightBreastSymptomsNote: '{"checkedValues":[]}',
            },
          });
      }
    },
  });
}
