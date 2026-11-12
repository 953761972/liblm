import { IMchc_FormDescriptions_Field } from "@lm_fe/service";
import { AnyObject } from "@lm_fe/utils";
import { ColProps } from "antd";
import { SpinSize } from "antd/es/spin";
import { TableColumnsType } from "antd/lib";
import { ECharts } from "echarts";
import { CSSProperties } from "react";
export interface IDynConfItem {
  colProps?: ColProps
  title?: string,
  inputType?: 'tabs' | 'segs' | 'table' | 'echarts' | 'title' | 'grid' | 'iframe',

  dataSource?: {
    url: string,
    method?: 'post' | 'get'
  }
  containerProps?: Partial<{
    style?: CSSProperties
    size?: SpinSize
  }>
  inputProps?: Partial<{
    pagination?: false
    // items: { label: string, children: IS_Item[] }[],
    columns: TableColumnsType
    style?: CSSProperties
    size?: 'small' | 'large' | 'middle'
  }>
  children?: IDynConfItem[]

  searchConfig?: IMchc_FormDescriptions_Field[]
  hide_search?: boolean
  initialSearchValue?: () => AnyObject
  render?(data?: AnyObject, echart?: ECharts): any

}

