import { map, get, isEmpty, set, filter } from 'lodash';
import { 妇科专病_手术病历_mapping } from "../../../file-management/doctor-desk/components/SurgicalRecordv2/config";


//数据转换
export const valueToApi = (values: any, reservationNumObj: any) => {
  let newValues = {};
  let reservationArr: any = [];
  const checkedValues = get(values, `checkedValues`) || [];
  const withInputValues = get(values, `withInputValues`);

  //过滤出未选择的值
  const notCheckedValues = filter(妇科专病_手术病历_mapping, (item) => {
    return checkedValues.indexOf(`${get(item, 'key')}`) === -1;
  });

  //选择了的传1 没选择的传0
  map(checkedValues, (item, index) => {
    set(newValues, item, 1);
    set(newValues, `${item}Num`, get(withInputValues, [`${item}`, 'value', '0']) || 0);
  });

  if (!isEmpty(notCheckedValues)) {
    map(notCheckedValues, (item, index) => {
      const surgeryKey = get(item, `key`);
      set(newValues, surgeryKey, 0);

      //过滤出有预约的手术
      if (reservationNumObj.has(surgeryKey)) {
        reservationArr.push(surgeryKey);
      }
    });
  }
  return { newValues: newValues, reservationArr: reservationArr };
};
export const valueToForm = (values: any) => {
  let checkedValues: any = [];
  let withInputValues = {};
  const m = new Map();

  map(values, (item, itemIndex) => {
    //0未开放，1开放,2未开放有预约，3已满
    if (
      itemIndex === get(妇科专病_手术病历_mapping, `${itemIndex}.key`) &&
      get(values, `${itemIndex}`) !== 0 &&
      get(values, `${itemIndex}`) !== 2
    ) {
      checkedValues.push(itemIndex);
      set(withInputValues, `withInputValues.${itemIndex}`, {
        key: itemIndex,
        value: {
          0: get(values, `${itemIndex}Num`),
        },
      });
    }

    //过滤出有预约的手术
    if (
      itemIndex !== 'totalReservationNumOfDay' &&
      itemIndex !== 'morningReservationNum' &&
      itemIndex !== 'afternoonReservationNum' &&
      itemIndex.indexOf('ReservationNum') > -1 &&
      item
    ) {
      m.set(itemIndex.slice(0, itemIndex.indexOf('ReservationNum')), item);
    }
  });
  let surgery = { checkedValues: checkedValues, ...withInputValues };
  let newValues = { ...values, surgery };

  return { newValues: newValues, reservationNumObj: m };
};
