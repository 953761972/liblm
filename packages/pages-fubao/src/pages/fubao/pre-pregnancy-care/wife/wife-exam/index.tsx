import React from 'react';
import PhysicalExamination from '../../.public-exam/PhysicalExamination';
import MedicalHistory from '../../.public-exam/MedicalHistory';
import BasicInfo from '../../.public-exam/BasicInfo';
import SecondSex from '../../.public-exam/SecondSex';
import Inspection from '../../.public-exam/Inspection/inspection-exam';
import GuidanceEvaluation from '../../.public-exam/GuidanceEvaluation';
// import InformedConsent from '../../.public-exam/InformedConsent';
// import CaseReport from '../../.public-exam/CaseReport';
import { Button, Space, message, Modal } from 'antd';
import { get, map, set } from 'lodash';
import { fubaoRequest as request } from '@lm_fe/utils';
import classnames from 'classnames';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './index.less';
import { fubaoHistoryPush, OkButton, PanelTitle } from '@lm_fe/components_m';
import { PanelWithChild } from '@lm_fe/components_m';
import { getSearchParamsValue } from '@lm_fe/utils';
import { DoctorEnd_ImageReport, DoctorEnd_SurveyReport } from '@lm_fe/pages-mchc';
import ReportEntryInner from 'src/pages/fubao/report-entry/reports';
export default class panel extends PanelWithChild {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {},
      activeKey: '',
      bol: false,
      tabs: [
        {
          key: 'BasicInfo',
          title: '基本信息',
        },
        {
          key: 'MedicalHistory',
          title: '病史情况',
        },
        {
          key: 'PhysicalExamination',
          title: '体格检查',
        },
        {
          key: 'SecondSex',
          title: '第二性征',
        },
        {
          key: 'Inspection',
          title: '检验检查',
        },
        {
          key: 'GuidanceEvaluation',
          title: '指导/评估',
        },
        // {
        //   key: 'SurveyReport',
        //   title: '检验报告',
        // },
        // {
        //   key: 'ImageReport',
        //   title: '影像报告',
        // },
        {
          key: 'ReportEntry',
          title: '报告查看',
        },
        // {
        //   key: 'InformedConsent',
        //   title: '文书管理',
        // },
        // {
        //   key: 'CaseReport',
        //   title: '个案登记',
        // },
      ],
    };
  }

  async componentDidMount() {
    const id = getSearchParamsValue('id')

    let data = (
      await request.get(
        `/api/progestation/check/getByProgestationCheckArchivesId?progestationCheckArchivesId.equals=${id}&childrenSign.equals=0`,
      )
    ).data;
    const activeKey = get(this.props, 'routerQuery.activeKey') || 'BasicInfo';
    if (data) {
      data = get(data, 'data');
    }
    this.setState({
      data,
      activeKey,
    });
  }

  onRef = (ref: any) => {
    this.child = ref;
  };

  renderHeader = () => {
    const { data } = this.state;
    const f_vm = get(data, 'manProgestationCheckArchivesDetailVM')
    const h = [
      { title: '姓名', value: get(data, 'womanName') },
      { title: '性别', value: '女' },
      { title: '年龄', value: get(data, 'womanAge') },
      { title: '门诊号', value: get(data, 'womanOutpatientNo') },
      { title: '男方姓名', value: get(data, 'manName') },
      f_vm && {
        title: '男方病历', value: <OkButton type="primary" onClick={() => { this.handleClickButton(); }} btn_text='打开' />
      },
    ]
    return (
      <PanelTitle headerItems={h} />
    );

  };

  handleJump = () => {
    const id = getSearchParamsValue('id')
    const { history } = this.props as any;
    fubaoHistoryPush(`/pre-pregnancy-care/file-management/edit?id=${id}`, this.props as any);
    Modal.destroyAll();
  };

  handleClickButton = () => {
    const { data } = this.state;
    const id = getSearchParamsValue('id')
    const { history } = this.props as any;
    if (get(data, 'manProgestationCheckArchivesDetailVM')) {
      fubaoHistoryPush(`/pre-pregnancy-care/husband/husband-exam?id=${id}`, this.props as any);
    } else {
      Modal.error({
        title: '配偶暂未建档，请完善配偶档案信息',
        content: (
          <div>
            <Button
              type="primary"
              onClick={() => {
                this.handleJump();
              }}
            >
              去完善配偶档案信息
            </Button>
          </div>
        ),
        onOk() { },
      });
    }
  };

  subscribeHandleItemChange = (bol: boolean = false) => {
    this.setState({
      bol,
    });
  };

  handleClickTab = (newActiveKey: any) => async () => {
    this.setState({
      activeKey: newActiveKey,
    });
  };

  handleChangeTabs = (key: any, icon: any) => {
    const { tabs } = this.state;
    map(tabs, (item, index) => {
      if (key === item.key) {
        set(item, 'icon', icon);
      }
    });
    this.setState({ tabs });
  };

  getIcon = (tab: any) => {
    const { activeKey } = this.state;
    if (get(tab, 'icon')) {
      if (get(tab, 'icon') === 'error') {
        return <ExclamationCircleOutlined style={{ position: 'relative', top: 1, color: '#ff0000' }} />;
      } else {
        return <CheckCircleOutlined style={{ position: 'relative', top: 1, color: '#0e318d' }} />;
      }
    } else {
      if (activeKey === tab.key) {
        return <div className={PanelWithChild.styles["circle-icon"]}></div>;
      }
    }
    return null;
  };

  renderTabs = () => {
    const { activeKey, tabs } = this.state;

    return (
      <div className={PanelWithChild.styles["panel-with-child-desk-tabs"]}>
        {map(tabs, (tab) => (
          <div
            key={tab.key}
            onClick={this.handleClickTab(tab.key)}
            className={classnames(PanelWithChild.styles["panel-with-child-desk-tabs-item"], {
              [PanelWithChild.styles['panel-with-child-desk-tabs-item-active']]: activeKey === tab.key,
            })}
          >
            <Space>
              {this.getIcon(tab)}
              {tab.title}
            </Space>
          </div>
        ))}
      </div>
    );
  };

  renderContent = () => {
    const id = getSearchParamsValue('id')
    const { data, activeKey } = this.state;
    const sex_data = get(data, 'womanProgestationCheckArchivesDetailVM')

    return (
      <div className={classnames(PanelWithChild.styles["panel-with-child-desk"], 'hj-desk')}>
        {this.renderTabs()}
        <div className={PanelWithChild.styles["panel-with-child-desk-content"]}>
          {activeKey === 'BasicInfo' && (
            <BasicInfo
              moduleName="wife-pre-pregnancy-care-basic-info"
              filesData={data}
              handleClickTab={this.handleClickTab}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {activeKey === 'MedicalHistory' && (
            <MedicalHistory
              moduleName="wife-pre-pregnancy-care-medical-history"
              filesData={data}
              handleClickTab={this.handleClickTab}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {activeKey === 'PhysicalExamination' && (
            <PhysicalExamination
              moduleName="wife-pre-pregnancy-care-physical-exam"
              filesData={data}
              handleClickTab={this.handleClickTab}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {activeKey === 'SecondSex' && (
            <SecondSex
              moduleName="wife-pre-pregnancy-care-second-sex"
              filesData={data}
              handleClickTab={this.handleClickTab}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {activeKey === 'Inspection' && (
            <Inspection
              moduleName="wife-pre-pregnancy-care-inspection-results"
              filesData={data}
              handleClickTab={this.handleClickTab}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {activeKey === 'GuidanceEvaluation' && (
            <GuidanceEvaluation
              moduleName="wife-pre-pregnancy-care-guidance"
              filesData={data}
              handleChangeTabs={this.handleChangeTabs}
              subscribeHandleItemChange={this.subscribeHandleItemChange}
              id={id}
              type="wife"
              onRef={this.onRef}
            />
          )}
          {/* {activeKey === 'InformedConsent' && <InformedConsent />}
          {activeKey === 'CaseReport' && <CaseReport />} */}
          {activeKey === 'SurveyReport' && <DoctorEnd_SurveyReport fubao headerInfo={data as any} />}
          {activeKey === 'ImageReport' && <DoctorEnd_ImageReport fubao headerInfo={data as any} />}
          {activeKey === 'ReportEntry' && <ReportEntryInner injected idNO={sex_data?.progestationCheckArchivesBasicInformation?.idNO} />}

        </div>
      </div>
    );
  };
}
