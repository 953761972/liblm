import { MyIcon } from '@lm_fe/components';
import { Button, Col, Input, message, Popconfirm, Row } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep, get, set } from 'lodash';
import React from 'react';
import { CustomIcon, } from '../../GeneralComponents/CustomIcon';
import styles from './index.module.less';
import Template from './template';
import { AnyObject, expect_array } from '@lm_fe/utils';
class Index extends React.Component<{ value: any, list_fuck_off?: boolean, is_fuck?: boolean, onChange?(v: any): void }> {
  state = {
    isShowDiagnosesTemplate: false,
  };

  getTitle = (item: any) => {
    const createdDate = item.createDate ? `诊断时间: ${item.createDate}\n` : '';
    const diagnosis = item.diagnosis ? `诊断全称: ${item.diagnosis}\n` : '';
    const note = item.note ? `诊断备注: ${item.note}\n` : '';
    return `${createdDate}${diagnosis}${note}`;
  };
  get_the_fucking_value() {
    const { value, list_fuck_off = false } = this.props
    const v = list_fuck_off ? value : get(value, 'list')
    return expect_array<any>(v)
  }
  emit_the_fucking_value(newList: any[]) {
    const { value, onChange, list_fuck_off = false } = this.props
    if (list_fuck_off) {
      onChange?.(newList);
    } else {
      onChange?.({ ...value, list: newList });
    }

  }
  handleDelete = async (item: any, i: number) => {
    const newList = cloneDeep(this.get_the_fucking_value());
    newList.splice(i, 1);
    this.emit_the_fucking_value(newList)
  };

  changeNote = (v: string, i: number) => {
    const newList = cloneDeep(this.get_the_fucking_value());
    const item = newList[i];
    item.note = v;
    this.emit_the_fucking_value(newList)

  };

  handleBtnClick = () => {
    this.setState({
      isShowDiagnosesTemplate: true,
    });
  };

  addDiag = async (diagnosisObj: any) => {
    const arr = this.get_the_fucking_value() || [];
    const diag = get(diagnosisObj, 'diagnosis');
    if (arr.filter((item: any) => item.diagnosis === diag).length === 0) {
      const newList = cloneDeep(arr);
      set(diagnosisObj, 'createDate', dayjs().format('YYYY-MM-DD'));
      set(diagnosisObj, 'diagnosisCode', get(diagnosisObj, 'code'));
      // 诊断互斥项
      const specialList = ['妊娠', '早孕', '中孕', '晚孕'];
      let specialIndex = -1;
      newList.forEach((item: any, index: any) => {
        if (specialList.includes(item.diagnosis)) specialIndex = index;
      });
      if (specialIndex !== -1 && specialList.includes(diag)) {
        newList.splice(specialIndex, 1);
        newList.unshift(diagnosisObj);
      } else if (specialIndex === -1 && specialList.includes(diag)) {
        newList.unshift(diagnosisObj);
      } else {
        newList.push(diagnosisObj);
      }
      // 对诊断进行排序，sort赋值
      newList.forEach((subItem: any, subIndex: number) => {
        subItem.sort = subIndex + 1;
      });

      this.emit_the_fucking_value(newList)


    } else {
      message.warning('添加诊断重复！');
    }
  };

  closeTemplate = () => {
    this.setState({
      isShowDiagnosesTemplate: false,
    });
  };

  renderDiagnoses = () => {
    const { isAllPregnancies, value, id, is_fuck } = this.props as any;
    return (
      <div className={styles["diagWrapper"]}>
        {!isAllPregnancies && (
          <Button className={styles["diag-btn"]} icon={<MyIcon value='PlusCircleOutlined' />} onClick={this.handleBtnClick}>
            添加诊断
          </Button>
        )}
        {is_fuck && (
          <div className={styles["firstDiag"]}>
            <span className={styles["diagNum"]}>1、</span>G<span className={styles["diagGP"]}>{get(value, 'gravidity')}</span>P
            <span className={styles["diagGP"]}>{get(value, 'parity')}</span>
            妊娠
            {
              <>
                <span className={styles["diagGP diagWeek"]}>{get(value, 'gestationalWeek')}</span>周
              </>
            }
            {id === 'inductionLabourDiagnosisDocument' && (
              <span>
                <span className={styles["diagGP diagWeek2"]}>
                  {get(value, 'fetalPostion') ? (
                    get(value, 'fetalPostion')
                  ) : (
                    <span style={{ color: '#ccc' }}>胎方位</span>
                  )}
                </span>{' '}
                ,引产
              </span>
            )}
          </div>
        )}

        {this.get_the_fucking_value() &&
          this.get_the_fucking_value().map((item: any, i: number) => (
            <Row className={styles["singleDiag"]} title={this.getTitle(item)} key={i}>
              <Col span={18} className={styles["diagWord"]}>
                <span className={styles["diagNum"]}>{is_fuck ? i + 2 : i + 1}、</span>
                <span className={styles["diag-words"]}>{item.diagnosis}</span>
                <Input
                  className={styles["diagNote"]}
                  placeholder="备注"
                  disabled={isAllPregnancies ? true : false}
                  value={item.note}
                  onChange={(e) => this.changeNote(e.target.value, i)}
                />
              </Col>
              <Col span={4}>{item.createDate}</Col>
              {!isAllPregnancies && (
                <Col span={1}>
                  <Popconfirm
                    placement="topRight"
                    title={'你确定要删除这个诊断吗？'}
                    onConfirm={() => this.handleDelete(item, i)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <MyIcon value='DeleteOutlined' className={styles["delBtn"]} />
                  </Popconfirm>
                </Col>
              )}
            </Row>
          ))}
      </div>
    );
  };

  render() {
    const { isShowDiagnosesTemplate } = this.state;
    return (
      <div>
        {this.renderDiagnoses()}
        {isShowDiagnosesTemplate && (
          <Template
            isShowDiagnosesTemplate={isShowDiagnosesTemplate}
            closeTemplate={this.closeTemplate}
            addDiag={this.addDiag}
            {...this.props}
          />
        )}
      </div>
    );
  }
}
export default Index;
