import { DoctorEnd_ImageReport_Report } from '@lm_fe/components_m';
import React, { useEffect, useState } from 'react';

import { get } from 'lodash';
import { api } from '../.api';
// import aImg from '@/assets/imgs/images/a.jpg';
// import bImg from '@/assets/imgs/images/b.png';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_Doctor_OutpatientHeaderInfo } from '@lm_fe/service';
import { filter_obj_to_url_search } from '@lm_fe/utils';
import './index.less';
import { IDoctorEnd_ImageReport_Props } from './types'

const ignore_usr = true
export default function Inner(props: IDoctorEnd_ImageReport_Props) {
  mchcLogger.log('DoctorEnd_ImageReport', props)
  const [tableData, set_tableData] = useState([])

  const { headerInfo = {}, type = 1, needOutReport } = props;

  let outpatientNO = get(headerInfo, 'outpatientNO') || get(headerInfo, 'outpatientNo');
  const filter_obj = filter_obj_to_url_search(headerInfo)

  useEffect(() => {

    (async () => {
      const list = await (needOutReport
        ? api.image.getOuterReports({ ...filter_obj, 'type.equals': 2, 'patientNo.equals': outpatientNO }, ignore_usr)
        : api.image.getReportList(headerInfo, type, ignore_usr)
      )
      set_tableData(list)


    })()
    return () => {

    }
  }, [])




  return (
    <DoctorEnd_ImageReport_Report tableData={tableData} />
  );
}
