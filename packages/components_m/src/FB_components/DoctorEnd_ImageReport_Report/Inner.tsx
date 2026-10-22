import React, { useState } from 'react';

import { Button, Col, Input, Modal, Pagination, Row } from 'antd';
import { get } from 'lodash';
// import aImg from '@/assets/imgs/images/a.jpg';
// import bImg from '@/assets/imgs/images/b.png';
import { mchcEnv, mchcLogger } from '@lm_fe/env';
// import { mchcModal__ } from '@lm_fe/pages';
import { formatDate } from '@lm_fe/utils';
import classnames from 'classnames';
import PDFPreview_View from 'src/PDFPreview/View';
import './index.less';
import { IProps } from './types';
import { Table_L } from '@lm_fe/components';

let hostUrl = process.env.NODE_ENV === 'production' ? '' : 'http://120.79.170.18:8975';

export default function Inner(props: IProps) {
  mchcLogger.log('DoctorEnd_ImageReport', props)
  const [isShowModal, set_isShowModal] = useState(false)
  const [isShowSearchPdf, set_isShowSearchPdf] = useState(false)
  const [imgModalVisbile, set_imgModalVisbile] = useState(false)
  const [modalTitle, set_modalTitle] = useState('')
  const [pdfPath, set_pdfPath] = useState('')
  const [btnsData, set_btnsData] = useState(['无脑儿', '脑积水', '侧脑室扩张', '十二指肠闭锁', '多囊肾', '唇裂'])
  const [pathArr, set_pathArr] = useState([])
  const [current, set_current] = useState(1)
  const [record, set_record] = useState({})

  const { tableData } = props;





  function handleBtnClick(text: any, record: any, type: number) {
    if (type === 1) {
      let pdfPath = record.url;
      let key = '&amp;';
      let newUrl = pdfPath.replace(new RegExp(key, 'g'), '&');
      window.open(newUrl, '_target');
      // if (isString(record.url)) {
      //   let params = record.url.split('?')[1];
      //   pdfPath = `${PdfUrl}?${params}`;
      // }
      set_isShowModal(false)
    } else {
      set_isShowModal(true)
      set_modalTitle('超声图片')
    }
  };

  function open_modal(record: any) {
    console.log('record', record);

    if (record?.url1 && window.mchc_modal) {
        if (mchcEnv.in(['中大惠亚'])) {
            let pdfPath = record.url1
            let key = '&amp;'
            let newUrl = pdfPath.replace(new RegExp(key, 'g'), '&')
            window.open(newUrl, '_target')
        }else{
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


    let path = get(record, 'url') || '';
    let pathArr = path.split('`#');
    set_imgModalVisbile(true)
    set_pathArr(pathArr)
    set_record(record)
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
        return (
          <>
            <Button style={{ marginRight: '10px' }} type="primary" onClick={() => handleBtnClick(text, record, 1)}>
              查看报告
            </Button>
            {/* <Button type="primary" onClick={() => handleBtnClick(text, record, 2)}>
            查看影像
          </Button> */}
          </>
        );
      },
    },
  ] as any[];

  function handleSearch() {

    set_isShowSearchPdf(true)
  };

  function handleCancel() {
    set_isShowModal(false)
    set_pdfPath('')
    set_isShowSearchPdf(false)
  };

  function renderModal() {
    let imgArr: any = [];
    pathArr.map((path: string, index: number) => {
      let isShow = index == current - 1;
      if (path.indexOf('.jpg') > -1 || path.indexOf('.JPG') > -1) {
        imgArr.push(
          <img
            key={path}
            className={classnames('hideContent', {
              isShow: isShow,
            })}
            alt="out-pic"
            src={`${hostUrl}${path}`}
          />,
        );
      } else if (path.indexOf('.pdf') > -1) {
        imgArr.push(
          <div
            className={classnames('hideContent', {
              isShow: isShow,
            })}
            key={path}
          >
            <PDFPreview_View key={path} file={`${hostUrl}${path}`} />
          </div>,
        );
      } else {
        imgArr.push(
          <img
            key={path}
            className={classnames('hideContent', {
              isShow: isShow,
            })}
            alt="out-pic"
            src={`${hostUrl}${path}`}
          />,
        );
      }
    });
    return (
      <>
        <Modal
          centered
          width="1200px"
          footer={null}
          visible={isShowModal}
          title={modalTitle}
          onCancel={handleCancel}
          className="prenatal-visit-main_image-modal"
        >
          {modalTitle === '影像报告' ? (
            <object key={pdfPath} data={pdfPath} type="application/pdf" width="100%" height="100%" />
          ) : (
            <Row className="image-modal-content">
              <Col span={isShowSearchPdf ? 10 : 20}>
                "aImg"
                {/* <object data={aImg} type="application/pdf" width="100%" /> */}
              </Col>

              {isShowSearchPdf && (
                <Col span={10}>
                  "bImg"
                  {/* <object data={bImg} type="application/pdf" width="100%" /> */}
                </Col>
              )}

              <Col span={4} className="image-search">
                <Input.Search placeholder="请输入相关诊断" enterButton="搜索" onClick={handleSearch} />
                <p className="image-msg">点击下方关键词打开影像对比</p>
                {btnsData.map((item: any) => (
                  <Button className="image-btn" onClick={handleSearch}>
                    {item}
                  </Button>
                ))}
              </Col>
            </Row>
          )}
        </Modal>
        {imgModalVisbile && (
          <Modal
            centered
            closable
            width="850px"
            destroyOnClose
            title="影像图片"
            footer={null}
            visible={imgModalVisbile}
            className="img-report-modal"
            onCancel={() => {
              set_imgModalVisbile(false)
            }}
          >
            <div style={{ textAlign: 'right', paddingRight: 12 }}>
              <span style={{ marginRight: 8 }}>上传日期：{formatDate(get(record, 'uploadDate'))}</span>
              <span>上传人：{get(record, 'recorder')}</span>
            </div>
            <div className="img-container">{imgArr}</div>
            <Pagination
              current={current}
              total={pathArr.length}
              pageSize={1}
              onChange={set_current}
            />
          </Modal>
        )}
      </>
    );
  }

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
      {renderModal()}
    </div>
  );
}
