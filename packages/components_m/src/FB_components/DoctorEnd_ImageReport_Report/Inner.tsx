import React, { useState } from 'react';

import { Button } from 'antd';
import { get } from 'lodash';
// import aImg from '@/assets/imgs/images/a.jpg';
// import bImg from '@/assets/imgs/images/b.png';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
// import { mchcModal__ } from '@lm_fe/pages';
import { Table_L } from '@lm_fe/components';
import { formatDate } from '@lm_fe/utils';
import './index.less';
import { IProps } from './types';


export default function Inner(props: IProps) {
  mchcLogger.log('DoctorEnd_ImageReport', props)

  const { tableData } = props;



  function open_modal(record: any) {
    console.log('record', record);

    if (record?.url1 && window.mchc_modal) {
      if (mchcEnv.in(['中大惠亚'])) {
        let pdfPath = record.url1
        let key = '&amp;'
        let newUrl = pdfPath.replace(new RegExp(key, 'g'), '&')
        window.open(newUrl, '_target')
      } else {
        // 第三方 url 处理
        window.mchc_modal.open('modal_page', {
          modal_data: {
            // content: <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            //   <iframe width="100%" height="100%" style={{ border: 'none', padding: 0, margin: 0 }} src={record?.url1} />
            // </div>,
            iframe_url: record?.url1
          }
        })
      }
      return
    }


  };
  const columns = () => [
    {
      title: '标题',
      dataIndex: 'title',
      width: 60,
      render: (text: any, record: any) => {
        if (get(record, 'isShot')) {
          return <span className="isShot">{text}</span>;
        }
        return text;
      },
    },
    {
      title: '检查日期',
      dataIndex: 'reportDate',
      width: 50,
      align: 'center',
      render: (text: any, record: any) => formatDate(text),
    },
    { title: '报告医生', dataIndex: 'reportDoctorName', width: 60 },
    { title: '超声所见', dataIndex: 'diagnosis', width: 180 },
    { title: '超声提示', dataIndex: 'result', width: 180 },
    {
      title: '查看报告',
      dataIndex: 'operation',
      align: 'center',
      width: 40,
      render: (text: any, record: any) => {
        if (true || get(record, 'isShot')) {
          return (
            <Button
              size='small'

              style={{}}
              type='text'
              onClick={() => open_modal(record)}
            >
              查看报告
            </Button>
          );
        }

      },
    },
  ] as any[];



  return (
    <div className="prenatal-visit-main_image">
      <Table_L
        scroll={{ y: 620 }}
        size="small"
        className="prenatal-visit-main-table"
        columns={columns()}
        dataSource={tableData}
        pagination={false}
      />
    </div>
  );
}
