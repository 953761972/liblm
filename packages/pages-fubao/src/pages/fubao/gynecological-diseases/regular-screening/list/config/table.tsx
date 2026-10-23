import { APP_CONFIG } from "@lm_fe/components_m";
import { idNOFuzzy } from '@lm_fe/utils'
export const tableColumns = [
  {
    title: '接诊卡号',
    dataIndex: 'checkupNO',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '年龄(岁)',
    dataIndex: 'age',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '身份证号码',
    dataIndex: 'idNO',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    render: (text) => {
      if (text) {
        return idNOFuzzy(text);
      }
      return text;
    },
  },
  {
    title: '筛查项目',
    dataIndex: 'insuranceType',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '检查日期',
    dataIndex: 'jcrq',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '当前费用',
    dataIndex: 'nationality',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '筛查建议',
    dataIndex: 'note',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  },
  {
    title: '下次筛查的日期',
    dataIndex: 'dob',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
];
