import { cloneDeep, filter, get, includes, isEmpty, map, pick, set } from 'lodash';
import { IModel_EarlyPregnancySurgicalTemplate } from '../../.stupid_model';
import { mchcLogger } from '@lm_fe/env';
import { AnyObject } from '@lm_fe/utils';
const ff_toApi = (oldData: any, newData: any, date: any, tempaltes: IModel_EarlyPregnancySurgicalTemplate[]) => {
  //0为休息，1为上午，2为下午，3为全天 attendanceSet
  map(oldData, (value, key: string) => {
    if (key.indexOf(`${date}-attendanceSet`) > -1) {
      set(newData, 'attendanceSet', value);
    }
    if (key.indexOf(`${date}-surgery`) > -1) {
      const checked_values: string[] = get(oldData, `${date}-surgery.checkedValues`) || [];
      const withInputValues = get(oldData, `${date}-surgery.withInputValues`);



      //过滤出未选择的值
      const not_checked_values: IModel_EarlyPregnancySurgicalTemplate[] = filter(tempaltes, (item) => {
        return checked_values.indexOf(item.schedulingField) === -1;
      });
      //选择的值传1和号源数
      map(checked_values, (item, index) => {
        set(newData, item, 1);
        const fuck_num = get(withInputValues, [`${item}`, 'value', '0']) || 0
        const fuck_key = `${item}Num`
        set(newData, fuck_key, fuck_num);
      });
      //未选择的值传0
      if (!isEmpty(not_checked_values)) {
        map(not_checked_values, (item, index) => {
          const surgeryKey = get(item, 'schedulingField');
          set(newData, surgeryKey, 0);
        });
      }
    }
  });
  return newData;
};
const ff_formApi = (oldData: AnyObject, newData: any, date: string, tempaltes: IModel_EarlyPregnancySurgicalTemplate[]) => {
  let checkedValues: any = [];
  let withInputValues = {};
  map(oldData, (item, the_key) => {
    if (the_key === 'attendanceSet') {
      set(newData, `${date}-attendanceSet`, item);
    }
    if (tempaltes.every(_ => _.schedulingField !== the_key)) return
    //0未开放，1开放,2未开放有预约，3已满
    if (
      get(oldData, `${the_key}`) !== 0 &&
      get(oldData, `${the_key}`) !== 2
    ) {
      checkedValues.push(the_key);
      set(withInputValues, `withInputValues.${the_key}`, {
        key: the_key,
        value: {
          0: get(oldData, `${the_key}Num`),
        },
      });
    }
  });
  let surgery = { checkedValues: checkedValues, ...withInputValues };
  set(newData, `${date}SurgeryValue`, surgery);

  return newData;
};

//数据转换
export const fuck_scheduling_valueToApi = (values: any, oldData: any, tempaltes: IModel_EarlyPregnancySurgicalTemplate[]) => {
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

  map(values, (value, key: string) => {
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

  MONDAYData = ff_toApi(MONDAY, MONDAYData, 'MONDAY', tempaltes);
  TUESDAYData = ff_toApi(TUESDAY, TUESDAYData, 'TUESDAY', tempaltes);
  WEDNESDAYData = ff_toApi(WEDNESDAY, WEDNESDAYData, 'WEDNESDAY', tempaltes);
  THURSDAYData = ff_toApi(THURSDAY, THURSDAYData, 'THURSDAY', tempaltes);
  FRIDAYData = ff_toApi(FRIDAY, FRIDAYData, 'FRIDAY', tempaltes);
  SATURDAYData = ff_toApi(SATURDAY, SATURDAYData, 'SATURDAY', tempaltes);
  SUNDAYData = ff_toApi(SUNDAY, SUNDAYData, 'SUNDAY', tempaltes);

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
export const fuck_scheduling_valueToForm = (values: any, tempaltes: IModel_EarlyPregnancySurgicalTemplate[]) => {
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

  MONDAYData = ff_formApi(MONDAY, MONDAYData, 'MONDAY', tempaltes);
  TUESDAYData = ff_formApi(TUESDAY, TUESDAYData, 'TUESDAY', tempaltes);
  WEDNESDAYData = ff_formApi(WEDNESDAY, WEDNESDAYData, 'WEDNESDAY', tempaltes);
  THURSDAYData = ff_formApi(THURSDAY, THURSDAYData, 'THURSDAY', tempaltes);
  FRIDAYData = ff_formApi(FRIDAY, FRIDAYData, 'FRIDAY', tempaltes);
  SATURDAYData = ff_formApi(SATURDAY, SATURDAYData, 'SATURDAY', tempaltes);
  SUNDAYData = ff_formApi(SUNDAY, SUNDAYData, 'SUNDAY', tempaltes);

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
