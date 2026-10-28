import { mchcLogger } from "@lm_fe/env";
import { IMchc_Doctor_OutpatientHeaderInfo, IMchc_Pregnancy } from "@lm_fe/service";
import { AnyObject, filter_obj_to_url_search, getSearchParamsValue, request } from "@lm_fe/utils";
import { filter, get, map, orderBy } from "lodash";
export default {

  getReportList: (params: AnyObject, type: number = 1, iu = false) => {
    const id = params?.id ?? getSearchParamsValue('id');
    const filter_obj = filter_obj_to_url_search(params)
    if (type === 1) {
      return request.get(`/api/getImageExam`, {
        params: {
          ...filter_obj,
          pregnancyId: id,
          count: 100,
          page: 0,
        },
        ignore_usr: iu
      }).then(r => r.data);
    } else if (type === 2) {
      return request.get(`/api/getImageExamByPrenatal`, {
        params: {
          ...filter_obj,
          prenatalPatientId: id,
        },
        ignore_usr: iu

      }).then(r => r.data);
    }
    return [];
  },
  getOuterReports: async function (params: any, ignore_usr: boolean) {
    let OuterReports = (await request.get(`/api/outer-reports`, { ignore_usr, params })).data || [];
    let finalData: any[] = []
    map(OuterReports, (report) => {
      finalData.push({
        id: get(report, 'id'),
        title: get(report, 'title'),
        reportDate: get(report, 'reportDate'),
        uploadDate: get(report, 'uploadDate'),
        name: get(report, 'name'),
        recorder: get(report, 'recorder'),
        // isShot: true,
        url: get(report, 'path'),
      });
    });

    finalData = orderBy(
      finalData,
      function (o) {
        return Date.parse(o.reportDate);
      },
      ['desc'],
    );
    return finalData
  }
};
