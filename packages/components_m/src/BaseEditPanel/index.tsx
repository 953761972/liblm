import React from 'react';
import { get } from 'lodash';
import { FormInstance, message } from 'antd';
import {
  formDescriptionsWithoutSectionApi,
  fromApi as defaultFromApi,
  toApi as defaultToApi,
} from '../utils/adapter';
import { getSearchParamsValue, request, Request } from '@lm_fe/utils';
import observePatientData from '../utils/observePatientData';
import styles from './less/index.module.less';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import BaseEditPanelForm from './BaseEditPanelForm';
export interface BaseEditPanelIProps {
  routerQuery?: any;
  moduleName?: string;
  title?: string;
  baseUrl: string;
  fromApi?: any;
  toApi?: any;
  Form: typeof BaseEditPanelForm;
  size?: SizeType
  request?: Request
  isHospitalRegistrationOnceSaved?: any
  changeTitleOfTabs?: any
  deliverFormToFather?: any
}
export default class BaseEditPanel<T extends BaseEditPanelIProps = BaseEditPanelIProps> extends React.PureComponent<T> {
  // formRef = React.createRef(null);

  state = {
    data: {},
    formDescriptionsWithoutSection: {},
    formDescriptions: [],
    formKey: undefined,
    spinning: true,
  };
  _request = request
  async componentDidMount() {

    const { moduleName, baseUrl, fromApi = defaultFromApi } = this.props;
    this._request = this.props.request || this._request
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
    const id = get(this.props, 'id') || getSearchParamsValue('id');
    // 未配置moduleName时，不请求配置
    if (!moduleName) {
      return;
    }
    // 请求表单配置表
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
    // const formDescriptions = formDescriptionsFromApi(formField);
    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    this.setState({ formDescriptions, formDescriptionsWithoutSection, spinning: false });
    // 请求表单值
    const values = id ? (await this._request.get(`${baseUrl}/${id}`)).data : {};
    const data = id ? fromApi(values, formDescriptionsWithoutSection) : {};
    const formKey = get(data, 'id') || Math.random(); // 当前dataSource id
    this.setState({ data, formKey });
  }

  // 卸载的时候取消订阅
  componentWillUnmount() {
    observePatientData.unSubscribe();
  }

  handleSubmit = async (values: any) => {
    const { data, formDescriptionsWithoutSection } = this.state;
    const { toApi = defaultToApi, baseUrl, title } = this.props;
    const params = await toApi(
      {
        ...data,
        ...values,
      },
      formDescriptionsWithoutSection,
    );
    let newData = null;
    if (get(values, 'id')) {
      newData = (await this._request.put(baseUrl, params)).data;
      message.success(`修改${title}成功`);
    } else {
      newData = (await this._request.post(baseUrl, params)).data;
      message.success(`新增${title}成功`);
    }
    this.setState({ data: newData });
  };
  handleSave = async (values: any) => {
    const { data, formDescriptionsWithoutSection } = this.state;
    const { toApi = defaultToApi, baseUrl, title } = this.props;
    const params = await toApi(
      {
        ...data,
        ...values,
      },
      formDescriptionsWithoutSection,
    );
    let newData = null;
    if (get(values, 'id')) {
      newData = (await (this._request.put(baseUrl, params))).data;
      message.success(`修改${title}成功`);
    } else {
      newData = (await this._request.post(baseUrl, params)).data;
      message.success(`新增${title}成功`);
    }
    this.setState({ data: newData });
  };
  renderOtherModal = () => { };

  extraEvents = {
    /** 额外的事件 */
  };
  formRef: { form?: FormInstance } | null = null
  deliverFormToFather(el: any) { }
  render() {
    const { Form, printTemplate = '', printResource = '', history, targetLabelCol, ...rest } = this.props;
    const { formDescriptions, formDescriptionsWithoutSection, data, formKey, spinning } = this.state;
    return (
      <div className={styles["base-edit-panel"]} style={{ background: '#fff' }}>
        <Form
          targetLabelCol={targetLabelCol}
          {...rest}
          key={formKey}
          ref={(ref: any) => (this.formRef = ref)}
          spinning={spinning}
          printId={get(data, 'id')}
          printResource={printResource}
          printTemplate={printTemplate}
          data={data}
          onSave={this.handleSave}
          onFinish={this.handleSubmit}
          formDescriptions={formDescriptions}
          formDescriptionsWithoutSection={formDescriptionsWithoutSection}
          extraEvents={this.extraEvents}
          history={history}
          isHospitalRegistrationOnceSaved={this.props.isHospitalRegistrationOnceSaved}
          changeTitleOfTabs={this.props.changeTitleOfTabs}
          deliverFormToFather={this.deliverFormToFather}
        />
        {this.renderOtherModal()}
      </div>
    );
  }
}
