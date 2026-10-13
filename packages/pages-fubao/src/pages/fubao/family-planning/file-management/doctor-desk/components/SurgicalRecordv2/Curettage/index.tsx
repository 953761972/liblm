import { BaseEditPanel, formDescriptionsWithoutSectionApi } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { SMchc_FormDescriptions } from '@lm_fe/service';
import { fubaoRequest as request } from '@lm_fe/utils';
import { message } from 'antd';
import dayjs from 'dayjs';
import { get, isEmpty, isEqual, set } from 'lodash';
import { valueToApi, valueToForm } from '../adapter';
import Form from './components/Form';
export default class AdmissionPanel extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/family/planning/addEarlyPregnancyCheckSurgicalType', request,
    moduleName: 'family-planning-detail-surgical',
    title: '刮宫术',
    Form,
  };

  state = {
    data: {},
    formDescriptionsWithoutSection: {},
    formDescriptions: [],
    formKey: undefined,
    spinning: true,
    activeItem: {},
    activeTemplate: '',
    printId: '',
  };

  extraEvents = {
    //打印
    handlePrint: () => {
      this.handlePrint()
    },
  };




  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { activeItem, activeTemplate } = nextProps;
    if (!isEqual(activeItem, prevState.activeItem)) {
      return {
        activeItem,
        activeTemplate,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (
      !isEmpty(get(prevState, 'activeItem')) &&
      !isEqual(get(prevState, 'activeItem'), get(this.state, 'activeItem'))
    ) {
      this.handleInit();
    }
  }

  async componentDidMount() {
    const { moduleName } = this.props as any;
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    const formKey = Math.random();
    this.setState({ spinning: false });
    this.setState({ formDescriptions, formDescriptionsWithoutSection, formKey });
    this.handleInit();
  }

  handleInit = async () => {
    const { activeItem, formDescriptionsWithoutSection } = this.state;
    const { basicInfo, basicData } = this.props as any;
    let values = {};
    if (get(activeItem, 'id')) {
      values = (await request.get(
        `/api/family/planning/getEarlyPregnancyCheckSurgicalType?id.equals=${get(
          activeItem,
          'id',
        )}&operationName.equals=${get(activeItem, 'operationName')}&deleteFlag.equals=0`,
      )).data;
    }
    values = get(values, 'data.0');
    let data = values ? valueToForm(values, formDescriptionsWithoutSection) : {};
    const formKey = get(data, 'id') || Math.random();

    if (!get(data, 'operationName')) set(data, 'operationName', '刮宫术');
    if (!get(data, 'surgicalDate')) set(data, 'surgicalDate', dayjs(new Date()));
    if (!get(data, 'appointmentPeople')) set(data, 'appointmentPeople', get(basicInfo, 'firstName'));
    if (!get(data, 'surgicalDoctor')) set(data, 'surgicalDoctor', get(basicInfo, 'firstName'));
    this.setState({ data, formKey, printId: get(data, 'id') });
  };

  handleSubmit = async (values: any) => {
    const { onRefresh, id, baseUrl } = this.props as any;
    const { data, formDescriptionsWithoutSection } = this.state;
    const preoperativeExamination = get(data, 'preoperativeExamination');
    let params = valueToApi(values, formDescriptionsWithoutSection);

    //每个对象有id 都要传回去
    set(params, 'preoperativeExamination.id', get(preoperativeExamination, 'id'));

    params = {
      ...data,
      ...params,
      familyPlanningId: Number(id),
      progressStatus: 4, //已完成
    };

    if (!get(params, 'operationTimeEnd')) {
      mchcEnv.error('手术起止时间是必填项');
      return;
    }

    if (get(values, 'id')) {
      // 修改
      const res = (await request.put('/api/family/planning/updateEarlyPregnancyCheckSurgicalType', params)).data;
      if (get(res, 'code') === 1) {
        mchcEnv.success(get(res, 'msg'), 0.5).then(() => {
          //点击打印按钮保存数据并打印
          if (get(values, 'isPrint')) {
            this.handlePrint(get(res, 'data.id'))

          }
        });
      } else {

      }
    } else {
      //新增
      params = {
        ...params,
        familyPlanningId: Number(id),
        progressStatus: 4,
      };
      const res = (await request.post(baseUrl, params)).data;
      if (get(res, 'code') === 1) {
        mchcEnv.success(get(res, 'msg'), 0.5).then(() => {
          //点击打印按钮保存数据并打印
          if (get(values, 'isPrint')) {
            this.handlePrint(get(res, 'data.id'))

          }
        });
      } else {

      }
    }
    onRefresh && onRefresh();
  };
  //打印
  handlePrint(id = this.state.printId) {
    const { printId, activeTemplate } = this.state;

    mchcModal__.open('print_modal', {
      modal_data: {
        request,
        requestData: {
          url: '/api/family/planning/casePdfPreview',
          resource: activeTemplate,
          template: '',
          version: '',
          note: '',
          id,
        }
      }
    })
  }
  renderOtherModal = () => {
    return null;
  };
}
