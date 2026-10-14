import { APP_CONFIG } from "@lm_fe/components_m";
import React from 'react'
export const tableColumns = [
  {
    title: '门诊号',
    dataIndex: 'outpatientNo',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    showSorter: false,
  },
  {
    title: '年龄(岁)',
    dataIndex: 'age',
    width: 58,
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '术前诊断',
    dataIndex: 'preoperativeDiagnosis',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '预约手术名称',
    dataIndex: 'operationName',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '预约日期',
    dataIndex: 'appointmentDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any, record: any) => (
      <div>
        {value}--{record.appointmentMorningOrAfternoon}
      </div>
    ),
  },
  {
    title: '预约者',
    dataIndex: 'name',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '状态',
    dataIndex: 'progressStatus',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => (value === 3 ? '已签到' : value === 4 ? '已完成' : ''),
  },
  // {
  //   title: '备注',
  //   dataIndex: 'registerPerson',
  //   width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  // },
];
