import { deleteTab } from "@/actions/tabs";
import { CustomModal } from "@/components/antd-design/tipModal";
import BaseEditPanel from "@/components/BaseEditPanel";
import { request } from "@lm_fe/utils";

import getFormDescriptions from "@/lib/request/getFormDescriptions";
import {
  fromApi as defaultFromApi,
  formDescriptionsFromApi,
  formDescriptionsWithoutSectionApi,
} from "@/utils/adapter";
import observePatientData from "@/utils/observePatientData";
import { message } from "antd";
import { get } from "lodash";
import React from "react";
import { connect } from "react-redux";
import Form from "./components/Form";
import { fromApi, toApi } from "./config/adapter";
import { BaseEditPanelIProps } from "@lm_fe/components_m";
import { mchcEnv } from "@lm_fe/env";

class AdmissionPanel extends BaseEditPanel {
  static defaultProps = {
    baseUrl: "/api/getBaseInfoOfInpatientEmr",
    moduleName: "admission",
    title: "入院登记",
    toApi,
    fromApi,
    Form,
    needEditModal: true,
  };

  state = {
    data: {},
    formDescriptionsWithoutSection: {},
    formDescriptions: [],
    formKey: undefined,
    spinning: true,
    admissionId: "",
    addModalVisible: false, //新增保存后弹框
    editModalVisible: false, //编辑保存后弹框
  };

  async componentDidMount() {
    const { routerQuery, moduleName, baseUrl, fromApi = defaultFromApi } = this.props;

    // 订阅从 panel 获取的数据
    observePatientData.subscribe((data: any) => {
      const { data: prevData } = this.state;
      this.setState({
        data: {
          ...prevData,
          ...data,
        },
      });
    });
    // 优先从 props 里面获取id，因为可能作为组件，被其它页面引用使用
    const id = get(this.props, "id") || get(routerQuery, "id");
    // 未配置moduleName时，不请求配置
    if (!moduleName) {
      return;
    }
    // 请求表单配置表
    const formField = await getFormDescriptions(moduleName);
    const formDescriptions = formDescriptionsFromApi(formField);
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    this.setState({ formDescriptions, formDescriptionsWithoutSection, spinning: false });
    // 请求表单值
    const values = id ? (await request.get(`${baseUrl}?id=${id}`)).data : {};
    const data = id ? fromApi(values, formDescriptionsWithoutSection) : {};
    const formKey = get(data, "id") || Math.random(); // 当前dataSource id
    this.setState({ data, formKey });
  }

  async componentWillReceiveProps(nextProps: Readonly<BaseEditPanelIProps>, nextContext: any) {
    const is_single = mchcEnv.is_single;
    const { id: nextId } = nextProps;
    const { id: prevId, baseUrl, fromApi = defaultFromApi } = this.props;
    const { formDescriptionsWithoutSection } = this.state;
    if (is_single && !prevId && nextId) {
      const values = await request.get(`${baseUrl}?id=${nextId}`);
      const data = fromApi(values.data, formDescriptionsWithoutSection);
      const formKey = get(data, "id") || Math.random(); // 当前dataSource id
      this.setState({ data, formKey });
    }
  }

  deliverFormToFather = (ref) => {
    this.child = ref;
  };

  //新增保存后 继续新增
  handleContinueAdd = () => {
    const child = this.child;
    child.handleReset();
    this.setState({ addModalVisible: false });
  };

  //新增保存后 点击'查看'跳转回列表对应查看页
  handleViewAfterAdd = () => {
    const { admissionId } = this.state;
    const { deleteTab, history, routerPath } = this.props;
    this.setState({ addModalVisible: false });
    history.push(`/deliver-management-v2/admission/deliver-edit?id=${admissionId}`);
    routerPath && deleteTab(routerPath);
  };

  // 编辑保存后 继续编辑
  handleContinueEdit = () => {
    this.setState({ editModalVisible: false });
  };

  // 编辑成功后 点击'查看'跳转回列表对应查看页
  handleViewEdit = () => {
    const { admissionId } = this.state;
    const { deleteTab, history, routerPath } = this.props;
    this.setState({ editModalVisible: false });
    history.push(`/deliver-management-v2/admission/deliver-edit?id=${admissionId}`);
    routerPath && deleteTab(routerPath);
  };

  handleSubmit = async (values: any) => {
    const { data, formDescriptionsWithoutSection } = this.state;
    const { toApi, title, routerQuery, deleteTab, history, routerPath, reload } = this.props as any;
    let param = {
      ...data,
      ...values,
    };
    if (this.formRef.state?.pregnancy) {
      param.pregnancy = this.formRef.state.pregnancy;
    }
    const paramsPre = await toApi(param, formDescriptionsWithoutSection);
    const params = { ...paramsPre, areaNO: get(paramsPre, "areaName") };
    if (values.id) {
      // 编辑
      const data = (await request.put("/api/updateBaseInfoOfInpatientEmr", params)).data;
      if (this.props.needEditModal) {
        const admissionId = get(data, "id");
        this.setState({ admissionId });
        this.setState({ editModalVisible: true });
      } else {
        message.success(`修改${title}成功`);
      }

      // Modal.confirm({
      //   title: `修改${title}成功, 返回列表页面吗？`,
      //   icon: <CheckCircleTwoTone />,
      //   onOk() {
      //     history.push('/deliver-management/admission/list');
      //     routerPath && deleteTab(routerPath);
      //   },
      // });
    } else {
      // 新增
      const data = (await request.post("/api/newInpatientEmr", params)).data;
      const admissionId = get(data, "id");
      this.setState({ admissionId });
      this.setState({ addModalVisible: true });
      // const child = this.child;
      // message.success(`新增${title}成功`);
      // Modal.confirm({
      //   title: `新增${title}成功, 返回列表页面吗？`,
      //   icon: <CheckCircleTwoTone />,
      //   onOk() {
      //     child.handleReset();
      //   },
      // });
    }
    reload && reload();
  };

  renderOtherModal = () => {
    return (
      <>
        {/* 新增 */}
        <CustomModal
          CustomModalVisible={this.state.addModalVisible}
          leftButtonText="继续新增"
          handleContinue={this.handleContinueAdd} //新增保存后 继续新增
          handleView={this.handleViewAfterAdd} //新增保存后 点击查看
          handleCancel={() => { }}></CustomModal>

        {/* 编辑 */}
        <CustomModal
          CustomModalVisible={this.state.editModalVisible}
          leftButtonText="继续编辑"
          handleContinue={this.handleContinueEdit}
          handleView={this.handleViewEdit}
          handleCancel={() => { }}></CustomModal>
      </>
    );
  };
}
export default connect(null, { deleteTab })(AdmissionPanel);
