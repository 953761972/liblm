import { Badge, Button, Col, Row, Popover } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { IBaseProps } from '.';
import DropContainer from '../components/drop-continer';
import { checkDisabledHalfDay, getWeekStartEnd, open_booking, getOperationNum, getResidue } from '../util';
import dayjs from 'dayjs';
import { get, map as _map } from 'lodash';
import { TMorningOrAfternoon } from '../type';
import { NurseTypesMapping } from '../../file-management/doctor-desk/components/FirstVisitv2/config';
interface IProps extends IBaseProps {}
export default function DateSelect(props: IProps) {
  const { setMode, setSelectedDate, bookingData, dd, selectedDate, findColor2, scheduleArr, activeOperationType } =
    props;
  const [startDayOfWeek, endDayOfWeek] = getWeekStartEnd(selectedDate);

  const borderStyle = '1px solid #EDEEF6';
  const headHeight = 10;

  const renderResidueContent = (residueObj: {}) => {
    return _map(residueObj, (value, key) => {
      if (key !== 'isOpen') {
        const [backgroundColor, fontColor, textColor] = findColor2(NurseTypesMapping[key]['name']);
        return (
          <div key={key} style={{ fontSize: 12 }}>
            <span style={{ color: fontColor, fontWeight: 600 }}>{NurseTypesMapping[key]['name']}:</span>
            <span style={{ color: '#8A96A0' }}>剩余可约号{value}个</span>
          </div>
        );
      } else {
        return <></>;
      }
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <table
        width="98%"
        cellSpacing={'10px'}
        cellPadding={0}
        style={{ height: '100%' }}
        borderColor="#EDEEF6"
        border={1}
      >
        <tr style={{ height: '6%', backgroundColor: '#F9F9FC' }}>
          <td></td>
          {Array(7)
            .fill(0)
            .map((_, colIndex) => {
              const date = startDayOfWeek.clone().add(colIndex, 'day');
              const isToday = date.isSame(dayjs(), 'day');

              return (
                <td style={{ textAlign: 'center', lineHeight: `${headHeight}px`, height: headHeight }}>
                  <Button
                    type={isToday ? 'primary' : 'text'}
                    size="small"
                    onClick={() => {
                      setSelectedDate(date);
                      setMode('day');
                    }}
                  >
                    {date.format('MM-DD dddd')}
                  </Button>
                </td>
              );
            })}
        </tr>

        {[0, 0].map((_, rowIndex) => {
          const morningOrAfternoon: TMorningOrAfternoon = rowIndex < 1 ? '上午' : '下午';

          const realDataArr = bookingData.filter((_) => _.appointmentMorningOrAfternoon === morningOrAfternoon);

          return (
            <tr key={rowIndex} style={{ height: `47%` }}>
              <td width={40} style={{ textAlign: 'center', writingMode: 'vertical-lr', borderRight: borderStyle }}>
                <span style={{ letterSpacing: 8, fontSize: 16 }}>{morningOrAfternoon}</span>
              </td>
              {Array(7)
                .fill(0)
                .map((_, colIndex) => {
                  const targetStartMoment = startDayOfWeek.clone().add(colIndex, 'day');
                  const item = realDataArr.filter((_) => _.appointmentDate.isSame(targetStartMoment, 'day'));
                  const scheduling = scheduleArr.find((_) => _.schedulingDate.isSame(targetStartMoment, 'day'));
                  const disabled = checkDisabledHalfDay(scheduling, morningOrAfternoon);
                  const isToday = targetStartMoment.isSame(dayjs(), 'day');
                  const residueObj = getResidue(activeOperationType, scheduling);

                  return (
                    <td
                      rowSpan={1}
                      key={colIndex}
                      className={isToday ? 'border-left-right' : ''}
                      style={{ position: 'relative' }}
                    >
                      <DropContainer
                        mode={'week'}
                        scheduling={scheduling}
                        appointmentDate={targetStartMoment}
                        dd={dd}
                        appointmentMorningOrAfternoon={morningOrAfternoon}
                        isDisabled={disabled}
                      >
                        <div style={{ height: '100%', padding: 4, overflowY: 'auto' }}>
                          {item.map((_) => {
                            const data = _.data;
                            const [backgroundColor, fontColor, textColor] = findColor2(_.data?.operationName);

                            return (
                              <div
                                className="hover-shadow"
                                onClick={() =>
                                  open_booking(targetStartMoment, morningOrAfternoon, data, () => {
                                    dd.initData();
                                    dd.getStatistic();
                                    dd.getBetweenList();
                                  })
                                }
                                style={{
                                  borderLeft: `4px solid ${fontColor}`,
                                  borderRadius: 4,
                                  display: 'flex',
                                  flex: 1,
                                  margin: '6px 4px',
                                  padding: '2px 0 2px 4px',
                                  background: false ? '#666' : backgroundColor,
                                  position: 'relative',
                                }}
                              >
                                <Row style={{ lineHeight: '20px' }}>
                                  <Col>
                                    <span style={{ color: textColor || '#150F55', fontWeight: 600, marginRight: 4 }}>
                                      {data.name}
                                    </span>
                                  </Col>
                                  <Col>
                                    <span style={{ fontSize: 12, color: textColor }}>{data.operationName}</span>
                                  </Col>
                                </Row>
                              </div>
                            );
                          }) || null}
                          {get(residueObj, 'isOpen') && Object.keys(residueObj).length > 1 ? (
                            <Popover content={renderResidueContent(residueObj)} title="">
                              <Button
                                className={`week-add-button ${!get(residueObj, 'isOpen') ? 'disabled' : ''}`}
                                hidden={disabled}
                                type="dashed"
                                block
                                icon={<PlusCircleOutlined />}
                                style={{
                                  margin: '4px 0',
                                  //color: '#5A6676',
                                  position: 'sticky',
                                  bottom: 0,
                                }}
                                onClick={() =>
                                  open_booking(targetStartMoment, morningOrAfternoon, {}, () => {
                                    dd.initData();
                                    dd.getStatistic();
                                    dd.getBetweenList();
                                  })
                                }
                              >
                                添加
                              </Button>
                            </Popover>
                          ) : (
                            <Button
                              className={`week-add-button ${!get(residueObj, 'isOpen') ? 'disabled' : ''}`}
                              hidden={disabled}
                              type="dashed"
                              block
                              icon={<PlusCircleOutlined />}
                              style={{
                                margin: '4px 0',
                                //color: `${!get(residueObj, 'isOpen') ? 'rgba(130,140,153,0.2)' : '#5A6676'}`,
                                position: 'sticky',
                                bottom: 0,
                                cursor: `${!get(residueObj, 'isOpen') ? 'not-allowed' : 'pointer'}`,
                              }}
                              onClick={
                                !get(residueObj, 'isOpen')
                                  ? () => {}
                                  : () =>
                                      open_booking(targetStartMoment, morningOrAfternoon, {}, () => {
                                        dd.initData();
                                        dd.getStatistic();
                                        dd.getBetweenList();
                                      })
                              }
                            >
                              添加
                            </Button>
                          )}
                        </div>
                      </DropContainer>
                    </td>
                  );
                })}
            </tr>
          );
        })}
      </table>
    </div>
  );
}
