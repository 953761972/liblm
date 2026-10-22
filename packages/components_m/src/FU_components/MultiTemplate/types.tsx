import { ITemplateConfig } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field } from '@lm_fe/service';
import { AnyObject } from '@lm_fe/utils';
import { ButtonProps, FormInstance, ModalProps } from 'antd';
import React from 'react';
export interface IMultiTemplate_type {
    label: string
    params?: AnyObject
    canOperate?: boolean
}
export interface IMultiTemplate_remote {

    description: string
    id: number
    type: string
    data: IMultiTemplate_item[]
}
export interface IMultiTemplate_item { title: string, [x: string]: any }
export interface IMultiTemplateProps extends Omit<ButtonProps, 'form'> {
    value?: string
    url?: string
    onChange?(v: any): void
    style?: React.CSSProperties
    MultiTemplate_type?: IMultiTemplate_type[]
    btn_text?: string
    modal_props?: ModalProps
    fds: IMchc_FormDescriptions_Field[]
    form?: FormInstance
}
