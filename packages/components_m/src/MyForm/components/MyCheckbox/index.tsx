import { Checkbox } from 'antd';
import { get, isArray, isEmpty, isObject, isString } from 'lodash';
import React, { Component, ReactNode } from 'react';
import { convertExtraEditors, getObjectFormArray, isArr, isObj } from '../../utils/func';
import CheckboxInputNeedFillWidth from './CheckboxInputNeedFillWidth';
import CustomCheckbox from './CustomCheckbox';
import GroupCheckbox from './GroupCheckbox';
import MultipleCheckbox from './MultipleCheckbox';
import { otherOptions } from '@lm_fe/env';
import './index.less';
import { CheckboxComponentProps, IExtraEditors, MyCheckboxProps } from './type';




// TODO 这个的结构以及判断过于复杂，可以考虑重构
export default class MyCheckbox extends Component<MyCheckboxProps, any> {
  checkbox: { [key: string]: Function } = {
    default: (input_props: CheckboxComponentProps, value: any, onChange: Function): ReactNode => {
      return <Checkbox checked={value} onChange={(e: any) => onChange(e.target.checked)} disabled={this.props.disabled} />;
    },
    multiple: (input_props: CheckboxComponentProps, value: any = {}, onChange: Function): ReactNode => {
      const editors: IExtraEditors[] = [];
      if (!isObj(value)) {
        value = {};
      }
      const r: any = input_props.renderData.map((item) => {
        // 统一输入规范，所以在这个位置提取
        if (item.extraEditors) {
          editors.push(item.extraEditors[0]);
        }
        return {
          checkboxValue: value[item.key],
          editorsValue:
            item.extraEditors && item.extraEditors[0].editors.length > 1
              ? convertExtraEditors(value[`${item.key}Note`])
              : [value[`${item.key}Note`]],
          key: item.key,
          label: item.label,
        };
      });
      const handleChange = (val: any, key: string) => {
        // 判断editors的数量决定保存为object还是string
        const index = input_props.renderData.findIndex((item: any) => item.key === key);
        if (index === -1) {
          console.error(`在renderData中找不到${key}`);
          return;
        }
        let newObj: any = {};
        if (!val.checkboxValue) {
          // 后台目前 使用 “” 保存，会保存不了
          newObj = { [key]: false, [`${key}Note`]: ' ' };
        } else {
          newObj = { [key]: val.checkboxValue, [`${key}Note`]: '' };
          if (Array.isArray(input_props.renderData[index].extraEditors)) {
            if (input_props.renderData[index].extraEditors[0].editors.length <= 1) {
              newObj[`${key}Note`] = val.editorsValue ? val.editorsValue[0] || ' ' : ' ';
            } else {
              newObj[`${key}Note`] = JSON.stringify(getObjectFormArray(val.editorsValue));
            }
          }
        }
        onChange(Object.assign(value, newObj));
      };
      return <MultipleCheckbox disabled={this.props.disabled} value={r} onChange={handleChange} radio={input_props.radio} editors={editors} />;
    },
    custom: (input_props: CheckboxComponentProps, value: any, onChange: Function): ReactNode => {
      const { renderData, radio = true, inputNeedFillWidth } = input_props;
      const allOptions = isString(renderData[0].options) ? otherOptions[renderData[0].options] : renderData[0].options;

      if (renderData.length !== 1) return <span>custom型checkbox中renderData长度为1</span>;

      let r: any = {
        checkboxValue: '',
        editorsValue: '',
        key: renderData[0].key,
        options: [],
      };

      let keyNote = get(renderData, '0.keyNote') ? get(renderData, '0.keyNote') : `${renderData[0].key}Note`;

      if (value && renderData[0].key in value) {
        r = {
          checkboxValue: get(value, renderData[0].key),
          editorsValue:
            get(renderData, '0.extraEditors') && !isEmpty(get(renderData, '0.extraEditors.0.editors'))
              ? convertExtraEditors(get(value, keyNote))
              : [get(value, keyNote)],
          key: renderData[0].key,
        };
      }
      const handleChange = (val: any, key: string) => {
        if (!isObject(value)) {
          value = {};
        }
        const index = input_props.renderData.findIndex((item: any) => item.key === key);
        if (index === -1) {
          console.error(`在renderData中找不到${key}`);
          return;
        }
        let newObj: any = {};
        // 这里要考虑一个0的情况
        if (val.checkboxValue === false) {
          newObj = { [key]: false, [keyNote]: ' ' };
        } else {
          newObj = { [key]: val.checkboxValue, [keyNote]: ' ' };
          if (isArray(input_props.renderData[index].extraEditors)) {
            if (
              input_props.renderData[index].extraEditors[0] &&
              input_props.renderData[index].extraEditors[0].editors.length <= 1
            ) {
              if (value[key] === val.checkboxValue) {
                newObj[keyNote] = val.editorsValue ? val.editorsValue[0] || '' : '';
              }
            } else {
              newObj[keyNote] = JSON.stringify(getObjectFormArray(val.editorsValue));
            }
          }
        }
        onChange(newObj);
      };
      return inputNeedFillWidth ? (
        <CheckboxInputNeedFillWidth
          disabled={this.props.disabled}
          value={r}
          onChange={handleChange}
          radio={radio}
          options={allOptions}
          editors={renderData[0].extraEditors}
        />
      ) : (
        <CustomCheckbox
          disabled={this.props.disabled}
          value={r}
          onChange={handleChange}
          radio={radio}
          options={allOptions}
          editors={renderData[0].extraEditors}
        />
      );
    },
    group: (input_props: CheckboxComponentProps, value: any, onChange: Function): ReactNode => {
      const { options = [], radio = true, issue } = input_props;
      const allOptions = isString(options) ? otherOptions[options] : options;
      // 现在只做单选的，多选格式确定下来再做
      const handleChange = (val: Array<any>): void => {
        if (val.length && val.length !== 0) {
          if (radio) {
            onChange(val[0]);
          } else {
            console.warn('group型checkbox多选尚未处理');
            // onChange(val[0]);
          }
        } else {
          onChange(val);
        }
      };
      return (
        <GroupCheckbox
          disabled={this.props.disabled}
          value={[value]}
          onChange={(val: any) => handleChange(val)}
          radio={radio}
          options={allOptions}
          editors={[]}
          issue={issue}
        />
      );
    },
  };

  renderCheckbox = () => {
    const { value, onChange } = this.props;
    const input_props = get(this.props, 'input_props', { type: 'default' })
    const { type = 'default' } = input_props;
    return this.checkbox[type || 'default'](input_props, value, onChange);
  };

  render() {
    return <div className="check-box">{this.renderCheckbox()}</div>;
  }
}
