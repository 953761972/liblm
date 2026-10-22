import { GestationalWeekProjectTree, MyLazyComponent, OkButton } from '@lm_fe/components_m';
import { mchcConfig, mchcEnv, mchcUtils } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { IMchc_Doctor_Diagnoses, IMchc_Doctor_OutpatientHeaderInfo, IMchc_Doctor_RvisitInfoOfOutpatient, IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit, TIdTypeCompatible } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Button, Card, Collapse, Segmented, Space, Timeline } from 'antd';
import classnames from 'classnames';
import { get, isEmpty, join, map, size, slice } from 'lodash';
import React, { useEffect, useState } from 'react';
import Diagnoses from '../../../.components/Diagnoses_New';
import './index.less';
import ManagementPlan from './management-plan';
import PrenatalTree from './prenatal-tree';
import SurveyList from './survey-list';
import WeightGainWarningTips from "./WeightGainWarningTips"
import { FurtherHistory } from '../FurtherTable/FurtherHistory';
import { SideTemplate } from './SideTemplate'
interface IProps {
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
  headerInfo: IMchc_Doctor_OutpatientHeaderInfo
  id: TIdTypeCompatible


  diagnosesList: IMchc_Doctor_Diagnoses[]
  furtherRefresh(): void
  serialNo: string

  setDiagnosesList(list: any[]): void,
  formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,

}
export default function FurtherSidebar(props: IProps) {
  const { sys_theme, config } = use_provoke('sys_theme', 'config')

  const { 医生端_又一个预警提醒 } = config
  const {
    headerInfo,
    id,
    visitsData,
    formData,
    diagnosesList,
    furtherRefresh,
    setDiagnosesList,
    serialNo,
  } = props;

  if (mchcConfig.get('医生端_复诊左侧隐藏'))
    return null

  const [isShowListModal, set_isShowListModal] = useState(false)
  const [isShowManageModal, set_isShowManageModal] = useState(false)
  const [sidebarTab, set_sidebarTab] = useState('诊断')


  const [lackReports, set_lackReports] = useState('')
  const [recentPlanData, set_recentPlanData] = useState<{
    gestationalWeek: any
    remind: any
  }[]>([])

  useEffect(() => {

    getLackReports();

    return () => {

    }
  }, [])
  useEffect(() => {

    const planData = get(visitsData, `visitPlans`, []);

    // set_recentPlanData(slice(planData, 0, 2))
    set_recentPlanData(planData)

    return () => {

    }
  }, [visitsData])



  async function getLackReports(visitsData = props.visitsData) {
    const lackReports = get(visitsData, `lackReports`, []);

    set_lackReports(join(lackReports || [], '，'))
  };

  function closeModal(type: 'isShowManageModal') {


    if (type === 'isShowManageModal') {
      set_isShowManageModal(false)
    }
  };


  function getId() {
    return get(headerInfo, 'id') || id;
  }

  function renderSiderBar() {

    return (
      <div className="sider-container">
        {
          render_tools()
        }
        <div className="main-content">
          {sidebarTab == '诊断' && (
            <div className="prenatal-visit-main_return-sidebar">
              <Collapse destroyOnHidden size='small' defaultActiveKey={['1', '2', '4', '5']} bordered={false}>
                <Collapse.Panel
                  header={
                    <span style={{ marginLeft: '10px' }}>
                      诊断
                    </span>
                  }
                  key="1"
                  id="further-diagnosis"
                >
                  <Diagnoses
                    pv_id_for_diagnose={formData?.id}
                    serialNo={serialNo}
                    setDiagnosesList={setDiagnosesList}
                    headerInfo={headerInfo}
                    diagnosesList={diagnosesList}
                    isAllPregnancies={false}


                    page="return"
                  />
                </Collapse.Panel>

                {
                  医生端_又一个预警提醒
                    ? <Collapse.Panel
                      header={
                        <span >
                          预警提醒
                        </span>
                      }
                      key="5"
                    >
                      <WeightGainWarningTips visitsData={visitsData} />
                    </Collapse.Panel>
                    : null
                }

                <Collapse.Panel
                  header={!!lackReports ? '缺少检验报告' : '必查检验检查'}
                  extra={
                    <OkButton
                      type='dashed'
                      size='small'
                      onClick={(e) => {
                        set_isShowListModal(true)

                        // mchcModal__.open('bf_form', {
                        //   modal_data: {
                        //     title: '必查清单-检验检查',
                        //     history_args: { relationId: getSearchParamsValue('id')! }
                        //   }
                        // })
                      }}
                    >
                      必查清单
                    </OkButton>
                  }
                  key="2"
                  id="further-check-item"
                >
                  <GestationalWeekProjectTree pregnancyId={mchcUtils.single_id()} />
                </Collapse.Panel>


                {
                  mchcEnv.is('广三') || <Collapse.Panel
                    header={'产检计划'}
                    extra={
                      <OkButton
                        type='dashed'
                        size='small'
                        onClick={(e) => set_isShowManageModal(true)}
                      >
                        产检管理
                      </OkButton>
                    }
                    key="4"
                  >
                    {size(recentPlanData) > 0 ? (
                      <Timeline className="plan-timeline" mode="left">
                        {map(recentPlanData, (item) => (
                          <Timeline.Item>
                            <div>{item.gestationalWeek}孕周</div>
                            <div>{item.remind}</div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      '暂无产检计划~'
                    )}
                  </Collapse.Panel>
                }
              </Collapse>
            </div>
          )}
          {sidebarTab == '产检树' && (
            <div className="prenatal-tree-content">
              <PrenatalTree id={getId()} ></PrenatalTree>
            </div>
          )}
          {sidebarTab == '历史' && (

            <FurtherHistory visitsData={visitsData} />
          )}
          {sidebarTab == '模板' && (

            <SideTemplate />
          )}
        </div>

      </div>
    )
  };
  function render_tools() {
    return <Segmented size='small' value={sidebarTab} block onChange={set_sidebarTab} options={['诊断', '产检树', '历史', '模板']} />
  }

  return (
    <Card size='small' styles={{
      body: {
        padding: 0,
        height: '100%'
      }
    }} style={{ width: 270, height: '100%', marginRight: 8, overflow: 'auto' }}>

      <MyLazyComponent size='middle'>
        {renderSiderBar()}

        {isShowListModal && (
          <SurveyList
            headerInfo={headerInfo}
            isAllPregnancies={false}
            furtherRefresh={furtherRefresh}
            isShowListModal={true}
            closeModal={() => {
              set_isShowListModal(false)
            }}
          />
        )}
        {isShowManageModal && (
          <ManagementPlan
            isShowManageModal={isShowManageModal}
            headerInfo={headerInfo}
            closeModal={closeModal}
          />
        )}

      </MyLazyComponent>
    </Card>
  );
}
