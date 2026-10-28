import React, { useEffect, useState } from 'react';
import BasicInfo from '../../file-management/nurse-desk';
import FirstVisit from './components/FirstVisitv2';
import MedicalSummary from './components/MedicalSummary';
import SurgicalRecord from './components/SurgicalRecordv2';
// import FollowUp from './components/FollowUp';
// import InformedConsent from '../../../premarital-care/.public-exam/InformedConsent';
import { HistoryOutlined } from '@ant-design/icons';
import { PanelWithChildFC } from '@lm_fe/components_m';
import { DoctorEnd_ImageReport, DoctorEnd_SurveyReport } from '@lm_fe/pages-mchc';
import { SLocal_State } from '@lm_fe/service';
import { getSearchParamsValue, fubaoRequest as request } from '@lm_fe/utils';
import { get } from 'lodash';
import AppointModal from './AppointModal';
import styles from './index.module.less';

export default function FamilyPlanning_FileManagement_DoctorDesk_FC(props: any) {
  const id = props.id ?? getSearchParamsValue('id')
  const basicInfo = SLocal_State.getUserData()
  const surgicalRecordId = getSearchParamsValue('surgicalRecordId')

  const [data, setData] = useState<any>()
  const [renderModal, setRenderModal] = useState(false)
  const [activeKey, setActiveKey] = useState(getSearchParamsValue('activeKey') ?? 'MedicalSummary')
  const [domain, setDomain] = useState<any>()

  useEffect(() => {

    (async () => {

      let data: any;

      data = id ? (await request.get(`/api/family/planning/getFamilyPlanningFile/page?id.equals=${id}`)).data : {};
      //获取产科部署地址及端口API
      let res = (await request.get(`/api/family/planning/getObstetricsApi`)).data;

      if (data) {
        data = get(data, 'data.pageData.0');
      }
      setData(data)
      setDomain(get(res, 'data'))

    })()
    return () => {

    }
  }, [id])
  async function handleClickTab(key: any) {
    const login = SLocal_State.userData?.login
    if (key === 'cqzd') {
      const prenatalDiagnosisUrl = `http://${domain}/single/pd?moduleName=prenatalDiagnosisV2&patId=${get(
        data,
        'outpatientNo',
      )}&empId=${login}`;
      window.open(prenatalDiagnosisUrl, '_blank');
    } else if (key === 'wcbj') {
      const prenatalVisitUrl = `http://${domain}/single/obout?patId=${get(data, 'outpatientNo')}&empId=${login}`;
      window.open(prenatalVisitUrl, '_blank');
    } else {
      setActiveKey(key)
    }
  };
  return <div className={styles["hj-desk"]}>
    <PanelWithChildFC
      activeKey={activeKey}
      setActiveKey={handleClickTab}
      headerItems={[
        { title: '姓名', value: data?.name },
        { title: '性别', value: '女' },
        { title: '年龄', value: data?.age },
        { title: '门诊号', value: data?.outpatientNo },
      ]}
      tabItems={[
        { key: 'MedicalSummary', title: '病历摘要', node: <MedicalSummary id={id} basicInfo={basicInfo} data={data} /> },
        { key: 'FirstVisit', title: '专科病历', node: <FirstVisit outpatientNo={data?.outpatientNo} id={id} basicInfo={basicInfo} data={data} /> },
        { key: 'SurgicalRecord', title: '手术病历', node: <SurgicalRecord outpatientNo={data?.outpatientNo} id={id} basicInfo={basicInfo} basicData={data} surgicalRecordId={surgicalRecordId} /> },
        // { key: 'jyjc', title: '检验检查', node: <SurveyReport headerInfoOfInpatientData={data} /> },
        // { key: 'yxbg', title: '影像报告', node: <ImageReport headerInfoOfInpatientData={data} /> },

        { key: 'jyjc', title: '检验检查', node: <DoctorEnd_SurveyReport headerInfo={data} /> },
        { key: 'yxbg', title: '影像报告', node: <DoctorEnd_ImageReport headerInfo={data} /> },
        // { key: 'wsgl', title: '文书管理', node: <InformedConsent id={id} /> },
        // { key: 'xjsf', title: '宣教随访', node: <FollowUp /> },
        { key: 'BasicInfo', title: '基本信息', node: <BasicInfo id={id} basicInfo={basicInfo} data={data} /> },
        // { key: 'wcbj', title: '围产保健', node: null },
        // { key: 'cqzd', title: '产前诊断', node: null },
      ]}
    />
    <div className={styles["operation-appointment"]} onClick={() => setRenderModal(true)}>
      <div className={styles["title"]}>手术预约</div>
      <div className={styles["icon"]}><HistoryOutlined style={{ color: '#fff', fontSize: 22 }} /></div>
    </div>
    {renderModal && <AppointModal visible={renderModal} onCancel={() => setRenderModal(false)} basicData={data} />}
  </div>
}
