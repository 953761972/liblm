import { get } from 'lodash';

/** 归档状态选项（后端 marshal:0，下标 0/1/2 分别对应） */
export const ARCHIVE_STATUS_OPTIONS = ['未归档', '已归档', '归档失败'];

/** 归档状态颜色：已归档-绿，归档失败-红，未归档-灰 */
export const ARCHIVE_STATUS_COLOR: { [key: string]: string } = {
  '未归档': '#8c8c8c',
  '已归档': '#21ac8d',
  '归档失败': '#ff4d4f',
};

/** 获取归档状态文案（兼容下标值 0/1/2、中文文案以及 {value,label} 对象） */
export function getArchiveStatusLabel(value: any) {
  if (value && typeof value === 'object') {
    return getArchiveStatusLabel(value.label ?? value.value);
  }
  return ARCHIVE_STATUS_OPTIONS[Number(value)] ?? value ?? '-';
}

/** 获取归档状态对应的颜色 */
export function getArchiveStatusColor(value: any) {
  return ARCHIVE_STATUS_COLOR[getArchiveStatusLabel(value)] ?? ARCHIVE_STATUS_COLOR['未归档'];
}

/** 是否为「已归档」 */
export function isArchived(rowData: any) {
  return getArchiveStatusLabel(get(rowData, 'archiveStatus')) === '已归档';
}

/** 获取孕册 id，兼容 pregnancyId 与 id 两种字段 */
export function getPregnancyId(rowData: any) {
  return get(rowData, 'pregnancyId') || get(rowData, 'id');
}
