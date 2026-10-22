import { defineFormConfig } from '@lm_fe/service';

/** 归档管理 - 搜索表单配置 */
export default defineFormConfig([
  {
    label: '姓名',
    inputType: 'input',
    name: 'name',
    inputProps: {
      width: 110,
    },
  },
  {
    label: '就诊卡号',
    inputType: 'PatientSelect',
    name: 'outpatientNO',
    filterType: 'contains',
    inputProps: {
      width: 140,
    },
  },
  {
    label: '证件号码',
    inputType: 'input',
    name: 'idNO',
    inputProps: {
      width: 160,
    },
  },
  {
    label: '建档日期',
    inputType: 'rangeDate',
    name: 'validateDate',
  },
  {
    label: '归档状态',
    inputType: 'MS',
    name: 'archiveStatus',
    inputProps: {
      width: 100,
      options: ['未归档', '已归档', '归档失败'],
    },
  },
])
