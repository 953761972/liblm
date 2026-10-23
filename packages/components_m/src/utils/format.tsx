import { formatDate, formatDateTime, formatDateTimeNoSecond } from '@lm_fe/utils';
import dayjs, { Dayjs } from 'dayjs';
import { map } from 'lodash';
export const momentDate = (date: any) => {
  if (date) return dayjs(date);
  return '';
};
export const formatTimeToStandard = (date: any) => {
  return formatDateTime(date);

};
export const formatTimeToDate = (date: any) => {
  return formatDate(date);
};
export const formatTimeToYearMonth = (date: any) => {
  return formatDateTimeNoSecond(date);

};
export const formatTimeToUTC = (date: any) => dayjs(date).toDate().toUTCString();
export const formatTimeToApi = (date: Dayjs) => date.format();
export const formatTimeToStandardApi = (date: Dayjs, format = 'YYYY-MM-DD HH:mm:ss') => {
  const formatedDate = dayjs(date).format(format);
  if (date && formatedDate !== 'Invalid date') {
    return formatedDate;
  }
  return undefined;
};
export const formatDateToStandardApi = (date: Dayjs, format = 'YYYY-MM-DD') => {
  const formatedDate = dayjs(date).format(format);
  if (date && formatedDate !== 'Invalid date') {
    return formatedDate;
  }
  return undefined;
};
export const transferMenus = (menus: any, parentid = 0) => {
  const temp: any = [];
  map(menus, (item) => {
    if (item.parentid === parentid) {
      item.title = item.name;
      item.key = item.id;
      item.children = transferMenus(menus, item.id);
      temp.push(item);
    }
  });
  return temp;
};



/**返回当前日期前后的日期 num=1返回后一天 num=-1返回前一天
 * 默认不返回年份
 */
export const fun_date = (num: any, returnyear = false, datastr?: any) => {
  var date1 = datastr ? new Date(datastr) : new Date(),
    time1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate(); //time1表示当前时间
  var date2 = new Date(date1);
  date2.setDate(date1.getDate() + num);
  const year = date2.getFullYear();
  const mon = date2.getMonth() + 1;
  const date = date2.getDate();
  if (returnyear) {
    return year + '-' + (mon < 10 ? '0' + mon : mon) + '-' + (date < 10 ? '0' + date : date);
  }
  var time2 = (mon < 10 ? '0' + mon : mon) + '-' + date;
  return time2;
};
