import React from 'react';
import Table from './components/Table';
import Query from './components/Query';
import ModalForm from './components/ModalForm';
import { tableColumns } from './config/table';
import { BaseListOld as BaseList } from '@lm_fe/components_m';
import { isNil, isArray } from 'lodash';
import { Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { fubaoRequest as request } from '@lm_fe/utils';
class List extends BaseList {
  staticDefaultQuery = {
    page: 0,
    size: 20,
    sort: 'id,desc', // 基本列表都需要倒序
    'deleteFlag.equals': 0,
  };
  static defaultProps = {
    baseUrl: '/api/family/planning/getEarlyPregnancyCheckPacTrackingFile', request,
    baseTitle: 'PAC随访追踪',
    needPagination: true,
    showQuery: true,
    showAdd: false,
    tableColumns,
    rowKey: 'id',
    Table,
    Query,
    ModalForm,
    otherTableProps: {
      scroll: { x: 1260 },
    },
  };

  columns = [
    ...(this.props.tableColumns as Array<any>),
    {
      title: '操作',
      showSorter: false,
      showFilter: false,
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (value: any, rowData: any, index: number) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined className="global-table-action-icon global-table-action-view" />}
              onClick={this.showView(rowData)}
            >
              随访
            </Button>
          </>
        );
      },
    },
  ];

  async componentDidActivate() {
    this.handleSearch();
  }

  showView = (record: any) => () => {
    this.setState({
      currentRecord: record,
      visible: true,
      id: record.id,
    });
  };

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
    const _res = await request.get(`${baseUrl}`, { params: query });
    const res = _res.data
    if (isArray(res.data.pageData)) {
      dataSource = res.data.pageData;
    }
    if (!isNaN(Number(res.data.totalElements))) {
      total = Number(res.data.totalElements);
    }
    this.setState({ dataSource, total, loading: false });
  };

  renderOthersModal = () => {
    const { ModalForm, reload } = this.props as any;
    const { visible, editable, id, currentRecord } = this.state as any;

    return (
      visible && (
        <ModalForm
          visible={visible}
          editable={editable}
          id={id}
          currentRecord={currentRecord}
          onCancel={this.handleCancel}
          onSearch={this.handleSearch}
          reload={reload}
        />
      )
    );
  };
}
export default List
