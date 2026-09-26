import { APP_CONFIG } from '@lm_fe/components_m';
import { rt_ctx } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';
import { getArchiveStatusColor, getArchiveStatusLabel } from './constant';
const ctx = rt_ctx
const React = ctx.React

/** 归档管理-表格列配置 */
export default defineFormConfig([
  {
    title: '就诊卡号',
    dataIndex: 'outpatientNO',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '孕妇姓名',
    dataIndex: 'name',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any, rowData: any) => {
      const id = rowData.pregnancyId || rowData.id
      return (
        <ctx.ui.Button
          size="small"
          onClick={() => ctx.safeTo(`/prenatal-visit/pregnancy/doctor-end?id=${id}`, { id })}
        >
          {value}
        </ctx.ui.Button>
      )
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 42,
  },
  {
    title: '孕周',
    dataIndex: 'currentGestationalWeek',
    width: 52,
  },
  {
    title: '证件号码',
    dataIndex: 'idNO',
    ellipsis: true,
    width: APP_CONFIG.CELL_WIDTH_MIDDLE + 20,
  },
  {
    title: '建档日期',
    dataIndex: 'validateDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => ctx.utils.formatDate(value),
  },
  {
    title: '归档医生',
    dataIndex: 'archiveDoctor',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '归档状态',
    dataIndex: 'archiveStatus',
    width: 76,
    align: 'center',
    render: (value: any) => (
      <span style={{ color: getArchiveStatusColor(value) }}>
        {getArchiveStatusLabel(value)}
      </span>
    ),
  },
  {
    title: '归档日期',
    dataIndex: 'archiveDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any) => ctx.utils.formatDate(value),
  },
])
