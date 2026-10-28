import { LoadingPlaceholder, PanelWithChild, PanelWithChildFC } from '@lm_fe/components_m';
import React, { useEffect, useState } from 'react';
import BasicInfo from '../../../gynecological-diseases/two-cancers/edit';
import CervicalCarcinoma from './components/CervicalCarcinoma';
import MammaryCancer from './components/MammaryCancer';
// import SurveyReport from './components/SurveyReport';
// import ImageReport from './components/ImageReport';
import { DoctorEnd_ImageReport, DoctorEnd_SurveyReport } from '@lm_fe/pages-mchc';

import { getSearchParamsAll, getSearchParamsValue, fubaoRequest as request, sleep } from '@lm_fe/utils';
import { get } from 'lodash';
import { mchcLogger } from '@lm_fe/env';
import { Result } from 'antd';

export default function TowCancerExam(props: any) {
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState<any>()
  const id = getSearchParamsValue('id')!;
  const cervicalCancerScreeningId = getSearchParamsValue('cervicalCancerScreeningId');
  const breastCancerScreeningId = getSearchParamsValue('breastCancerScreeningId');
  const breastCancerXRayId = getSearchParamsValue('breastCancerXRayId');
  async function fetch_data() {



    if (id) {
      let _data = id ? (await request.get(`/api/two/cancer/screening/getTwoCancerScreeningFile/page?id.equals=${id}`, { unboxing: true })).data : {};
      return get(_data, 'pageData.0') ?? {}
    }

    if (__DEV__) {
      await sleep(2 * 1000)
      return null
    }


    return (await request.post<{ twoCancerScreening: any }>(`/api/two/cancer/screening/login`, getSearchParamsAll())).data?.twoCancerScreening

  }


  useEffect(() => {

    fetch_data().then(res => {
      mchcLogger.log('fetch', { res })
      setData(res)

    })
    return () => {

    }
  }, [])



  const empty_node = loading ? <LoadingPlaceholder /> : <Result status="warning" title="请先建档" extra={null} />

  return data ? <div style={{ height: '100%', }}>


    {
      <PanelWithChildFC

        headerItems={
          [
            { title: '姓名', value: get(data, 'name') },
            { title: '年龄', value: get(data, 'age') },
            { title: '门诊号', value: get(data, 'outpatientNo') },
            // { title: '联系电话', value: get(data, 'gynecologicalPatient.telephone') },
          ]
        }

        tabItems={[





          {
            key: 'CervicalCarcinoma', title: '宫颈癌', node: <CervicalCarcinoma id={data.id} basicData={data} cervicalCancerScreeningId={cervicalCancerScreeningId}
            />
          },
          {
            key: 'MammaryCancer', title: '乳腺癌', node: <MammaryCancer id={data.id} basicData={data} breastCancerScreeningId={breastCancerScreeningId} breastCancerXRayId={breastCancerXRayId}
            />
          },
          { key: 'SurveyReport', title: '检验检查', node: <DoctorEnd_SurveyReport fubao headerInfo={data as any} /> },
          { key: 'ImageReport', title: '影像报告', node: <DoctorEnd_ImageReport fubao headerInfo={data as any} /> },
          // { key: 'InformedConsent', title: '', node: <InformedConsent /> },
          { key: 'BasicInfo', title: '基本信息', node: <BasicInfo id={data.id} basicData={data} /> },
        ]}
      />
    }
  </div> : empty_node
}
