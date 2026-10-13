import { map, get, isEmpty, set, pick, filter } from 'lodash';
import { 妇科专病_手术病历_mapping } from "../file-management/doctor-desk/components/SurgicalRecordv2/config";
const toApi = (oldData: any, newData: any, date: any) => {
  //0为休息，1为上午，2为下午，3为全天 attendanceSet
  map(oldData, (value, key) => {
    if (key.indexOf(`${date}-attendanceSet`) > -1) {
      set(newData, 'attendanceSet', value);
    }
    if (key.indexOf(`${date}-surgery`) > -1) {
      const checkedValues = get(oldData, `${date}-surgery.checkedValues`) || [];
      const withInputValues = get(oldData, `${date}-surgery.withInputValues`);

      //过滤出未选择的值
      const notCheckedValues = filter(妇科专病_手术病历_mapping, (item) => {
        return checkedValues.indexOf(`${get(item, 'key')}`) === -1;
      });
      //选择的值传1和号源数
      map(checkedValues, (item, index) => {
        set(newData, item, 1);
        set(newData, `${item}Num`, get(withInputValues, [`${item}`, 'value', '0']) || 0);
      });
      //未选择的值传0
      if (!isEmpty(notCheckedValues)) {
        map(notCheckedValues, (item, index) => {
          const surgeryKey = get(item, `key`);
          set(newData, surgeryKey, 0);
        });
      }
    }
  });
  return newData;
};
const formApi = (oldData: any, newData: any, date: any) => {
  let checkedValues: any = [];
  let withInputValues = {};

  map(oldData, (item, itemIndex) => {
    if (itemIndex === 'attendanceSet') {
      set(newData, `${date}-attendanceSet`, item);
    }
    //0未开放，1开放,2未开放有预约，3已满
    if (
      itemIndex === get(妇科专病_手术病历_mapping, `${itemIndex}.key`) &&
      get(oldData, `${itemIndex}`) !== 0 &&
      get(oldData, `${itemIndex}`) !== 2
    ) {
      checkedValues.push(itemIndex);
      set(withInputValues, `withInputValues.${itemIndex}`, {
        key: itemIndex,
        value: {
          0: get(oldData, `${itemIndex}Num`),
        },
      });
    }
  });
  let surgery = { checkedValues: checkedValues, ...withInputValues };
  set(newData, `${date}SurgeryValue`, surgery);

  return newData;
};

//数据转换
export const valueToApi = (values: any, oldData: any) => {
  //星期一
  let MONDAY = {};
  let MONDAYData = {
    whatDay: 'MONDAY',
  };
  //星期二
  let TUESDAY = {};
  let TUESDAYData = {
    whatDay: 'TUESDAY',
  };
  //星期三
  let WEDNESDAY = {};
  let WEDNESDAYData = {
    whatDay: 'WEDNESDAY',
  };
  //星期四
  let THURSDAY = {};
  let THURSDAYData = {
    whatDay: 'THURSDAY',
  };
  //星期五
  let FRIDAY = {};
  let FRIDAYData = {
    whatDay: 'FRIDAY',
  };
  //星期六
  let SATURDAY = {};
  let SATURDAYData = {
    whatDay: 'SATURDAY',
  };
  //星期日
  let SUNDAY = {};
  let SUNDAYData = {
    whatDay: 'SUNDAY',
  };

  map(values, (value, key) => {
    if (key.indexOf('MONDAY') > -1) {
      set(MONDAY, key, value);
    }
    if (key.indexOf('TUESDAY') > -1) {
      set(TUESDAY, key, value);
    }
    if (key.indexOf('WEDNESDAY') > -1) {
      set(WEDNESDAY, key, value);
    }
    if (key.indexOf('THURSDAY') > -1) {
      set(THURSDAY, key, value);
    }
    if (key.indexOf('FRIDAY') > -1) {
      set(FRIDAY, key, value);
    }
    if (key.indexOf('SATURDAY') > -1) {
      set(SATURDAY, key, value);
    }
    if (key.indexOf('SUNDAY') > -1) {
      set(SUNDAY, key, value);
    }
  });

  MONDAYData = toApi(MONDAY, MONDAYData, 'MONDAY');
  TUESDAYData = toApi(TUESDAY, TUESDAYData, 'TUESDAY');
  WEDNESDAYData = toApi(WEDNESDAY, WEDNESDAYData, 'WEDNESDAY');
  THURSDAYData = toApi(THURSDAY, THURSDAYData, 'THURSDAY');
  FRIDAYData = toApi(FRIDAY, FRIDAYData, 'FRIDAY');
  SATURDAYData = toApi(SATURDAY, SATURDAYData, 'SATURDAY');
  SUNDAYData = toApi(SUNDAY, SUNDAYData, 'SUNDAY');

  //拿到旧数据和新数据合并提交（各个id）
  const familyPlanningDefaultSettingDetails = get(oldData, 'familyPlanningDefaultSettingDetails') || [];
  const MONDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'MONDAY';
  });
  const TUESDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'TUESDAY';
  });
  const WEDNESDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'WEDNESDAY';
  });
  const THURSDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'THURSDAY';
  });
  const FRIDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'FRIDAY';
  });
  const SATURDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'SATURDAY';
  });
  const SUNDAYOldData = familyPlanningDefaultSettingDetails.find((currentValue: any) => {
    return get(currentValue, 'whatDay') === 'SUNDAY';
  });

  let resultArr = [
    { ...MONDAYOldData, ...MONDAYData },
    { ...TUESDAYOldData, ...TUESDAYData },
    { ...WEDNESDAYOldData, ...WEDNESDAYData },
    { ...THURSDAYOldData, ...THURSDAYData },
    { ...FRIDAYOldData, ...FRIDAYData },
    { ...SATURDAYOldData, ...SATURDAYData },
    { ...SUNDAYOldData, ...SUNDAYData },
  ];

  let resultStr = pick(values, [
    'cancelReservation',
    'reservationTime',
    'statutoryHoliday',
    'statutoryHolidayRepair',
    'id',
  ]);
  let result = { familyPlanningDefaultSettingDetails: resultArr, ...resultStr };
  return result;
};
export const valueToForm = (values: any) => {
  //星期一
  let MONDAY = {};
  let MONDAYData = {};
  //星期二
  let TUESDAY = {};
  let TUESDAYData = {};
  //星期三
  let WEDNESDAY = {};
  let WEDNESDAYData = {};
  //星期四
  let THURSDAY = {};
  let THURSDAYData = {};
  //星期五
  let FRIDAY = {};
  let FRIDAYData = {};
  //星期六
  let SATURDAY = {};
  let SATURDAYData = {};
  //星期日
  let SUNDAY = {};
  let SUNDAYData = {};

  map(values, (value, index) => {
    if (get(value, 'whatDay') === 'MONDAY') {
      MONDAY = value;
    }
    if (get(value, 'whatDay') === 'TUESDAY') {
      TUESDAY = value;
    }
    if (get(value, 'whatDay') === 'WEDNESDAY') {
      WEDNESDAY = value;
    }
    if (get(value, 'whatDay') === 'THURSDAY') {
      THURSDAY = value;
    }
    if (get(value, 'whatDay') === 'FRIDAY') {
      FRIDAY = value;
    }
    if (get(value, 'whatDay') === 'SATURDAY') {
      SATURDAY = value;
    }
    if (get(value, 'whatDay') === 'SUNDAY') {
      SUNDAY = value;
    }
  });

  MONDAYData = formApi(MONDAY, MONDAYData, 'MONDAY');
  TUESDAYData = formApi(TUESDAY, TUESDAYData, 'TUESDAY');
  WEDNESDAYData = formApi(WEDNESDAY, WEDNESDAYData, 'WEDNESDAY');
  THURSDAYData = formApi(THURSDAY, THURSDAYData, 'THURSDAY');
  FRIDAYData = formApi(FRIDAY, FRIDAYData, 'FRIDAY');
  SATURDAYData = formApi(SATURDAY, SATURDAYData, 'SATURDAY');
  SUNDAYData = formApi(SUNDAY, SUNDAYData, 'SUNDAY');

  let result = {
    ...MONDAYData,
    ...TUESDAYData,
    ...WEDNESDAYData,
    ...THURSDAYData,
    ...FRIDAYData,
    ...SATURDAYData,
    ...SUNDAYData,
  };

  return result;
};
