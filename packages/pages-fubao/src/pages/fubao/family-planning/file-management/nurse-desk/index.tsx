import {
  BaseEditPanel,
  fromApi as defaultFromApi,
  toApi as defaultToApi,
  formDescriptionsWithoutSectionApi,
  resolveFubaoPath
} from '@lm_fe/components_m';
import { SLocal_History, SMchc_FormDescriptions } from '@lm_fe/service';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import dayjs from 'dayjs';
import { get, set } from 'lodash';
import Form from './components/Form';

class FamilyPlanning_FileManagement_NurseDesk extends BaseEditPanel {
  static defaultProps = {
    baseUrl: '/api/family/planning/addFamilyPlanningFile', request,
    moduleName: 'family-planning-basic',
    title: '档案信息',
    Form,
  };

  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    const { routerQuery, moduleName, fromApi = defaultFromApi, user, system } = this.props as any;
    const id = get(this.props, 'id') || getSearchParamsValue('id')
    // 获取配置文件
    const formDescriptions = await SMchc_FormDescriptions.getModuleParseCache(moduleName);
    this.setState({ spinning: false });

    const formDescriptionsWithoutSection = formDescriptionsWithoutSectionApi(formDescriptions);
    let data = id ? (await request.get(`/api/family/planning/getFamilyPlanningFile/page?id.equals=${id}`)).data : {};
    if (data) {
      data = get(data, 'data.pageData.0');
    }
    data = id ? fromApi(data, formDescriptionsWithoutSection) : {};
    const formKey = get(data, 'id') || Math.random();

    if (!get(data, 'testingFacility')) set(data, 'testingFacility', get(system, 'config.hospitalName'));
    if (!get(data, 'registerDate')) set(data, 'registerDate', dayjs(new Date()));
    if (!get(data, 'registerPerson')) set(data, 'registerPerson', get(user, 'basicInfo.firstName'));
    this.setState({ formDescriptions, formDescriptionsWithoutSection, data, formKey });
  };

  handleSubmit = async (values: any) => {
    const { formDescriptionsWithoutSection } = this.state as any;
    const {
      toApi = defaultToApi,
      history,
      baseUrl,
      deleteTab,
      routerPath,
      keepAliveProviderRef,
      updateTabs,
      tabs,
    } = this.props as any;
    let params = await toApi(values, formDescriptionsWithoutSection);

    params = {
      ...params,
      fileState: 1,
    };

    if (get(values, 'id')) {
      // 修改档案
      const res = await request.put('/api/family/planning/updateFamilyPlanningFile', params);

    } else {
      //新增档案
      const res = (await request.post(baseUrl, params)).data
      if (get(res, 'code') === 1) {


        //删除keepAliveProvider缓存
        // await updateTabs(get(tabs, `tabsMapping./family-planning/file-management/list`));
        // routerPath && (await deleteTab(routerPath));
        // fubaoHistoryPush('/family-planning/file-management/list', this.props as any);
        // const { path, search } = get(tabs, `tabsMapping.${routerPath}`);
        // keepAliveProviderRef?.current.removeCache(`${path}.name.${search}`);
        SLocal_History.closeAndPush(resolveFubaoPath('/family-planning/file-management/list'))

      } else {

      }
    }
  };
}
export default FamilyPlanning_FileManagement_NurseDesk
