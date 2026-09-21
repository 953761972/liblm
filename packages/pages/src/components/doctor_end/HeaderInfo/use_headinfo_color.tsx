
import { TLevelType } from '@lm_fe/env';

import { calc_colors, use_provoke } from '@lm_fe/provoke';



export function use_headinfo_color(highriskLable?: TLevelType) {


  const { 可选传染病, 可选高危等级, sys_theme } = use_provoke('可选传染病', '可选高危等级', 'sys_theme',)

  const is_dark = sys_theme.darkTheme
  const cur = 可选高危等级?.find(_ => _.levelText === highriskLable)

  const colors = calc_colors(cur?.color)

  const 高危背景 = is_dark ? sys_theme.bg_color : colors?.light[3]
  const 高危文字颜色 = is_dark ? colors?.primary : colors?.dark[1]

  return {
    高危颜色: cur?.color,
    高危文字: cur?.colorText,
    高危文字颜色,
    高危背景,
    传染病颜色: 可选传染病?.color
  }
}




