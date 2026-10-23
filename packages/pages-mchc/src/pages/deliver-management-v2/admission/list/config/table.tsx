
import { APP_CONFIG } from '@lm_fe/components_m';
import { rt_ctx } from '@lm_fe/env';
import { defineFormConfig } from '@lm_fe/service';
const ctx = rt_ctx
const React = ctx.React
export default defineFormConfig([
  {
    title: '住院号',
    dataIndex: 'inpatientNO',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '病区号',
    dataIndex: 'areaNO',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '房号',
    dataIndex: 'roomNO',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '床号',
    dataIndex: 'bedNO',
    key: 'bedNO',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '孕妇姓名',
    dataIndex: 'name',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '证件号码',
    dataIndex: 'idNO',
    key: 'idNO',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_MIDDLE,
    render: (text) => {
      return ctx.utils.idNOFuzzy(text);
    },
  },
  {
    title: '孕妇年龄',
    dataIndex: 'age',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '出生日期',
    dataIndex: 'dob',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  {
    title: '预产期',
    dataIndex: 'edd',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
  },
  // {
  //   title: '证件类型',
  //   dataIndex: 'idType',
  //   key: 'idType',
  //   align: 'center',
  //   render: (value: string) => get(IDCardMappingByValue, `${value}.title`),
  //   width: APP_CONFIG.CELL_WIDTH_MIDDLE,
  // },
  {
    title: '住院日期',
    dataIndex: 'adminDate',
    align: 'center',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    render: (value: any, rowData: any) => {
      return ctx.utils.formatDate(value);
    },
  },
])
