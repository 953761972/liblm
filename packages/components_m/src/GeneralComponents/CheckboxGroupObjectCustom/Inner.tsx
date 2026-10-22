import DefaultSelect from '../../MyForm/components/MySelect/DefaultSelect';
import { AutoComplete, Checkbox, Input, Row, } from 'antd';
import classnames from 'classnames';
import { get, isArray, map, set, size } from 'lodash';
import { pickBy } from 'lodash';
import { useEffect, useState } from 'react';
import styles from './index.less';
import React from 'react';
interface optionProps {
  key: string;
  label: string;
  warning?: boolean; // 默认不做waring样式提示
}
const extraObj = {
  key: 'nothing',
  label: '无',
};
interface IProps {
  value?: object;
  options?: optionProps[];
  [propName: string]: any;
}

// { key: 'value', keyNote: '', key1: 'value1'} --> [value, value1, ...]
// 获取checkboxValue <string[]>
function getCheckboxGroupValue(value = {}) {
  const objValue = pickBy(value, (value, key) => !key.includes('Note') && key !== 'id' && value);
  const arr = Object.keys(objValue);
  return size(arr) > 0 ? arr : ['nothing'];
}
export default function CheckboxGroupObject({
  value,
  options = [],
  onChange,
  type = 'withoutInput',
  row,
  cusextraObj,
  ...restProps
}: IProps) {
  // dataSource value值本地变量
  const [dataSource, setDataSource] = useState<any>(null);

  useEffect(() => {
    // 未有记录的状态
    if (!value || JSON.stringify(value) === '{}') {
      return;
    }
    // 有记录
    if (value) {
      let isNothing = true;
      Object.keys(value).forEach((key) => {
        if (key !== 'id' && value[key]) {
          isNothing = false;
        }
      });
      const val = isNothing ? { ...value, nothing: true } : value;
      setDataSource(val);
    }
  }, [value]);

  const handleChange = (checkedValue) => {
    onChange(checkedValue);
  };

  const handleTextChange = (name: string, val: string | number) => {
    const newValue = {
      ...dataSource,
      [name]: val,
    };
    onChange(newValue);
  };
  return (
    <Row className={styles["checkox-with-extra"]}>
      {map([cusextraObj || extraObj, ...options], (item) => {
        const itemVal = { key: get(value, [item.key]), keyNote: get(value, [`${item.key}Note`]) };
        return (
          <div className={styles["checkbox-group-object"]}>
            {
              <CheckboxItem
                key={item.key}
                type={type}
                option={item}
                value={itemVal}
                onTextChange={handleTextChange}
                onChange={handleChange}
                row={row}
                allValue={value}
                options={options}
              />
            }
          </div>
        );
      })}
    </Row>
  );
}
function CheckboxItem({
  option,
  onTextChange,
  type = 'withoutInput',
  allValue,
  onChange,
  row = false,
  value,
  options,
}: any) {
  const inputChange = (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    onTextChange(`${option.key}Note`, val);
  };
  const selectChange = (val) => {
    onTextChange(`${option.key}Note`, val);
  };
  const customselectChange = (val: any) => {
    if (isArray(val)) {
      onTextChange(`${option.key}Note`, val.join(','));
    } else {
      onTextChange(`${option.key}Note`, val);
    }
  };
  function checkboxChange(val, key) {
    let newVal = {};
    if (key == 'nothing' && val) {
      map(options, (item) => {
        set(newVal, `${item.key}`, false);
        set(newVal, `${item.key}Note`, '');
      });
      newVal = { ...newVal, nothing: true };
    } else {
      let keyNote = `${key}Note`;
      newVal = { ...allValue, [key]: val, [keyNote]: val ? value.keyNote : '', nothing: false };
    }
    const newAllValue = { ...allValue, ...newVal };
    onChange(newAllValue);
  }
  function transFormToValues(val) {
    if (val && Object.prototype.toString.call(val) == '[object String]') {
      return val.split(',');
    } else {
      return val;
    }
  }

  function renderComponent(option: any) {
    switch (get(option, 'inputType')) {
      case 'customselect':
        return (
          <DefaultSelect
            value={transFormToValues(value.keyNote)}
            onChange={customselectChange}
            options={get(option, 'inputProps.options')}
            multiple={get(option, 'inputProps.multiple')}
            tags={get(option, 'inputProps.tags')}
            style={{ minWidth: '100px' }}
          />
        );
      case 'autoComplete':
        return (
          <AutoComplete
            options={get(option, 'inputProps.options')}
            onChange={selectChange}
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              marginLeft: '6px',
              width: '100px',
            }}
            value={value.keyNote}
          />
        );
      default:
        return (
          <Input
            name={option.key}
            value={value.keyNote}
            onChange={inputChange}
            title={value.keyNote}
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          />
        );
    }
  }
  return (
    <div
      className={classnames(
        'checkbox-group-object-item-cus',
        { warning: option.warning },
        {
          'global-issue-checkbox': option.warning && value.key,
        },
        {
          'checkbox-group-object-select': option.inputType == 'select',
        },
      )}
    >
      <Checkbox
        name={option.key}
        checked={get(allValue, `${option.key}`)}
        onChange={(e) => {
          checkboxChange(e.target.checked, option.key);
        }}
      >
        {option.label}
      </Checkbox>
      {type === 'withInput' && option.key !== extraObj.key && value.key && option.warning && renderComponent(option)}
    </div>
  );
}
