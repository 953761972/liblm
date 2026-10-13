// import dsf from '../../../images/dsf.svg';
// import ywc from '../../../images/ywc.svg';
// import wd from '../../../images/wd.svg';
// import sf from '../../../images/sf.svg';
import React from 'react';
import { APP_CONFIG } from "@lm_fe/components_m";
export const tableColumns = [
  {
    title: '门诊号',
    dataIndex: 'outpatientNo',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '年龄(岁)',
    dataIndex: 'age',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'telephone',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '手术日期',
    dataIndex: 'surgeryDate',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '手术类型',
    dataIndex: 'surgeryType',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '手术医生',
    dataIndex: 'surgeryDoctor',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '随访记录',
    align: 'center',
    children: [
      {
        title: '首次',
        dataIndex: 'firstFollowUpState',
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        align: 'center',
        render: (text: any) => {
          if (text === '待随访') {
            return (
              <>
                <span>
                  {
                    "<img src={dsf} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '已完成') {
            return (
              <>
                <span>
                  {
                    "<img src={ywc} />"
                  }
                </span>
                <span style={{ color: '#21AC8D', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '未到') {
            return (
              <>
                <span>
                  {
                    "<img src={wd} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '失访') {
            return (
              <>
                <span>
                  {
                    "<img src={sf} />"
                  }
                </span>
                <span style={{ color: '#FD617F', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          return '';
        },
      },
      {
        title: '1个月',
        dataIndex: 'oneMonthFollowUpState',
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        align: 'center',
        render: (text: any) => {
          if (text === '待随访') {
            return (
              <>
                <span>
                  {
                    "<img src={dsf} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '已完成') {
            return (
              <>
                <span>
                  {
                    "<img src={ywc} />"
                  }
                </span>
                <span style={{ color: '#21AC8D', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '未到') {
            return (
              <>
                <span>
                  {
                    "<img src={wd} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '失访') {
            return (
              <>
                <span>
                  {
                    "<img src={sf} />"
                  }
                </span>
                <span style={{ color: '#FD617F', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          return '';
        },
      },
      {
        title: '3个月',
        dataIndex: 'threeMonthFollowUpState',
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        align: 'center',
        render: (text: any) => {
          if (text === '待随访') {
            return (
              <>
                <span>
                  {
                    "<img src={dsf} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '已完成') {
            return (
              <>
                <span>
                 {
                  " <img src={ywc} />"
                 }
                </span>
                <span style={{ color: '#21AC8D', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '未到') {
            return (
              <>
                <span>
                  {
                    "<img src={wd} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '失访') {
            return (
              <>
                <span>
                 {
                  " <img src={sf} />"
                 }
                </span>
                <span style={{ color: '#FD617F', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          return '';
        },
      },

      {
        title: '6个月',
        dataIndex: 'sixMonthFollowUpState',
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        align: 'center',
        render: (text: any) => {
          if (text === '待随访') {
            return (
              <>
                <span>
                  {
                    "<img src={dsf} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '已完成') {
            return (
              <>
                <span>
                  {
                    "<img src={ywc} />"
                  }
                </span>
                <span style={{ color: '#21AC8D', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '未到') {
            return (
              <>
                <span>
                 {
                  " <img src={wd} />"
                 }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '失访') {
            return (
              <>
                <span>
                  {
                    "<img src={sf} />"
                  }
                </span>
                <span style={{ color: '#FD617F', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          return '';
        },
      },
      {
        title: '12个月',
        dataIndex: 'twelveMonthFollowUpState',
        width: APP_CONFIG.CELL_WIDTH_SMALL,
        align: 'center',
        render: (text: any) => {
          if (text === '待随访') {
            return (
              <>
                <span>
                  {
                    "<img src={dsf} />"
                  }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '已完成') {
            return (
              <>
                <span>
                  {
                    "<img src={ywc} />"
                  }
                </span>
                <span style={{ color: '#21AC8D', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '未到') {
            return (
              <>
                <span>
                 {
                  " <img src={wd} />"
                 }
                </span>
                <span style={{ paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          if (text === '失访') {
            return (
              <>
                <span>
                  {
                    "<img src={sf} />"
                  }
                </span>
                <span style={{ color: '#FD617F', paddingLeft: 4 }}>{text}</span>
              </>
            );
          }
          return '';
        },
      },
    ],
  },
];
export const historyTableColumns = [
  {
    title: '随访类型',
    dataIndex: 'followUpType',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
    render: (text: any) => {
      if (text === 0) {
        return '首次随访';
      }
      if (text === 1) {
        return '1个月随访';
      }
      if (text === 3) {
        return '3个月随访';
      }
      if (text === 6) {
        return '6个月随访';
      }
      if (text === 12) {
        return '12个月随访';
      }
      return '';
    },
  },
  {
    title: '随访时间',
    dataIndex: 'followUpTime',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '随访方式',
    dataIndex: 'followUpWay',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '随访人',
    dataIndex: 'followUpPerson',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
  },
  {
    title: '随访情况',
    dataIndex: 'followUpSituation',
    width: APP_CONFIG.CELL_WIDTH_SMALL,
    align: 'center',
    render: (text: any) => {
      if (text === '正常') {
        return <span style={{ color: '#21AC8D' }}>{text}</span>;
      } else {
        return <span style={{ color: '#FD617F' }}>{text}</span>;
      }
    },
  },
];
