import React from 'react';
import dayjs from 'dayjs';
import './index.less';
import { LeftOutlined, RightOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { isEqual, map as _map, isEmpty, isNil, find, get } from 'lodash';
import { 妇科专病_手术病历_mapping } from "../../../file-management/doctor-desk/components/SurgicalRecordv2/config";
const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export default class Calendar extends React.Component<any, any> {
  state = {
    curMonth: this.props.defaultVlue ? dayjs(this.props.defaultVlue) : dayjs(), //当前月
    activeDay: this.props.defaultVlue ? dayjs(this.props.defaultVlue) : dayjs(), //选中日期
    dateObj: {}, // 通过date作为key 存储日期的schedulingDetailsVMList
    reservationStatusObj: {},
    attendanceSetObj: {},
  };
  componentDidUpdate(prevProps: any) {
    if (!isEqual(prevProps.reservationPanel, this.props.reservationPanel)) {
      let dateObj = {};
      let reservationStatusObj = {};
      let attendanceSetObj = {};
      this.props.reservationPanel.map((data: any) => {
        let date = data.schedulingDate;
        dateObj[date] = data;
        reservationStatusObj[date] = data.openReservation;
        attendanceSetObj[date] = data.attendanceSet;
        return dateObj;
      });
      this.setState({ dateObj, reservationStatusObj, attendanceSetObj });
    }
  }

  renderDateDetail = (dateDetail: any) => {
    let dateDetailArr: any = [];
    if (!isEmpty(dateDetail)) {
      _map(dateDetail, (item, key) => {
        //0未开放，1开放,2未开放有预约，3已满
        if (key === get(妇科专病_手术病历_mapping, `${key}.key`) && item) {
          dateDetailArr.push({
            name: get(妇科专病_手术病历_mapping, `${key}.name`),
            key: key,
            [`${key}`]: item,
            [`${key}Num`]: get(dateDetail, `${key}Num`),
            [`${key}ReservationNum`]: get(dateDetail, `${key}ReservationNum`),
            [`${key}ResidueNum`]: get(dateDetail, `${key}ResidueNum`),
          });
        }
      });
    }

    if (isEmpty(dateDetailArr)) {
      return <div></div>;
    }

    return dateDetailArr.map((data: any, index: any) => {
      return (
        <React.Fragment key={index}>
          {get(data, `${data.key}`) && (
            <div className="flex-div flex-center flex-between project-list">
              <div className="detail-project">
                <span>{data.name}：</span>
                <span className="num">
                  <span className="num-first">{get(data, `${data.key}ReservationNum`)}/</span>
                  <span className="num-second">{get(data, `${data.key}Num`)}</span>
                </span>
                {/* 0未开放，1开放,2未开放有预约，3已满,如果为2则提示 */}
                {get(data, `${data.key}`) === 2 && (
                  <span className="tip">
                    <Tooltip title="该项目已关闭,请提示预约的患者">
                      <ExclamationCircleOutlined />
                    </Tooltip>
                  </span>
                )}
              </div>
            </div>
          )}
          {dateDetailArr.length > 5 && index === 4 && <div className="more">更多{dateDetailArr.length - 5}项</div>}
        </React.Fragment>
      );
    });
  };

  /**
   * 上月数据
   * 思路：首先要知道当前月的1号是星期几，这样才能知道要渲染多少个上个月的日子
   */
  lastMonth() {
    const { dateObj, attendanceSetObj } = this.state;
    const { curMonth } = this.props;
    const date = dayjs(curMonth).date(1); // 当前月的1号
    const count = date.day(); //1号是星期几
    date.subtract(count, 'day'); //比如本月1号是星期3，那么上个月的数据就应该显示3个
    let ui = [];
    for (let i = 0; i < count; i++) {
      const todayMoment = dayjs(date);
      const isBefore = todayMoment.isBefore(dayjs(), 'day'); //判断是否今天前的日子
      const isSame = this.state.activeDay && todayMoment.isSame(this.state.activeDay, 'day'); //判断哪一天是选中日期
      let formatDate = dayjs(date).format('YYYY-MM-DD');
      let dateDetail = dateObj[formatDate] || {};

      let attendanceSet = attendanceSetObj[formatDate];

      let dayRange = '';
      switch (attendanceSet) {
        case 0:
          dayRange = '不可约';
          break;
        case 1:
          dayRange = '上午';
          break;
        case 2:
          dayRange = '下午';
          break;
        case 3:
          dayRange = '全天';
          break;
      }

      ui.push(
        <div
          key={'lastMonth_' + i}
          className={`last-month-day day-container ${isSame ? 'now' : ''}`}
          onDoubleClick={() => !isNil(attendanceSet) && !isBefore && this.props.onChangeDate(todayMoment)}
        >
          <div className="day-container-wrap">
            <div className="flex-div flex-between flex-center day-top">
              <span>{date.date()}</span>
              {!isBefore && (
                <div className="flex-div flex-center">
                  <div>
                    {dayRange && dayRange !== '不可约' && (
                      <span
                        className="day-range"
                        style={
                          dayRange === '上午'
                            ? { backgroundColor: '#81FA9F' }
                            : dayRange === '下午'
                            ? { backgroundColor: '#81D4FA' }
                            : dayRange === '全天'
                            ? { backgroundColor: '#FADC81' }
                            : {}
                        }
                      >
                        {dayRange}
                      </span>
                    )}
                    {isNil(attendanceSet) && <span className="day-range">不可约</span>}
                    {/* <span className="day-property">节假日</span> */}
                    {attendanceSet ? <span className="day-status">开放预约</span> : <span></span>}
                  </div>
                  {!isNil(attendanceSet) && (
                    <SettingOutlined className="day-setting" onClick={() => this.props.onChangeDate(todayMoment)} />
                  )}
                </div>
              )}
            </div>
            <div className="day-content">{this.renderDateDetail(dateDetail)}</div>
          </div>
        </div>,
      );
      date.add(1, 'day');
    }
    return ui;
  }

  /**
   * 下月数据
   * 思路:首先获取本月1号的日期信息，然后通过add方法加1个月，就得到了下月1号的信息，从而得到下月1号是星期几，如果下月数据是星期2，那么下月数据就应该渲染7-2个
   * dayjs().js 中day()方法，如果是星期日，返回值为0
   */
  nextMonth() {
    const { dateObj, attendanceSetObj } = this.state;
    const { curMonth } = this.props;
    //选中的时间改为1号,并且加上1个月
    const date = dayjs(curMonth).date(1).add(1, 'months');
    const count = 7 - date.day(); //7-星期几，就可知道要渲染几个下月数据
    if (count === 7) {
      return null;
    }
    let ui = [];
    for (let i = 0; i < count; i++) {
      const todayMoment = dayjs(date);
      let formatDate = dayjs(date).format('YYYY-MM-DD');
      let dateDetail = dateObj[formatDate] || [];
      let attendanceSet = attendanceSetObj[formatDate];

      let dayRange = '';
      switch (attendanceSet) {
        case 0:
          dayRange = '不可约';
          break;
        case 1:
          dayRange = '上午';
          break;
        case 2:
          dayRange = '下午';
          break;
        case 3:
          dayRange = '全天';
          break;
      }

      //判断不可约情况下是否之前有预约的
      const flag = find(dateDetail, (value, key) => {
        return get(妇科专病_手术病历_mapping, `${key}`) && value === 2;
      });

      ui.push(
        <div
          key={'nextMonth_' + i}
          className="next-month-day day-container"
          onDoubleClick={() => !isNil(attendanceSet) && this.props.onChangeDate(todayMoment)}
        >
          <div className="day-container-wrap">
            <div className="flex-div flex-between flex-center day-top">
              <span>{date.date()}</span>
              <div className="flex-div flex-center">
                <div>
                  {dayRange && dayRange !== '不可约' && (
                    <span
                      className="day-range"
                      style={
                        dayRange === '上午'
                          ? { backgroundColor: '#81FA9F' }
                          : dayRange === '下午'
                          ? { backgroundColor: '#81D4FA' }
                          : dayRange === '全天'
                          ? { backgroundColor: '#FADC81' }
                          : {}
                      }
                    >
                      {dayRange}
                    </span>
                  )}
                  {attendanceSet === 0 && !isNil(flag) && <span className="day-range">不可约</span>}
                  {/* <span className="day-property">节假日</span> */}
                  {attendanceSet ? <span className="day-status">开放预约</span> : <span></span>}
                </div>
                {!isNil(attendanceSet) && (
                  <SettingOutlined className="day-setting" onClick={() => this.props.onChangeDate(todayMoment)} />
                )}
              </div>
            </div>
            {attendanceSet === 0 && isNil(flag) ? (
              <div className="disabled">
                <span className="disabled-img"></span>
                <span className="disabled-word">不可约</span>
              </div>
            ) : (
              <div className="day-content">{this.renderDateDetail(dateDetail)}</div>
            )}
          </div>
        </div>,
      );
      date.add(1, 'day');
    }
    return ui;
  }

  /**
   * 本月数据
   * 思路：通过moment.js 的daysInMonth方法获取当月天数
   */

  thisMonth() {
    const { dateObj, attendanceSetObj } = this.state;
    const { curMonth } = this.props;
    const date = dayjs(curMonth).date(1); //获取本月1号数据
    const count = date.daysInMonth(); //当前选中月份的总条数
    const hour = this.state.activeDay.hour(); // 当天时刻

    //最后一个工作日,本月1号,+1月-1天=本月最后一天
    let ui = [];
    for (let i = 0; i < count; i++) {
      const todayMoment = dayjs(date);
      const isBefore = todayMoment.isBefore(dayjs(), 'day'); //判断是否今天前的日子
      const isSame = this.state.activeDay && todayMoment.isSame(this.state.activeDay, 'day'); //判断哪一天是选中日期
      let formatDate = todayMoment.format('YYYY-MM-DD');

      let dateDetail = dateObj[formatDate] || {};

      let attendanceSet = attendanceSetObj[formatDate];

      let dayRange = '';
      switch (attendanceSet) {
        case 0:
          dayRange = '不可约';
          break;
        case 1:
          dayRange = '上午';
          break;
        case 2:
          dayRange = '下午';
          break;
        case 3:
          dayRange = '全天';
          break;
      }

      //判断不可约情况下是否之前有预约的
      const flag = find(dateDetail, (value, key) => {
        return get(妇科专病_手术病历_mapping, `${key}`) && value === 2;
      });

      if (isBefore) {
        // 今天前的日期置灰
        ui.push(
          <div key={'thisMonth_' + i} className="before-month-day day-container">
            <div className="day-container-wrap">
              <div className="flex-div flex-between flex-center day-top">
                <span>{date.date()}</span>
              </div>
              <div className="day-content">{this.renderDateDetail(dateDetail)}</div>
            </div>
          </div>,
        );
      } else {
        ui.push(
          <div
            key={'thisMonth_' + i}
            className={`this-month-day day-container ${isSame ? 'now' : ''} ${
              dayRange === '不可约' ? 'disabled' : ''
            } ${isNil(attendanceSet) ? 'not-open' : ''}`}
            // onClick={() => {
            //   this.setState({
            //     activeDay: todayMoment,
            //   });
            //   this.props.onPressDay && this.props.onPressDay(todayMoment);
            // }}
            onDoubleClick={() => !isNil(attendanceSet) && this.props.onChangeDate(todayMoment)}
          >
            <div className="day-container-wrap">
              <div className="flex-div flex-between flex-center day-top">
                <span>{date.date()}</span>
                <div className="flex-div flex-center">
                  <div>
                    {dayRange && dayRange !== '不可约' && (
                      <span
                        className="day-range"
                        style={
                          dayRange === '上午'
                            ? { backgroundColor: '#81FA9F' }
                            : dayRange === '下午'
                            ? { backgroundColor: '#81D4FA' }
                            : dayRange === '全天'
                            ? { backgroundColor: '#FADC81' }
                            : {}
                        }
                      >
                        {dayRange}
                      </span>
                    )}
                    {attendanceSet === 0 && !isNil(flag) && <span className="day-range">不可约</span>}
                    {/* <span className="day-property">节假日</span> */}
                    {attendanceSet ? <span className="day-status">开放预约</span> : <span></span>}
                    {/* {attendanceSet ? (
                      isSame ? (
                        dayRange === '上午' && hour < 12 ? (
                          <span className="day-status">开放预约</span>
                        ) : dayRange === '下午' && hour > 14 ? (
                          <span className="day-status">开放预约</span>
                        ) : dayRange === '全天' ? (
                          <span className="day-status">开放预约</span>
                        ) : (
                          <span></span>
                        )
                      ) : (
                        <span className="day-status">开放预约</span>
                      )
                    ) : (
                      <span></span>
                    )} */}
                  </div>
                  {!isNil(attendanceSet) && (
                    <SettingOutlined className="day-setting" onClick={() => this.props.onChangeDate(todayMoment)} />
                  )}
                </div>
              </div>
              {/* 0为不可约 且之前没有预约的人 显示不可约 */}
              {attendanceSet === 0 && isNil(flag) ? (
                <div className="disabled">
                  <span className="disabled-img"></span>
                  <span className="disabled-word">不可约</span>
                </div>
              ) : (
                <div className="day-content">{this.renderDateDetail(dateDetail)}</div>
              )}
            </div>
          </div>,
        );
      }
      date.add(1, 'day');
    }
    return ui;
  }

  render() {
    const { curMonth } = this.props;
    return (
      <div className="calendar-wrapper">
        {/* 控制按钮 */}
        <div className="calendar-top">
          <span className="top-date">
            <LeftOutlined
              style={{ fontSize: 10, cursor: 'pointer' }}
              onClick={() => {
                let val = curMonth.subtract(1, 'month');
                this.props.changeCurMonth(val);
              }}
            />
            <span>{curMonth.format('YYYY年MM月')}</span>
            <RightOutlined
              style={{ fontSize: 10, cursor: 'pointer' }}
              onClick={() => {
                let val = curMonth.add(1, 'month');
                this.props.changeCurMonth(val);
              }}
            />
          </span>
          <Button
            className="back-to-now"
            onClick={() => {
              let val = dayjs();
              this.props.changeCurMonth(val);
            }}
          >
            今天
          </Button>
          <div className="top-setting">
            <span onClick={() => this.props.setGlobalSettingModal(true)}>
              <SettingOutlined />
              <span>设置</span>
            </span>
          </div>
        </div>
        {/* 星期 */}
        <div className="week-container">
          {week.map((item, index) => {
            return <div key={'week_' + index}>{item}</div>;
          })}
        </div>
        <div className="month-container">
          {this.lastMonth()}
          {this.thisMonth()}
          {this.nextMonth()}
        </div>
      </div>
    );
  }
}
