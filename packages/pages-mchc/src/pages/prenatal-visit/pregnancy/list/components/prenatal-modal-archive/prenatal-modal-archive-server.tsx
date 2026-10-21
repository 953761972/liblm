import { MyIcon, PDFPreview_View } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { mchcModal__ } from '@lm_fe/pages';
import { request } from '@lm_fe/utils';
import { Button, Spin } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import './index.less';

/** 服务端生成产检本 pdf（仅生成不落库） */
export const serverPreviewApi = '/api/pdf-preview-document/serverPreview';
/** 服务端归档（新归档模式） */
export const serverArchiveApi = '/api/pdf-preview-document/archive';

interface IProps {
  [key: string]: any;
}

/**
 * 产检本-服务端归档组件（新归档模式）
 *
 * 与 PrenatalModalArchive（前端 canvas 绘制曲线图 + 后端合并）完全独立：
 * 曲线图绘制与 pdf 合并全部由服务端完成，前端只传入孕册 id 即可拿到完整 pdf。
 * 因此该模式不依赖浏览器渲染，可配合定时任务批量归档。
 * 原有归档组件保持不变，两个按钮可随时切换归档模式。
 */
export default function PrenatalModalArchiveServer({ ...props }: IProps) {
  const [loading, setLoading] = useState<boolean>(false); // 服务端生成 pdf 的请求状态
  const [archiving, setArchiving] = useState<boolean>(false); // 归档请求状态
  const [pdfData, setPdfData] = useState<string>(); // 服务端生成的 pdf 数据(base64)
  const loadedRef = useRef<boolean>(false); // 防止重复请求

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    getServerPreviewData();
    return () => {};
  }, []);

  //#region 辅助方法
  /** 孕册 id，兼容 headerInfo.id 与直接传入 id 两种方式 */
  function getPregnancyId() {
    return get(props, 'headerInfo.id') || get(props, 'id');
  }

  /** 请求服务端直接生成产检本 pdf */
  async function getServerPreviewData() {
    try {
      setLoading(true);
      const { pdfdata } = (await request.get(serverPreviewApi, { params: { id: getPregnancyId() } })).data;
      setPdfData(pdfdata);
      props.onLoad?.(pdfdata);
    } catch (error) {
      mchcEnv.warning('产检本生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }
  //#endregion

  //#region 事件相关
  /** 打印服务端生成的 pdf */
  function handlePrint() {
    if (!pdfData) return;
    mchcModal__.open('print_modal', {
      modal_data: {
        printData: pdfData,
      },
    });
  }

  /** 归档服务端生成的 pdf（复用已生成的 pdf，避免重复生成） */
  async function handleArchive() {
    if (!pdfData || archiving) return;
    try {
      setArchiving(true);
      const results = (await request.post(serverArchiveApi, {
        id: getPregnancyId(),
        pdfdata: pdfData,
      })).data;
      const result = get(results, '0');
      if (result && result.success === false) {
        mchcEnv.warning(result.message || '归档失败，请稍后重试');
        return;
      }
      mchcEnv.success('归档成功');
      props.onArchived?.(pdfData);
    } catch (error) {
      mchcEnv.warning('归档失败，请稍后重试');
    } finally {
      setArchiving(false);
    }
  }

  /** 关闭浮层 */
  function handleClose() {
    props.onClose && props.onClose();
  }
  //#endregion

  return (
    <div className="prenatal-modal-archive-container">
      <div className="prenatal-modal-archive-container_mian">
        <div className="prenatal-modal-archive-container_mian-content">
          <div className="archive-content-header">
            <span className="archive-content-header_title">{props.title || '产检本归档（服务端）'}</span>
            <MyIcon value="CloseOutlined" style={{ fontSize: 22, cursor: 'pointer' }} onClick={handleClose} />
          </div>
          <div className="archive-content-details">
            <div className="archive-content-details_show">
              {pdfData ? (
                <PDFPreview_View data={pdfData} />
              ) : (
                <div className="archive-loading">
                  <Spin size="large" />
                  <p className="archive-loading_text">产检本生成中，请稍等...</p>
                </div>
              )}
            </div>
          </div>
          <div className="archive-content-footer">
            <Button
              type="primary"
              disabled={!pdfData || loading}
              onClick={handlePrint}
              icon={<MyIcon value="PrinterOutlined" type="icon-print" />}
            >
              打印
            </Button>
            <Button
              type="primary"
              className="archive-btn"
              loading={archiving}
              disabled={!pdfData || loading}
              onClick={handleArchive}
              icon={<MyIcon value="InboxOutlined" />}
            >
              归档
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
