import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { safe_json_parse_arr } from '@lm_fe/utils';
import { ButtonProps } from 'antd';
import React from 'react';
// import FormSection, { IFormSectionProps } from '../../BaseModalForm/FormSection';
// import { RenderEditItemStandalone, formatFormConfig } from '../../BaseModalForm/utils';
import { IFormSectionProps } from '../FormSection/types';
import { TCommonComponent } from '../types';
interface IProps extends IFormSectionProps {
    tip?: string
    addBtnStyle?: ButtonProps
    marshal?: boolean
    actionConfig?: IMchc_FormDescriptions_Field
}

export const ArrayPanel_DisplayFC: TCommonComponent<IProps, string | any[]> = (props) => {
    const { value, } = props


    const safe_value = safe_json_parse_arr(value)

    return <div>

        {safe_value.length}项
    </div>
}