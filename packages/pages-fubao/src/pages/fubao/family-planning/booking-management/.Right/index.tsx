import { LeftOutlined, RightOutlined, SyncOutlined } from '@ant-design/icons';
import { DatePicker_L } from '@lm_fe/components';
import { Button, Divider, Tag } from 'antd';
import { get } from 'lodash';
import dayjs, { Dayjs } from 'dayjs'

import React, { useEffect, useState } from 'react';
import {
  IModel_EarlyPregnancySurgicalTemplate,
  IModel_FamilyPlaningSchedulingDetails,
  IModel_FamilyPlanningDefaultSetting,
  SModel_EarlyPregnancyCheckSurgeryType
} from '../../../.stupid_model';
import { OPERATION_ARR } from '../constant';
import { DD } from '../DD';
import { IBooking, TabType, TOperationType } from '../type';
import {
  findOperationColor,
  getOperationNum
} from '../util';
import DateSelect from './DateSelect';
import MonthSelect from './MonthSelect';
import './right.less';
import WeekSelect from './WeekSelect';
function Label(props: { title: string; num?: number; color?: string }) {
  return (
    <span style={{ fontSize: 16, color: '#828C99' }}>
      {props.title}：<span style={{ fontSize: 36, color: props.color }}>{props.num}</span>人
    </span>
  );
}
export interface IBaseProps {
  bookingData: IBooking[];
  dd: DD;
  selectedDate: Dayjs;
  mode: TabType;
  setSelectedDate: (v: Dayjs) => void;
  setMode: (v: TabType) => void;
  findColor2: (v: TOperationType) => string[];
  daysSetting?: IModel_FamilyPlanningDefaultSetting;
  scheduleArr: IModel_FamilyPlaningSchedulingDetails[];
  activeOperationType: Set<TOperationType>;
}
const tagHeight = 44;
export default function Right(props: {
  dd: DD;
  colorList: IModel_EarlyPregnancySurgicalTemplate[];
  toggleNode: React.ReactNode;
}) {
  const { dd, colorList, toggleNode } = props;
  const [mode, setMode] = useState<TabType>('day');
  const [bookingData, setBookingData] = useState<IBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [daysSetting, setDaysSetting] = useState<IModel_FamilyPlanningDefaultSetting>();
  const [activeOperationType, setActiveOperationType] = useState<Set<TOperationType>>(new Set());
  const [scheduleArr, setScheduleArr] = useState<IModel_FamilyPlaningSchedulingDetails[]>([]);
  const [statisticData, setStatisticData] =
    useState<{ appointmentNum: number; completeNum: number; signNum: number; timeout: number }>();

  function findColor2(type: TOperationType) {
    if (!activeOperationType.size) return findOperationColor(colorList, type);
    return activeOperationType.has(type) ? findOperationColor(colorList, type) : ['transparent', '#ddd', '#ccc'];
  }

  const baseData: IBaseProps = {
    setMode,
    setSelectedDate,
    mode,
    selectedDate,
    bookingData,
    daysSetting,
    findColor2,
    scheduleArr: dd.scheduleArr,
    activeOperationType,
    ...props,
  };
  useEffect(() => {
    dd.selectMoment = selectedDate;
    dd.mode = mode;
    dd.initData();
    dd.getStatistic();
    dd.getBetweenList();
    // const isMonth = mode === 'month';
    // const { start, end } = getTimeFrame(mode, selectedDate);

    //SModel_EarlyPregnancyCheckSurgeryType.getStatistic(start, end).then(setStatisticData);
    // SModel_FamilyPlaningSchedulingDetails.getBetweenList(
    //   isMonth ? start.subtract(7, 'day') : start,
    //   isMonth ? end.add(7, 'day') : end,
    // ).then(setScheduleArr);
    setActiveOperationType(new Set());
  }, [mode, selectedDate, dd]);

  useEffect(() => {
    SModel_EarlyPregnancyCheckSurgeryType.getFamilyPlanningDefaultSetting().then(setDaysSetting);
    const cb = dd.observe(setBookingData);
    return cb;
  }, []);

  function next() {
    const target = selectedDate.clone().add(1, mode);
    setSelectedDate(target);
  }
  function pre() {
    const target = selectedDate.clone().subtract(1, mode);
    setSelectedDate(target);
  }
  function toggleActiveType(type: TOperationType) {
    const isActive = activeOperationType.has(type);
    activeOperationType[isActive ? 'delete' : 'add'](type);
    setActiveOperationType(new Set(activeOperationType));
  }

  const headHeight = 54;
  const middleHeight = 42;

  return (
    <div style={{ background: '#fff', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {toggleNode}
      <div style={{ height: headHeight, padding: '0 18px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Label title="已预约" num={dd.statisticData?.appointmentNum} color="#828C99" />
          <Label title="已签到" num={dd.statisticData?.signNum} color="#314BD2" />
          <Label title="已完成" num={dd.statisticData?.completeNum} color="#02937F" />
        </div>
        <Divider style={{ margin: 0 }} />
      </div>
      <div style={{ padding: '4px 18px 0', position: 'relative', height: middleHeight }}>
        <div>
          <Button style={{ color: '#979797' }} size="small" type="text" icon={<LeftOutlined />} onClick={pre} />
          <DatePicker_L
            value={selectedDate}
            onChange={(v) => v && setSelectedDate(v)}
            picker={mode === 'day' ? 'date' : mode}
            bordered={false}
            style={{ width: 110 }}
          />
          <Button style={{ color: '#979797' }} size="small" type="text" icon={<RightOutlined />} onClick={next} />
          <Button
            type="text"
            style={{ background: '#fff', color: '#979797', marginLeft: 16 }}
            onClick={() => setSelectedDate(selectedDate.clone())}
            title="刷新数据"
            icon={<SyncOutlined />}
          />
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
          <Button.Group style={{}}>
            <Button
              type={mode === 'day' ? 'primary' : 'text'}
              onClick={(e) => setMode('day')}
              style={{ borderRadius: 4 }}
            >
              日
            </Button>
            <Button
              type={mode === 'week' ? 'primary' : 'text'}
              onClick={(e) => setMode('week')}
              style={{ margin: '0 28px', borderRadius: 4 }}
            >
              周
            </Button>
            <Button
              type={mode === 'month' ? 'primary' : 'text'}
              onClick={(e) => setMode('month')}
              style={{ borderRadius: 4 }}
            >
              月
            </Button>
          </Button.Group>
        </div>
        <Divider style={{ margin: '4px 0 0 0' }} />
      </div>
      <div
        style={{
          height: tagHeight,
          // boxShadow: '-2px -2px 6px 0px #ccc',
          lineHeight: `${tagHeight}px`,
          background: '#fff',
          zIndex: 1,
          // padding: '2px 0',
          position: 'relative',
          overflowX: 'hidden',
          userSelect: 'none',
        }}
      >
        <span style={{ marginLeft: 24, color: '#828C99', fontSize: 14 }}>类型：</span>
        {mode === 'day' && !get(dd.scheduleArr[0], 'attendanceSet') ? (
          <span style={{ color: 'rgb(130, 140, 153)' }}>暂无</span>
        ) : (
          colorList
            .filter((_) => {
              const isOpen = getOperationNum(dd.scheduleArr[0], _.operationName as any).isOpen;
              return mode === 'day' ? isOpen : OPERATION_ARR.includes(_.operationName);
            })
            .map((_) => {
              const isActive = activeOperationType.has(_.operationName);

              const reservedData = getOperationNum(dd.scheduleArr[0], _.operationName);
              return (
                <Tag
                  onClick={() => toggleActiveType(_.operationName)}
                  color={_.backgroundColor}
                  style={{
                    cursor: 'pointer',
                    outline: isActive ? `2px solid ${_.fontColor}` : '',
                    transform: isActive ? 'translateY(-8px)' : '',
                    position: 'relative',
                  }}
                >
                  <span style={{ color: _.fontColor }}>
                    {_.operationName}
                    {mode === 'day' ? `${reservedData.reserved}/${reservedData.all}` : ''}
                  </span>
                  {isActive ? (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        position: 'absolute',
                        left: '50%',
                        bottom: '-11px',
                        transform: 'translateX(-50%)',
                        backgroundColor: _.fontColor,
                      }}
                    ></span>
                  ) : (
                    ''
                  )}
                </Tag>
              );
            })
        )}
      </div>
      <div style={{ height: `calc(100% - ${headHeight}px - ${middleHeight}px - ${tagHeight}px)`, display: 'flex' }}>
        {mode === 'day' && <DateSelect {...baseData} />}
        {mode === 'week' && <WeekSelect {...baseData} />}
        {mode === 'month' && <MonthSelect {...baseData} />}
      </div>
    </div>
  );
}
