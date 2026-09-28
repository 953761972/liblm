import { formatDate } from '@lm_fe/utils';
import { get, set } from 'lodash';
import dayjs, { Dayjs } from 'dayjs'

import React from 'react';
import {
  IModel_EarlyPregnancyCheckSurgeryType,
  IModel_EarlyPregnancySurgicalTemplate,
  IModel_FamilyPlaningSchedulingDetails,
  SModel_FamilyPlaningSchedulingDetails,
  stupidEnums,
} from '../../.stupid_model';
import { ATTENDANCE_MAP, OPERATION_ARR, OPERATION_NAME_MAP } from './constant';
import { TabType, TAttendanceType, TMorningOrAfternoon, TOperationType } from './type';

import { BookingModalNew } from '../../.StupidModal/modals/family_planning/BookingModal/index';
import { mchcModal__ } from '@lm_fe/pages';
export function handleIsBefore(date: Dayjs) {
  const today = dayjs();
  const isBefore = dayjs(formatDate(date)).diff(dayjs(formatDate(today)), 'days');
  return isBefore;
}

export function getResidue(
  activeOperationType: Set<TOperationType>,
  scheduleDataOfThisDay?: IModel_FamilyPlaningSchedulingDetails,
) {
  let isOpen = true;
  let obj = {};
  let flagArr = [];
  if (!scheduleDataOfThisDay) return { isOpen: false };
  if (activeOperationType.size) {
    for (let item of activeOperationType) {
      // 遍历Set
      const key = OPERATION_NAME_MAP[item];
      const residueNum = get(scheduleDataOfThisDay, `${key}ResidueNum`); //剩余号源数
      let flag = true;
      if (residueNum === 0 || !get(scheduleDataOfThisDay, `${key}`)) {
        flag = false;
      }
      flagArr.push(flag);
      if (get(scheduleDataOfThisDay, `${key}`)) {
        set(obj, key, residueNum);
      }
    }
  }

  if (flagArr.length > 0) {
    if (flagArr.includes(true)) {
      isOpen = true;
    } else {
      isOpen = false;
    }
  }

  return { isOpen, ...obj };
}

export function getOperationNum(config?: IModel_FamilyPlaningSchedulingDetails, type?: TOperationType) {
  if (!config) return { all: 0, reserved: 0, isOpen: false, left: 0 };
  if (!type)
    return {
      all: config.totalNumOfDay,
      reserved: config.totalReservationNumOfDay,
      left: config.totalNumOfDay - config.totalReservationNumOfDay,
      isOpen: !!config.openReservation,
    };
  const key = OPERATION_NAME_MAP[type];

  const all: number = config[`${key}Num`] || 0;
  const reserved: number = config[`${key}ReservationNum`] || 0;
  return { all, reserved, left: all - reserved, isOpen: !!config[key] };
}
export function getOperationOpenStatusAndNum(
  type: TOperationType,
  todaySetting?: IModel_FamilyPlaningSchedulingDetails,
): number[] {
  if (!todaySetting) return [0, 5, 5];
  const key = OPERATION_NAME_MAP[type];
  const num = todaySetting[`${key}Num`];

  return [todaySetting[key], num, todaySetting.totalNumOfDay];
}
export function sortByAppointmentDate(data: IModel_EarlyPregnancyCheckSurgeryType[]) {
  return data.sort((a, b) => +(a.appointmentDate?.toDate() ?? 0) - +(b.appointmentDate?.toDate() ?? 0));
}
export function getAttendanceOfThisDay(todaySetting?: IModel_FamilyPlaningSchedulingDetails): TAttendanceType {
  if (!todaySetting) return '休息';
  return ATTENDANCE_MAP[todaySetting.attendanceSet];
}

export function findOperationCol(type: TOperationType) {
  return OPERATION_ARR.findIndex((_) => _ === type);
}

export function findColOperation(col: number) {
  return OPERATION_ARR[col];
}

export function findAppointmentOfThisDay(
  data: Partial<IModel_EarlyPregnancyCheckSurgeryType>[],
  type: TOperationType,
  appointmentDate: Dayjs,
) {
  const thiDayData = data.filter((_) => appointmentDate.isSame(_.appointmentDate, 'day'));
  return thiDayData.filter((_) => _.operationName === type);
}
export function checkDisabledHalfDay(scheduleData?: IModel_FamilyPlaningSchedulingDetails, type?: TMorningOrAfternoon) {
  if (!scheduleData || !type) return true;
  const { schedulingDate } = scheduleData;
  const attendency = getAttendanceOfThisDay(scheduleData);
  const now = dayjs()
  const isSameOrAfter = schedulingDate.isSame(now, 'day') || schedulingDate.isAfter(now, 'day')
  if (!isSameOrAfter) return true;
  if (schedulingDate.isSame(dayjs(), 'day') && type === '上午' && dayjs().hour() >= 12) return true;
  const opposite: TMorningOrAfternoon = type === '上午' ? '下午' : '上午';
  return (
    attendency === '休息' ||
    attendency === opposite ||
    ((type === '上午' ? scheduleData?.morningReservationNum : scheduleData?.afternoonReservationNum) ?? 0) >= 25
  );
}
export function getWeekStartEnd(date: Dayjs) {
  return [date.startOf('week'), date.endOf('week')];
}

export function getMonthStartEnd(date: Dayjs) {
  const startDayOfWeek = date.clone().subtract(date.date() - 1, 'days');
  const endDayOfWeek = startDayOfWeek.clone().add(date.daysInMonth() - 1, 'day');
  return [startDayOfWeek, endDayOfWeek];
}
export function getYearStartEnd(date: Dayjs) {
  const result = [date.clone().startOf('year'), date.clone().endOf('year')];
  return result;
}
export const getSchedulingData = (() => {
  const allSchedulingData = {};
  return function _getSchedulingData(date: Dayjs) {
    const dateStr = date.format('YYYY-MM-DD');
    const data = allSchedulingData[dateStr];
    return new Promise<IModel_FamilyPlaningSchedulingDetails | undefined>((res, rej) => {
      if (data && false) {
        res(data);
      } else {
        SModel_FamilyPlaningSchedulingDetails.getList({
          params: {
            schedulingDate: date,
          },
        }).then((_) => {
          const target = _[0];
          if (target) {
            allSchedulingData[dateStr] = target;
            res(target);
          } else {
            res(undefined);
          }
        });
      }
    });
  };
})();
export function getTimeFrame(mode: TabType, selectMoment: Dayjs) {
  let start: Dayjs, end: Dayjs;
  if (mode === 'day') {
    start = selectMoment;
    end = selectMoment;
  } else if (mode === 'week') {
    const [_start, _end] = getWeekStartEnd(selectMoment);
    start = _start;
    end = _end;
  } else {
    const [_start, _end] = getMonthStartEnd(selectMoment);
    start = _start.subtract(7, 'day');
    end = _end.add(7, 'day');
    start = _start;
    end = _end;
  }
  return { start, end };
}

export function findOperationColor(colorList: IModel_EarlyPregnancySurgicalTemplate[], operationName?: TOperationType) {
  const target = colorList.find((_) => _.operationName === operationName) || colorList[0];
  return target ? [target.backgroundColor, target.fontColor] : ['#fff', '#000'];
}

export function openBookingModal(
  appointmentDate: Dayjs,
  appointmentMorningOrAfternoon: TMorningOrAfternoon,
  data: Partial<IModel_EarlyPregnancyCheckSurgeryType> = {},
  onClose = () => { },
  stepNumber?: number,
) {


  mchcModal__.open('test', {
    onClose,
    modal_data: {
      content: <BookingModalNew
        step={
          stepNumber === 0 || stepNumber === 1
            ? stepNumber
            : data.id
              ? data.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('已签到') ||
                data.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('已完成')
                ? 0
                : 1
              : 0}
        data={{
          ...data,
          appointmentMorningOrAfternoon,
          appointmentDate,
        }} />
    }
  })

  // stupidModal.open('BookingModal', {
  //   onClose,
  //   modalData: {
  //     step:
  //       stepNumber === 0 || stepNumber === 1
  //         ? stepNumber
  //         : data.id
  //           ? data.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('已签到') ||
  //             data.progressStatus === stupidEnums.EarlyPregnancyCheckSurgeryType.progressStatus.getValue('已完成')
  //             ? 0
  //             : 1
  //           : 0,
  //     data: {
  //       ...data,
  //       appointmentMorningOrAfternoon,
  //       appointmentDate,
  //     },
  //   },
  // });
}
