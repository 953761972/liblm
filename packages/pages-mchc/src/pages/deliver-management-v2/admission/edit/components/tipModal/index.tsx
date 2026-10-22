import MessageSaveSuccess from '@/assets/imgs/message-success.png';
import { Modal as AntModal, Button } from 'antd';
import React from 'react';

import { uuid } from '@lm_fe/utils';
import './index.less';

const Modal = AntModal;

export default function CustomModal(props) {
  const key = uuid();

  // 点击 X
  const handleCancel = () => {
    props.handleCancel();
  };

  // 点击编辑
  const handleContinue = () => {
    props.handleContinue();
  };

  // 点击查看
  const handleView = () => {
    props.handleView();
  };

  return (
    <>
      <Modal
        key={key}
        className="tipModal"
        closable={false}
        title=""
        visible={props.CustomModalVisible}
        // onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" key="continue" onClick={handleContinue}>
            {props.leftButtonText}
          </Button>,
          <Button type="primary" key="view" onClick={handleView}>
            查看
          </Button>,
        ]}
      >
        <img src={MessageSaveSuccess} alt="信息保存成功" className="content-img" />
        <div className="content-title">信息保存成功</div>
      </Modal>
    </>
  );
}
export { CustomModal, Modal };

