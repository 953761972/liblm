
import { MyIcon, getBMI, } from '@lm_fe/components_m';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_Doctor_RvisitInfoOfOutpatient, } from '@lm_fe/service';
import { get } from 'lodash';
import React from 'react';
interface IProps {
  visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient,
}

function WeightExceptionChecking(weightGain: number, gestationalWeek: string, height: number, weight: number) {

  // ①当前孕周≤14时
  // 体重增长值＜0时，提示体重增长偏低；体重增长值＞2时，提示体重增长偏高
  // 注意偏低/偏高用橙色字体，下面同此

  // ②当前孕周＞14时
  // 若孕前BMI＜18.5：
  // 体重增加值＜(当前孕周-14)*0.37时，提示体重增长偏低
  // 体重增加值＞(当前孕周-14)*0.56+2时，提示体重增长偏高

  // 若18.5≤孕前BMI＜24：
  // 体重增加值＜(当前孕周-14)*0.26时，提示体重增长偏低
  // 体重增加值＞(当前孕周-14)*0.48+2时，提示体重增长偏高

  // 若24≤孕前BMI＜28：
  // 体重增加值＜(当前孕周-14)*0.22时，提示体重增长偏低
  // 体重增加值＞(当前孕周-14)*0.37+2时，提示体重增长偏高

  // 若孕前BMI≥28：
  // 体重增加值＜(当前孕周-14)*0.15时，提示体重增长偏低
  // 体重增加值＞(当前孕周-14)*0.3+2时，提示体重增长偏高


  let tips = '';
  const bmi = getBMI(
    weight - weightGain,
    height,
  );
  if (gestationalWeek <= '14') {
    if (weightGain < 0) {
      tips = '偏低'
    }
    if (weightGain > 2) {
      tips = '偏高'
    }
  }
  if (gestationalWeek > '14') {
    let week = Number(gestationalWeek.split('+')[0]) || 0
    let day = Number(gestationalWeek.split('+')[1]) || 0
    let calcDay = ((week - 14) * 7 + day) / 7 // 把天数转成周，14.x×值这样
    mchcLogger.log('bmi----', bmi, gestationalWeek)
    console.log('calcDay', calcDay)
    if (bmi < 18.5) {
      if (weightGain < calcDay * 0.37) {
        tips = '偏低'
      }
      if (weightGain > (calcDay * 0.56 + 2)) {
        tips = '偏高'
      }
    } else if (bmi < 24) {
      if (weightGain < calcDay * 0.26) {
        tips = '偏低'
      }
      if (weightGain > (calcDay * 0.48 + 2)) {
        tips = '偏高'
      }
    } else if (bmi < 28) {
      if (weightGain < calcDay * 0.22) {
        tips = '偏低'
      }
      if (weightGain > (calcDay * 0.37 + 2)) {
        tips = '偏高'
      }
    } else {
      if (weightGain < calcDay * 0.15) {
        tips = '偏低'
      }
      if (weightGain > (calcDay * 0.3 + 2)) {
        tips = '偏高'
      }
    }
  }
  return tips
}

export default function WeightGainWarningTips(props: IProps) {

  const { visitsData, } = props;
  const filtered_rvisits = (visitsData?.rvisits ?? []).filter(_ => _.id)
  const rvisit = filtered_rvisits[0] || {}



  const weightGain: number = get(rvisit, 'routineExam.weightGain') || 0


  const gestationalWeek: string = get(rvisit, 'gestationalWeek') || ''


  const height: number = get(rvisit, 'routineExam.height') || 0


  const weight: number = get(rvisit, 'routineExam.weight') || 0

  const WeightTips = WeightExceptionChecking(weightGain, gestationalWeek, height, weight)
  return (
    <>
      {
        !WeightTips ?
          <span style={{ marginLeft: 16 }}>暂无异常</span> :
          <div style={{ marginLeft: 16 }}>
            <MyIcon
              value='InfoCircleOutlined'
              style={{ color: '#ff9500', marginRight: 8 }}
            />
            体重增长<span style={{ color: '#ff9500' }}>{WeightTips}</span>
          </div>
      }
    </>
  )
}