import { DoctorEnd_SurveyReport_Report, formatTimeToDate, LoadingPlaceholder, MyIcon } from '@lm_fe/components_m';
import { mchcModal__ } from '@lm_fe/pages';
import { IMchc_Admission_HeaderInfoOfInpatientEmr, IMchc_Doctor_OutpatientHeaderInfo, IMchc_LabExamReport_Detail, IMchc_listPatientLabExamReport_Item, SMchc_Admission } from '@lm_fe/service';
import { request } from '@lm_fe/utils';
import { Badge, Button, Collapse } from 'antd';
import { assign, map, size } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ExaminationItemCurve from './components/ExaminationItemCurve';
import './index.less';
interface IProps {
  headerInfo?: Partial<IMchc_Doctor_OutpatientHeaderInfo>
  headerInfoOfInpatientData?: Partial<IMchc_Admission_HeaderInfoOfInpatientEmr>
  fubao?: boolean
}



export function DoctorEnd_SurveyReport(props: IProps) {



  const { headerInfoOfInpatientData = {}, headerInfo = {}, fubao } = props;
  const combinded = assign({ fubao }, headerInfoOfInpatientData, headerInfo)
  const [reportList, set_reportList] = useState<IMchc_listPatientLabExamReport_Item[]>([])
  const [detailData, set_detailData] = useState<IMchc_LabExamReport_Detail>()

  const [loading, setLoading] = useState(false)

  const inited = useRef(false)

  useEffect(() => {

    init();
    return () => {

    }
  }, [])



  async function init() {



    let list = await SMchc_Admission.listPatientLabExamReport({ params: combinded, ignore_usr: true })

    set_reportList(list)
    let first = list?.[0]?.examReport?.[0]
    if (first && !inited.current) {
      inited.current = true
      handleItemClick(first)
    }
  };

  async function handleItemClick(item: IMchc_listPatientLabExamReport_Item['examReport'][number]) {
    const { id, type } = item;
    setLoading(true)
    const detailData: IMchc_LabExamReport_Detail = (await request.get(`/api/getLabExamReport?id=${id}&type=${type}`, { ignore_usr: true })).data;
    setLoading(false)



    set_detailData(detailData)

    init();
  };




  function renderLeft() {

    return (
      <div className="survey-left">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 4, }}>
          <span>报告列表</span>
          <Button.Group>
            <Button size='small' onClick={() => request.post('/api/syncReport', combinded, { successText: '成功' }).then(init)}>同步</Button>
            <Button size='small' onClick={() => request.post('/api/examineReport', combinded, { successText: '成功' }).then(init)}>审核</Button>
            <Button size='small' onClick={() => { mchcModal__.open('print_modal', { modal_data: { requestData: { url: '/api/printReport', ...combinded } } }) }}>打印</Button>
          </Button.Group>
        </div>
        {size(reportList) > 0 ? (
          <Collapse defaultActiveKey={['0']} expandIcon={() => <MyIcon value='CalendarOutlined' />}>
            {map(reportList, (item, idx) => (
              <Collapse.Panel
                header={
                  !item.gesWeek ? (
                    <>
                      {formatTimeToDate(item.date)}
                      <div style={{ position: 'absolute', right: 6, top: 6 }}>
                        <Badge
                          count={item.unread ? item.unread : item.total}
                          style={!item.unread ? { backgroundColor: 'green' } : {}}
                        ></Badge>
                      </div>
                    </>
                  ) : (
                    <>
                      {`${formatTimeToDate(item.date)} (${item.gesWeek}周)`}
                      <div style={{ position: 'absolute', right: 6, top: 6 }}>
                        <Badge
                          count={item.unread ? item.unread : item.total}
                          style={!item.unread ? { backgroundColor: 'green' } : {}}
                        ></Badge>
                      </div>
                    </>
                  )
                }
                key={idx}
              >
                {map(item.examReport, (subItem) => (
                  <div className="left-item" onClick={() => handleItemClick(subItem)}>
                    {subItem.unread ? <span className="left-item-state">新</span> : null}
                    <p
                      className="left-item-title"
                      title={subItem.title}
                      style={!subItem.normal ? { color: 'red' } : {}}
                    >
                      {subItem.id === detailData?.id ? <span>🔵</span> : ''}

                      {subItem.title}



                    </p>
                    {subItem.type === 2 ? <span className="left-item-lable">外院</span> : null}
                  </div>
                ))}
              </Collapse.Panel>
            ))}
          </Collapse>
        ) : (
          <div className="no-data">
            <p className="no-data-title">暂无数据</p>
          </div>
        )}
      </div>
    );
  }




  return (
    <div className="prenatal-visit-main_survey">
      <div className="survey-left-wrapper">{renderLeft()}</div>
      <div className="survey-right-wrapper">

        {
          loading ? <LoadingPlaceholder /> : <DoctorEnd_SurveyReport_Report detailData={detailData} />
        }
      </div>

    </div>
  );

}

export const SurveyReport = DoctorEnd_SurveyReport
