import React from 'react';
import Table from './components/Table';
import Query from './components/Query';
import { tableColumns } from './config/table';
import { BaseListOld as BaseList } from '@lm_fe/components_m';
import { get, isNil, isArray } from 'lodash';
import { message } from 'antd';
import { fubaoRequest as request } from '@lm_fe/utils';

class List extends BaseList {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
    'deleteFlag.equals': 0,
    'followUpSituation.equals': 1,
  };
  static defaultProps = {
    baseUrl: '/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday', request,
    baseTitle: '',
    needPagination: true,
    showQuery: false,
    showAdd: false,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    otherTableProps: {
      scroll: { x: 1260 },
    },
  };

  columns = [...(this.props.tableColumns as Array<any>)];

  async componentDidActivate() {
    this.handleSearch();
  }

  handleSearch = async () => {
    const { editKey, defaultQuery } = this.state;
    const { baseUrl } = this.props;
    if (!baseUrl) {
      return;
    }
    if (!isNil(editKey)) {
      message.error('请保存未保存的记录');
      return;
    }
    this.setState({ loading: true });
    let dataSource = [];
    let total = 0;
    const query = this.formatQuery(defaultQuery);
    if (get(query, 'followUpSituation.equals')) {
      const res = (await request.get(`${baseUrl}`, { params: query })).data
      if (isArray(res.data.pageData)) {
        dataSource = res.data.pageData;
      }
      if (!isNaN(Number(res.data.totalElements))) {
        total = Number(res.data.totalElements);
      }
      this.setState({ dataSource, total, loading: false });
    }
  };
}
export default List
