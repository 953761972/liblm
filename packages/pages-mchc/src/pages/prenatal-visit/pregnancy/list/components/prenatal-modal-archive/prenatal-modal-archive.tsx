import { MyIcon, PDFPreview_View } from '@lm_fe/components_m';
import { mchcEnv } from '@lm_fe/env';
import { BmiCanvas, FetusCanvas, FetusCanvasNICHD, Pregnogram, mchcModal__ } from '@lm_fe/pages';
import { request } from '@lm_fe/utils';
import { Button, Spin } from 'antd';
import { get, map } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  CANVAS_COUNT,
  CANVAS_ID_MAP,
  PRENATALLIST,
  archiveApi,
  prenatalToResource,
  previewDocumentApi,
} from './constant';
import './index.less';

interface IProps {
  [key: string]: any;
}

/**
 * 产检本-归档组件
 * 参照 prenatal-modal，加载时把产检本中所有的 pdf 文书与 canvas 曲线图
 * 合并成一个 pdf 进行整体预览，并支持打印和归档
 */
export default function PrenatalModalArchive({ ...props }: IProps) {
  const [loading, setLoading] = useState<boolean>(false); // 合并 pdf 的请求状态
  const [archiving, setArchiving] = useState<boolean>(false); // 归档请求状态
  const [allPreviewData, setAllPreviewData] = useState<string>(); // 合并后的 pdf 数据(base64)
  const [canvasCount, setCanvasCount] = useState<number>(0); // 已绘制完成的 canvas 数量
  const pdfDataRef = useRef<string>(); // 缓存合并结果，避免重复请求
  const mergedRef = useRef<boolean>(false); // 是否已发起过合并请求

  useEffect(() => {
    // 所有 canvas 都绘制完成后，再合并 pdf，保证曲线图能被正确截取
    if (canvasCount >= CANVAS_COUNT) {
      getAllPreviewData();
    }
    return () => {};
  }, [canvasCount]);

  //#region 辅助方法
  /** 从页面 canvas 上截取 base64 图片 */
  function getCanvasBase64(type: number) {
    const id = get(CANVAS_ID_MAP, `${type}`);
    if (!id) return;
    const el = document.getElementById(id) as HTMLCanvasElement | null;
    return el?.toDataURL('image/jpg');
  }

  /** 孕册 id，兼容 headerInfo.id 与直接传入 id 两种方式 */
  function getPregnancyId() {
    return get(props, 'headerInfo.id') || get(props, 'id');
  }

  /** 组装全部病历的合并请求参数（canvas 曲线图以 base64 图片提交） */
  function buildRequestData() {
    return map(PRENATALLIST, (item) => {
      const type = get(item, 'type');
      const obj: any = {
        template: '',
        resource: get(prenatalToResource, `${type}`),
        id: getPregnancyId(),
      };
      const img = getCanvasBase64(type);
      if (img) {
        obj.img = img;
      }
      return obj;
    });
  }

  /** 合并全部 pdf / canvas 为一个 pdf */
  async function getAllPreviewData() {
    if (mergedRef.current || pdfDataRef.current) return;
    mergedRef.current = true;
    const requestData = buildRequestData();
    try {
      setLoading(true);
      const { pdfdata } = (await request.post(previewDocumentApi, requestData)).data;
      setLoading(false);
      pdfDataRef.current = pdfdata;
      setAllPreviewData(pdfdata);
      props.onLoad?.(pdfdata);
    } catch (error) {
      mergedRef.current = false;
      setLoading(false);
      mchcEnv.warning('产检本生成失败，请稍后重试');
    }
  }

  /** canvas 绘制完成回调 */
  function canvasOnLoad() {
    setCanvasCount((count) => count + 1);
  }
  //#endregion

  //#region 事件相关
  /** 打印合并后的 pdf */
  function handlePrint() {
    if (!pdfDataRef.current) return;
    mchcModal__.open('print_modal', {
      modal_data: {
        printData: pdfDataRef.current,
      },
    });
  }

  /** 归档合并后的 pdf */
  async function handleArchive() {
    if (!pdfDataRef.current || archiving) return;
    try {
      setArchiving(true);
      if (typeof props.onArchive === 'function') {
        await props.onArchive(pdfDataRef.current);
      } else {
        await request.post(props.archiveUrl || archiveApi, {
          id: getPregnancyId(),
          pdfdata: pdfDataRef.current,
        });
      }
      mchcEnv.success('归档成功');
      props.onArchived?.(pdfDataRef.current);
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
            <span className="archive-content-header_title">{props.title || '产检本归档'}</span>
            <MyIcon value="CloseOutlined" style={{ fontSize: 22, cursor: 'pointer' }} onClick={handleClose} />
          </div>
          <div className="archive-content-details">
            <div className="archive-content-details_show">
              {allPreviewData ? (
                <PDFPreview_View data={allPreviewData} />
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
              disabled={!allPreviewData || loading}
              onClick={handlePrint}
              icon={<MyIcon value="PrinterOutlined" type="icon-print" />}
            >
              打印
            </Button>
            <Button
              type="primary"
              className="archive-btn"
              loading={archiving}
              disabled={!allPreviewData || loading}
              onClick={handleArchive}
              icon={<MyIcon value="InboxOutlined" />}
            >
              归档
            </Button>
          </div>
        </div>
      </div>
      {/* 隐藏的曲线 canvas，用于生成合并 pdf 所需的图片 */}
      <div style={{ display: 'none' }}>
        {get(props.system, 'config.curveVersion') === 'nichd' ? (
          <FetusCanvasNICHD {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
        ) : (
          <FetusCanvas {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
        )}
        <BmiCanvas {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
        <Pregnogram {...props} hidePrintBtn={true} onLoad={canvasOnLoad} />
      </div>
    </div>
  );
}
