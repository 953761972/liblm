import { LazyAntd } from '@lm_fe/components';
import { APP_CONFIG } from '@lm_fe/env';
import { formatDate } from '@lm_fe/utils';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep, filter, get, indexOf, isArray, isEmpty, isEqual, join, map, set } from 'lodash';
import React, { Component } from 'react';
import BaseFormComponent from '../../../BaseFormComponent';
import './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default class MyTable2 extends Component {
  columns: any;

  constructor(props) {
    super(props);
    this.columns = get(props, 'input_props.tableColumns');
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    if (!isEqual(prevProps.value, value)) {
      this.setState({
        dataSource: map(value, (item) => ({ ...item, key: get(item, 'key') || get(item, 'id') })),
      });
    }
  }

  formatColumns = (columns: any) => {
    return map(columns, (column) => {
      const { children, align, width } = column;
      const editable = get(column, 'editable') || get(this.props, 'input_props.editable');
      const inputType = get(column, 'inputType') || get(column, 'editor.input_type');
      const dataIndex = get(column, 'dataIndex') || get(column, 'key');
      const inputProps = get(column, 'inputProps') || get(column, 'editor.input_props');
      if (!isEmpty(children)) {
        return {
          ...column,
          dataIndex,
          children: this.formatColumns(children),
        };
      }
      if (!editable) {
        return {
          ...column,
          dataIndex,
        };
      }
      return {
        ...column,
        align: align,
        width: width ||  APP_CONFIG.CELL_WIDTH_SMALL,
        dataIndex,
        render: (value, rowData, rowIndex) => {
          let renderValue = value;
          if (['single_date_picker'].indexOf(inputType) > -1) {
            renderValue = dayjs(value, 'YYYY-MM-DD');
          }
          return editable ? (
            <BaseFormComponent
              {...inputProps}
              inputProps={inputProps}
              key={rowIndex}
              size="small"
              inputType={inputType}
              value={renderValue}
              onChange={this.handleItemChange({ dataIndex, inputType, rowIndex })}
            />
          ) : (
            value
          );
        },
      };
    });
  };

  handleItemChange = ({ dataIndex, inputType, rowIndex }) => (event) => {
    const { onChange } = this.props;
    const { dataSource } = this.state;
    const data = cloneDeep(dataSource);
    let value = event;
    let path = dataIndex;
    if (isArray(dataIndex)) {
      path = join(dataIndex, '.');
    }
    switch (inputType) {
      case 'input':
        value = get(event, 'target.value');
        break;
      case 'date':
      case 'single_date_picker':
        value = formatDate(value);
        break;
      default:
        break;
    }
    set(data, `${rowIndex}.${path}`, value);
    onChange && onChange(data);
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    this.setState({
      dataSource: [
        ...dataSource,
        {
          key: Math.random(),
        },
      ],
    });
  };

  handleRowSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  handlePatchDelete = () => {
    const { selectedRowKeys, dataSource } = this.state;
    const newDataSource = filter(dataSource, (data) => indexOf(selectedRowKeys, data.key) === -1);
    this.setState({
      dataSource: newDataSource,
    });
  };

  render() {
    const { dataSource, selectedRowKeys } = this.state;
    const columns = this.formatColumns(this.columns);
    const scroll = get(this.props, 'input_props.scroll');

    return (
      <div className="pd-procedure-table">
        <div className="pd-procedure-table__header">
          <Button onClick={this.handleAdd}>新增</Button>
          <Button onClick={this.handlePatchDelete}>删除</Button>
        </div>
        <Table
          rowSelection={{ selectedRowKeys, onChange: this.handleRowSelectChange }}
          size="small"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={scroll || false}
        />
      </div>
    );
  }
}
