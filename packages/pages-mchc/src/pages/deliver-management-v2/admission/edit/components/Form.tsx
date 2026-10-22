
import { SolutionOutlined } from '@ant-design/icons';
import { BaseEditPanelForm, formatTimeToDate, LazyAntd } from '@lm_fe/components_m';
import { mchcUtils } from '@lm_fe/env';
import { request } from '@lm_fe/utils';
import React from 'react';

import { Button, message, Modal, Popconfirm } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { cloneDeep, get, identity, isEmpty, map, pickBy, size } from 'lodash';
import dayjs from 'dayjs';
import { global_check_admission_disabled } from '../../utils';
import { fromApi } from './../config/adapter';
import { tableColumn } from './../config/tableColumn';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd


export const formItemLayout = {
  // layout: 'horizontal',
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};


export default class AdmissionForm extends BaseEditPanelForm {
  static defaultProps = {
    disabledSubmit: global_check_admission_disabled()
  };
  state = {
    printModalVisible: false,
    importModalVisible: false,
    pregnancy: null,
    renderModal: false,
    data: [],
    selectRow: {},
    id: '',
  };

  componentDidMount() {
    let href = location.href;
    let id = href.split('=')[1];

    this.setState({ id: id });
    const { data, formDescriptionsWithoutSection } = this.props;
    this.form = this.formRef.current;
    // 屏蔽阜阳特殊需求，病区号、病区默认赋值
    // const areaNO = '1001';
    // const areaName = 'LDRP';
    // const newDefaultdata = { areaNO, areaName, ...data };
    const newDefaultdata = { ...data };
    this.form && this.form.setFieldsValue(newDefaultdata);
    this.renderEditItem = this.generateRenderEditItem(formDescriptionsWithoutSection, {
      formItemLayout,
    });
    // 强制渲染获取 form
    this.forceUpdate();
    this.props.deliverFormToFather(this);
  }

  getRegistrationEvents = () => ({
  });
  GestationalWeekBySureEdd = async (date: any) => {
    let sureEdd = dayjs(date).format('YYYY-MM-DD');
    let { data } = (await request.get(`/api/common/getGestationalWeekBySureEdd?sureEdd=${sureEdd}`)).data;
    return data;
  };
  // 地址组件 触发按钮
  getEvents = () => ({
    handleIDNumberChange: (id: string) => {
      if (id === 'contacterResidenceAddress') {
        const value = this.form?.getFieldValue('residenceAddress');
        !value && message.info('请先填写患者的居住地址信息！');
        value && this.form?.setFieldsValue({ contacterResidenceAddress: value });
      }
    },
    handleInputBlur: async (e) => {
      const id = get(this.props, `id`, null);
      const idType = this.form?.getFieldValue('idType');
      const idNO = this.form?.getFieldValue('idNO');
      if (id === null && idType == 1 && e.target.id == 'idNO' && idNO) {
        const param: Object = {
          page: 0,
          size: 10,
          sort: 'id,desc',
          'idNO.equals': idNO,
        };
        const data = (await request.get('api/pregnancies', {
          params: param,
        })).data
        if (size(data) > 0) {
          const reduxdata = map(data, (item, index) => {
            return { ...item, key: index };
          });
          this.setState({
            pregnancy: { id: data[0].id },
            renderModal: true,
            data: reduxdata,
          });
        } else {
          this.setState({
            pregnancy: null,
          });
        }
      }
    },
  });

  renderBtns = () => {
    return (
      // <Space>
      <>
        {this.renderSubmitBtn()}
        {/* {this.renderPrintBtn()} */}
      </>
      // </Space>
    );
  };

  onOk = () => {
    const { selectRow } = this.state;
    const { formDescriptionsWithoutSection } = this.props;
    const dd = fromApi(cloneDeep(selectRow), formDescriptionsWithoutSection);
    if (isEmpty(selectRow)) {
      message.warning('请选择一份门诊病历');
      return;
    }
    this.form?.setFieldsValue(pickBy(dd, identity));

    this.setState({ renderModal: false });
  };
  renderModal = () => {
    const { renderModal, data } = this.state;
    return (
      <Modal
        title="导入门诊基本信息"
        width={520}
        visible={renderModal}
        onOk={this.onOk}
        onCancel={() => {
          this.setState({ renderModal: false });
        }}
      >
        <Table
          rowSelection={{
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectRow: selectedRows[0] });
            },
          }}
          bordered
          columns={tableColumn}
          dataSource={data}
          pagination={false}
        />
      </Modal>
    );
  };

  renderFreeButton = () => {
    return (
      // <div style={{ position: 'absolute', top: 10, right: 0, zIndex: 99, width: '25.4%' }}>
      <Popconfirm
        title="导入门诊病历可能会覆盖当前已填选项，确定导入吗"
        onConfirm={this.handleFill}
        onCancel={() => { }}
        okText="确定"
        cancelText="取消"
      >
        <Button size="large" type="primary" icon={<SolutionOutlined />}>
          导入门诊病历
        </Button>
      </Popconfirm>
      // </div>
    );
  };
  handleFill = async () => {
    const idType = this.form?.getFieldValue('idType');
    const idNO = this.form?.getFieldValue('idNO');
    const admissionId = mchcUtils.single_id()
    if (!idType || !idNO) {
      message.warning('请输入证件类型或证件号码');
      return;
    }
    const param: Object = {
      idType,
      idNO,
      admissionId
    };
    const OutpatientData = (
      await request.get('/api/getBaseInfoFromOutpatientEmr', {
        params: param,
      })
    ).data
    if (size(OutpatientData) > 0) {
      const reduxdata = map(OutpatientData, (item, index) => {
        return { ...item, key: index };
      });
      this.setState({
        renderModal: true,
        data: reduxdata,
      });
    } else {
      message.warning('暂无门诊病历');
    }
  };

  // Form onValuesChange
  handleItemChange = async (changedValues: any, allValues: any) => {
    const form = this.form as unknown as FormInstance;
    //患者信息 输入身份证号自动生成相关信息
    if (get(allValues, 'idType') === 1 && size(get(changedValues, 'idNO')) === 18) {
      const IdNO = get(changedValues, 'idNO');
      const permanentResidenceAddressNum = IdNO.substr(0, 2);

      const check_result = mchcUtils.checkIdNo_new()
      if (check_result) {
        form?.setFieldsValue({
          dob: check_result.birth,
          age: check_result.age,
          nationality: '中国',
          nativeplace: check_result.province,
          permanentResidenceAddress: check_result.province,
        })
      }

    }

    let currentGestationalWeek;
    /** 根据末次月经计算预产期—B超 和 孕周 */
    // 1、修改末次月经时，如果修订预产期和预产期都为空时，孕周随着末次月经改动
    if (get(changedValues, 'lmp') && this.state.id == undefined) {
      const lmp = formatTimeToDate(get(changedValues, 'lmp'));
      const values = (await request.get(`/api/pregnancyCalc-calcEddByLmp?lmp=${lmp}`)).data;
      currentGestationalWeek = await this.GestationalWeekBySureEdd(values)
      // gestationalWeek = calGestationalWeekBySureEdd(values); 
      form && form.setFieldsValue({ edd: values, sureEdd: values, currentGestationalWeek: currentGestationalWeek });
    }
    //2、 修改修订预产期时，孕周随着修订预产期改动
    if (get(changedValues, 'sureEdd')) {
      if (get(allValues, 'sureEdd') != null) {
        currentGestationalWeek = await this.GestationalWeekBySureEdd(get(changedValues, 'sureEdd'))
        // gestationalWeek = calGestationalWeekBySureEdd(get(changedValues, 'sureEdd'));
        form && form.setFieldsValue({ currentGestationalWeek });
      }
    }
    /** 房号根据床号变化 */
    // 屏蔽阜阳需求
    // if (get(changedValues, 'bedNO')) {
    //   const bedNO = get(allValues, 'bedNO');
    //   const roomNO = bedNO;
    //   form && form.setFieldsValue({ roomNO });
    // }
  };
}
