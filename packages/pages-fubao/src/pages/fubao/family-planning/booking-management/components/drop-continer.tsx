import { get } from 'lodash';
import { Dayjs } from 'dayjs';
import React, { FC } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { IModel_EarlyPregnancyCheckSurgeryType, IModel_FamilyPlaningSchedulingDetails } from '../../../.stupid_model';
import { DD } from '../DD';
import { ItemTypes, TabType, TMorningOrAfternoon } from '../type';
import { checkDisabledHalfDay, handleIsBefore } from '../util';
import { Overlay, OverlayType } from './Overlay';
interface IProps {
  dd: DD;
  mode: TabType;
  appointmentDate: Moment;
  appointmentMorningOrAfternoon: TMorningOrAfternoon;
  scheduling?: IModel_FamilyPlaningSchedulingDetails;
  isDisabled: boolean;
}
const DropContainer: FC<IProps> = ({
  children,
  dd,
  mode,
  appointmentDate,
  appointmentMorningOrAfternoon,
  scheduling,
  isDisabled,
}) => {
  const disabledAllday = checkDisabledHalfDay(scheduling, '上午') && checkDisabledHalfDay(scheduling, '下午');
  const disabled = mode === 'month' ? disabledAllday : checkDisabledHalfDay(scheduling, appointmentMorningOrAfternoon);
  //const isWeekend = [5, 6].includes(appointmentDate.weekday());
  const isBefore = handleIsBefore(appointmentDate);
  const isWeekend = isDisabled;
  const isBeforeFlag = isBefore < 0 ? true : false;
  const schedulingFlag = get(scheduling, 'attendanceSet') === 3 ? true : false;
  // const _date = `${year}-${month - 1}-${date}`
  // const startHour = START_HOUR + col * HOUR_SPAN
  // const endHour = startHour + 1 * HOUR_SPAN
  // const startTime = new Date(`${_date} ${~~startHour}:${startHour - ~~startHour}:00`)
  // const endTime = new Date(`${_date} ${~~endHour}:${endHour - ~~endHour}:00`)

  const [{ canDrop, isOver }, dropRef] = useDrop<IModel_EarlyPregnancyCheckSurgeryType & { type: string }, any, any>({
    accept: ItemTypes,
    canDrop: (item) => {
      // if (mode === 'day') return dd.canAddInDayView(startTime, endTime, col, col + 1)
      // if (mode === 'week') return dd.canAddInWeekView(startTime, endTime,)
      // if (mode === 'month') return dd.canAddInMonthView(startTime)

      return !disabled;
    },
    drop: (item) => {
      if (mode === 'day') dd.addToDayView({ data: item, appointmentMorningOrAfternoon, appointmentDate });
      if (mode === 'week') dd.addToWeekView({ data: item, appointmentMorningOrAfternoon, appointmentDate });
      // if (mode === 'month') dd.addToMonthView({ startTime, data: item, id: item.id })

      return true;
    },
    // drop: (item, monitor) => {
    //   console.log('item --- drop', item, monitor.getClientOffset(), monitor.getDifferenceFromInitialOffset())
    //   return ({ item, position: monitor.getSourceClientOffset() })
    // },
    collect: (monitor: DropTargetMonitor) => {
      // console.log('item --- collect', monitor)

      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  return (
    <div
      className="drop-container"
      ref={dropRef}
      onClickCapture={(e) => {
        if (disabled) {
          // e.stopPropagation()
        }
      }}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        background: disabled ? '#F4F6FC' : 'unset',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
      {
        (mode === 'day' ? true : isBeforeFlag || !isWeekend || schedulingFlag)
          ? null
          : <div

            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span className="disabled-img"></span>
            <span className="disabled-word">不可约</span>
          </div>
      }

      {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />}
    </div>
  );
};
export default DropContainer;
