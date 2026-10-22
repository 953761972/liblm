import { BaseEditPanelFormFC, OkButton } from '@lm_fe/components_m';
import { CloseOutlined, SaveOutlined, SolutionOutlined } from '@ant-design/icons';
import { mchcUtils } from '@lm_fe/env';
import { AnyObject, request } from '@lm_fe/utils';
import { Form, message, Popconfirm, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { BF_Wrap2 } from '@lm_fe/pages';
import { identity, map, pickBy, size } from 'lodash';
import { CustomModal } from "./components/tipModal";

const form_fn = () => import('./form_config')

function DeliverEdit(props: AnyObject) {
  const id = mchcUtils.single_id(props);
  const { config, Wrap } = BF_Wrap2({
    default_conf: {
      title: '入院登记-档案编辑',
      tableColumns: form_fn
    }
  })
  const [form] = Form.useForm();
  const [data, set_data] = useState<AnyObject>({});
  const [admissionId, set_admissionId] = useState<string>('');
  // 门诊列表数据
  const [outpatientList, set_outpatientList] = useState<AnyObject[]>([]);
  const [renderModal, set_renderModal] = useState<boolean>(false);
  const [addModalVisible, set_addModalVisible] = useState<boolean>(false);
  const [editModalVisible, set_editModalVisible] = useState<boolean>(false);

  useEffect(() => {
    handleInit();
  }, [])

  async function handleInit() {
    try {
      const resData = id
        ? (await request.get(`/api/getBaseInfoOfInpatientEmr?id=${id}`)).data
        : {};
      set_data(resData)
      form.setFieldsValue(resData);
    } catch (err) {
      message.error('加载档案信息失败');
    }
  };

  const handleFill = async () => {
    const idType = form?.getFieldValue('idType');
    const idNO = form?.getFieldValue('idNO');
    const admissionId = mchcUtils.single_id()
    if (!idType || !idNO) {
      message.warning('请输入证件类型或证件号码');
      return;
    }
    const param = {
      idType,
      idNO,
      admissionId
    };
    try {
      const OutpatientData = (
        await request.get('/api/getBaseInfoFromOutpatientEmr', {
          params: param,
        })
      ).data
      if (size(OutpatientData) > 0) {
        const list = map(OutpatientData, (item, index) => ({ ...item, key: index }));
        set_outpatientList(list)
        set_renderModal(true)
      } else {
        message.warning('暂无门诊病历');
      }
    } catch (err) {
      message.error('查询门诊病历失败');
    }
  };

  // ✅ 选中门诊记录，回填表单
  const handleSelectRow = (record: AnyObject) => {
    const data = pickBy(record, identity)
    console.log('handleSelectRow', data)
    form.setFieldsValue(data);
    set_renderModal(false);
    message.success('已导入选中门诊信息');
  }

  //新增保存后 继续新增
  const handleContinueAdd = () => {
    form?.resetFields();
    set_addModalVisible(false)
  };
  //新增保存后 点击'查看'跳转回列表对应查看页
  const handleViewAfterAdd = () => {
    const { deleteTab, history, routerPath } = props;
    set_addModalVisible(false)
    history.push(`/deliver-management-v2/admission/deliver-edit?id=${admissionId}`);
    routerPath && deleteTab(routerPath);
  };
  // 编辑保存后 继续编辑
  const handleContinueEdit = () => {
    set_editModalVisible(false)
  };

  // 编辑成功后 点击'查看'跳转回列表对应查看页
  const handleViewEdit = () => {
    const { deleteTab, history, routerPath } = props;
    set_editModalVisible(false)
    history.push(`/deliver-management-v2/admission/deliver-edit?id=${admissionId}`);
    routerPath && deleteTab(routerPath);
  };

  async function handleSubmit() {
    try {
      const values = form.getFieldsValue()
      let submit_values = mchcUtils.autoCommonOptionToNote(values)

      if (!id) {
        const res: any = await request.post("/api/newInpatientEmr", submit_values);
        set_admissionId(res?.data.id))
        set_addModalVisible(true)
        // message.success('新建成功');
      } else {
        submit_values = {
          ...data,
          ...submit_values,
        };
        const res: any = await request.put('/api/updateBaseInfoOfInpatientEmr', submit_values);
        const { needEditModal = true } = props;
        if (needEditModal) {
          set_admissionId(res?.data.id)
          set_editModalVisible(true)
        } else {
          message.success('修改入院登记成功');
        }
      }
    } catch (err) {
      message.error('保存失败');
    }
  };

  // 门诊弹窗表格列，你根据后端返回字段自行调整
  const modalColumns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '末次月经',
    dataIndex: 'lmp',
    key: 'lmp',
  }, {
    title: '证件类型',
    dataIndex: 'idType',
    key: 'idType',
    render: (value: any) =>
      value === 1
        ? '身份证'
        : value === 2
          ? '护照'
          : value === 3
            ? '回乡证'
            : value === 4
              ? '台胞证'
              : value === 5
                ? '港澳台居民居住证'
                : value === 99
                  ? '其它'
                  : '',
  },
  {
    title: '证件号码',
    dataIndex: 'idNO',
    key: 'idNO',
  },
  {
    title: '操作',
    key: 'action',
    render: (_: any, record: AnyObject) => (
      <a onClick={() => handleSelectRow(record)}>选择导入</a>
    )
  }]

  return <Wrap style={{}}>
    <BaseEditPanelFormFC
      form={form}
      formDescriptions={__DEV__ ? form_fn : config?.tableColumns}
      renderBtns={() => {
        return <>
          <Popconfirm
            title="导入门诊病历可能会覆盖当前已填选项，确定导入吗"
            onConfirm={handleFill}
            onCancel={() => { }}
            okText="确定"
            cancelText="取消"
          >
            <OkButton size="large" type="primary" icon={<SolutionOutlined />}>
              导入门诊病历
            </OkButton>
          </Popconfirm>
          <OkButton type="primary" size="large" onClick={handleSubmit}>
            保存
          </OkButton>
        </>
      }}
    />

    {/* ✅ 新增弹窗：门诊病历选择弹窗 */}
    <Modal
      title="导入门诊基本信息"
      open={renderModal}
      onCancel={() => set_renderModal(false)}
      footer={null}
      width={700}
    >
      <Table
        columns={modalColumns}
        dataSource={outpatientList}
        rowKey="key"
        pagination={false}
      />
    </Modal>

    {/* 新增 */}
    <CustomModal
      CustomModalVisible={addModalVisible}
      leftButtonText="继续新增"
      handleContinue={handleContinueAdd} //新增保存后 继续新增
      handleView={handleViewAfterAdd} //新增保存后 点击查看
      handleCancel={() => { }}></CustomModal>

    {/* 编辑 */}
    <CustomModal
      CustomModalVisible={editModalVisible}
      leftButtonText="继续编辑"
      handleContinue={handleContinueEdit}
      handleView={handleViewEdit}
      handleCancel={() => { }}></CustomModal>
  </Wrap >
}
export default DeliverEdit
