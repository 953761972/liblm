/*
 * @Descripttion: 产检本归档组件常量
 */
import { prenatalEnum } from '../prenatal-modal/constant';

// 复用产检本的病历类型、资源映射、打印接口等常量
export * from '../prenatal-modal/constant';

/** 多页合并预览 / 打印接口 */
export const previewDocumentApi = '/api/pdf-preview-document';

/**
 * 归档接口
 * 默认地址为占位实现，实际可通过组件 props.archiveUrl 覆盖，
 * 或通过 props.onArchive 完全自定义归档逻辑。
 */
export const archiveApi = '/api/pdf-preview-document/archive';

/**
 * canvas 曲线组件对应的 DOM id
 * 合并 PDF 时，需要把 canvas 的绘制结果转成 base64 图片一起提交给后端
 */
export const CANVAS_ID_MAP: { [key: number]: string } = {
  [prenatalEnum.growthCurve]: 'fetus-canvas',
  [prenatalEnum.BMICurve]: 'bmi-canvas',
  [prenatalEnum.fundalImage]: 'pregnogram-canvas',
};

/** 需要绘制成图片的 canvas 数量 */
export const CANVAS_COUNT = Object.keys(CANVAS_ID_MAP).length;
