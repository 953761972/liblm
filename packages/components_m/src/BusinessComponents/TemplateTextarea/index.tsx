import React, { Component } from 'react';
import { Input } from 'antd';
import classnames from 'classnames';
import styles from './index.module.less';
import TemplateModal from './TemplateModal';
import { get, isEqual } from 'lodash';
import { getSearchParamsValue } from '@lm_fe/utils';
interface IProps {
  onChange: Function;
  value: any;
  input_props: any;
  depid?: any;
  user?: any;
  disabled?: boolean;
}
interface IState {
  modalVisible: boolean;
  value: any;
}
export default class TextareaWithTemplate extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.value, this.props.value)) {
      this.setState({ value: nextProps.value });
    }
  }

  handleTextareaChange = (e: any): void => {
    const { onChange } = this.props;
    this.setState({
      value: e.target.value,
    });
    onChange && onChange(e.target.value);
  };

  openModal = async () => {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  handleOk = (data) => {
    const { onChange } = this.props;
    const value = get(this.state, 'value') || '';
    let content = `${value}${data}`;
    console.log(data);
    this.setState({
      value: `${value}${data}`,
      modalVisible: false,
    });
    onChange && onChange(content);
  };

  render() {
    const { modalVisible, value } = this.state;
    const { disabled, patientId, admissionId, pregnancyId } = this.props;
    const inputProps = get(this.props, 'config.inputProps') || {};
    return (
      <div className={styles["textarea-with-template"]}>
        <Input.TextArea
          disabled={disabled}
          title={value}
          value={value}
          autoSize={{ minRows: 2, maxRows: 5 }}
          onChange={this.handleTextareaChange}
          className={styles["template-textarea"]}
          {...inputProps}
        />
        <div
          className={classnames(styles['textarea-with-template__action'], {
            [styles['textarea-with-template__action_disabled']]: disabled,
          })}
          onClick={this.openModal}
        >
          <span>模</span>
        </div>
        {modalVisible && (
          <TemplateModal
            visible={modalVisible}
            onCancel={this.closeModal}
            onOk={this.handleOk}
            patientId={patientId}
            admissionId={admissionId ?? getSearchParamsValue('id')}
            pregnancyId={pregnancyId ?? getSearchParamsValue('id')}
          />
        )}
      </div>
    );
  }
}
