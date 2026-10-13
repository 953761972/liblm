import React, { Component } from 'react';
import Table3 from './components/table3';
import Table2 from './components/table2';
import Table1 from './components/table1';
import { Tabs } from 'antd';
import { get, isNaN } from 'lodash';
import './index.less';
import ss from './images/ss.svg';
import xj from './images/xj.svg';
import { fubaoRequest as request } from '@lm_fe/utils';
export default class BedManagement extends Component {
  state = {
    statisticsData: {},
    activeKey: '1',
    toBeFollowedUp: 0,
    followedUp: 0,
    allFollowedUp: 0,
  };
  async componentDidMount() {
    this.handleInit();
  }

  handleInit = async () => {
    let toBeFollowedUp = 0;
    let followedUp = 0;
    let allFollowedUp = 0;
    let dataSource1 = (await request.get(
      `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday?sort=id,desc&page=0&size=20&deleteFlag.equals=0&followUpSituation.equals=0`,
    )).data;
    let dataSource2 = (await
      request.get(
        `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday?sort=id,desc&page=0&size=20&deleteFlag.equals=0&followUpSituation.equals=1`,
      )
    ).data;
    let dataSource3 = (
      await request.get(
        `/api/family/planning/getEarlyPregnancyCheckPacTrackingFile?sort=id,desc&page=0&size=20&deleteFlag.equals=0`,
      )
    ).data;
    let statisticsData = (
      await request.get(
        `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileTodayAlready?deleteFlag.equals=0`,
      )
    ).data;

    if (!isNaN(Number(dataSource1.data.totalElements))) {
      toBeFollowedUp = Number(dataSource1.data.totalElements);
    }

    if (!isNaN(Number(dataSource2.data.totalElements))) {
      followedUp = Number(dataSource2.data.totalElements);
    }

    if (!isNaN(Number(dataSource3.data.totalElements))) {
      allFollowedUp = Number(dataSource3.data.totalElements);
    }

    if (get(statisticsData, 'data')) {
      statisticsData = get(statisticsData, 'data');
    }
    this.setState({ statisticsData, toBeFollowedUp, followedUp, allFollowedUp });
  };

  onChange = (activeKey: any) => {
    this.setState({
      activeKey,
    });
  };
  render() {
    const { statisticsData, toBeFollowedUp, followedUp, allFollowedUp, activeKey } = this.state;
    return (
      <div className="tracing-mamagement">
        <Tabs defaultActiveKey="1" centered onChange={this.onChange}>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">
                  <img src={ss} />
                </span>
                今日待随访<span className="fontNumber">{toBeFollowedUp}</span>人
              </span>
            }
            key="1"
            className="tab1"
          >
            {activeKey === '1' ? <Table1 reload={this.handleInit} /> : <div></div>}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">
                  <img src={xj} />
                </span>
                今日已随访<span className="fontNumber">{followedUp}</span>人
              </span>
            }
            key="2"
            className="tab2"
          >
            <div className="statistics-container">
              <div className="item">
                <div className="title">随访情况-正常</div>
                <div className="num">{get(statisticsData, 'normal')} 人</div>
              </div>
              <div className="item">
                <div className="title">随访情况-未接听</div>
                <div className="num">{get(statisticsData, 'notAnswer')} 人</div>
              </div>
              <div className="item">
                <div className="title">随访情况-号码错误</div>
                <div className="num">{get(statisticsData, 'wrongNumber')} 人</div>
              </div>
              <div className="item">
                <div className="title">随访情况-失访</div>
                <div className="num">{get(statisticsData, 'loseTrack')} 人</div>
              </div>
            </div>
            {activeKey === '2' ? <Table2 reload={this.handleInit} /> : <div></div>}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span className="tabTitle">
                <span className="tabTitle-img">
                  <img src={ss} />
                </span>
                全部用户<span className="fontNumber">{allFollowedUp}</span>人
              </span>
            }
            key="3"
          >
            {activeKey === '3' ? <Table3 reload={this.handleInit} /> : <div></div>}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
