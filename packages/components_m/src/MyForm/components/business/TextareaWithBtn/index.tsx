import React, { Component } from 'react';
import { Input } from 'antd';
import styles from './index.module.less';
import { mchcEvent } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field, SMchc_FormDescriptions } from '@lm_fe/service';
// import templateIcon from '@/assets/imgs/template-icon.png';
interface ITextareaWithTemplateProp {
  onChange: Function;
  value: any;
  onClick: Function;
  disabled?: boolean
  minRows?: number
  maxRows?: number
  config?: IMchc_FormDescriptions_Field
}
export default function TextareaWithTemplate(props: ITextareaWithTemplateProp) {
  console.log('TextareaWithTemplate', props)
  const { value, onClick, disabled, minRows = 2, maxRows = 5 } = props;
  function handleClickBtn() {
    onClick?.();
    mchcEvent.emit('my_form', { type: 'onClick', btnName: SMchc_FormDescriptions.format_itemName_str(props.config!) })
  };

  function handleTextareaChange(e: any) {
    const { onChange } = props;
    onChange(e.target.value);
  };



  return (
    <div className={styles["template-wrapper"]}>
      <Input.TextArea
        className={styles["template-texarea"]}
        value={value}
        autoSize={{ minRows, maxRows }}
        onChange={handleTextareaChange}
        disabled={disabled}
      />
      {
        disabled
          ? null
          : <div className={styles["template-action"]} onClick={handleClickBtn}>
            模
          </div>
      }
    </div>
  );
}
