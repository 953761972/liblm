import { AnyObject, get, isString } from "@noah-libjs/utils"


// 手机号码。身份证号码隐藏证件几位数字
export const phoneFuzzy = (val: string) => {
  if (!val) {
    return;
  }
  let reg = /^(\d{3})\d{4}(\d{4})$/g;
  return val.replace(reg, '$1****$2');
};
export const idNOFuzzy = (val: string) => {
  if (!val) {
    return;
  }
  let reg = /(\w{4})\w*(\w{4})/g;
  return val.replace(reg, '$1****$2');
};





export function getTimeSlice(hour = 24, isShowSecond = false) {
    const hourArr = Array(hour).fill(0) as number[]
    const minuteArr = Array(60).fill(0) as number[]
    return hourArr.reduce((sum, h, hIdx) => {
        return [...sum, ...minuteArr.map((m, mIdx) => `${hIdx}:${mIdx}`)]
    }, [] as string[])
}

export function is_fuck_abnormal(conf?: { isNormal?: 'true' | 'false' | null }) {
    return conf?.isNormal === 'false'
}














