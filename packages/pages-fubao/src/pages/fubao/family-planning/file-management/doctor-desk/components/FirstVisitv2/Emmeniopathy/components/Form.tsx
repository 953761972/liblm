import { BaseEditPanelForm } from '@lm_fe/components_m';;
import { get } from 'lodash';
import { Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import dayjs from 'dayjs';
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
  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;

    /** 根据几周后计算出日期 */
    if (get(changedValues, 'earlyPregnancyCheckDiagnosisAndTreatment.appointmentWeeksLater')) {
      const appointmentWeeksLater = get(
        changedValues,
        'earlyPregnancyCheckDiagnosisAndTreatment.appointmentWeeksLater',
      );
      if (appointmentWeeksLater === 1) {
        const appointmentSpecificDate = dayjs().add(7, 'd');
        form && form.setFieldsValue({ earlyPregnancyCheckDiagnosisAndTreatment: { appointmentSpecificDate } });
      }
      if (appointmentWeeksLater === 2) {
        const appointmentSpecificDate = dayjs().add(14, 'd');
        form && form.setFieldsValue({ earlyPregnancyCheckDiagnosisAndTreatment: { appointmentSpecificDate } });
      }
      if (appointmentWeeksLater === 3) {
        const appointmentSpecificDate = dayjs().add(21, 'd');
        form && form.setFieldsValue({ earlyPregnancyCheckDiagnosisAndTreatment: { appointmentSpecificDate } });
      }
    }
  };
}
