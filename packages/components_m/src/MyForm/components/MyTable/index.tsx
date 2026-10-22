import { LazyAntd } from '@lm_fe/components';
import { APP_CONFIG } from '@lm_fe/env';
import { formatDate } from '@lm_fe/utils';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { cloneDeep, filter, get, indexOf, isArray, isEmpty, isEqual, join, map, set } from 'lodash';
import React, { Component } from 'react';
import BaseFormComponent from '../../../BaseFormComponent';
import styles from './index.less';
const { Tree, TreeSelect, Select, Table, Dropdown, Pagination } = LazyAntd

export default class MyTable1 extends Component<{ disabled?: boolean }> {
  columns: any;

  constructor(props) {
    super(props);
    this.columns = get(props, 'input_props.tableColumns');
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      editingCol: undefined,
      editingRow: undefined,
      editingValue: undefined,
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
    const { onChange } = this.props;
    const { editingCol, editingRow, editingValue, dataSource } = this.state;
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
        width: width || APP_CONFIG.CELL_WIDTH_SMALL,
        dataIndex,
        render: (value, rowData, rowIndex) => {
          let renderValue = value;
          let renderComponentValue = editingValue;
          if (['single_date_picker'].indexOf(inputType) > -1) {
            renderValue = formatDate(renderValue);
            renderComponentValue = dayjs(renderComponentValue ? renderComponentValue : dayjs(), 'YYYY-MM-DD');
          }
          return editingCol === dataIndex && editingRow === rowIndex && editable ? (
            <BaseFormComponent
              disable={this.props.disabled}
              {...inputProps}
              inputProps={inputProps}
              key={rowIndex}
              size="small"
              inputType={inputType}
              value={renderComponentValue}
              autoFocus
              defaultOpen={true}
              onBlur={() => {
                this.setState({
                  editingRow: undefined,
                  editingCol: undefined,
                  editingValue: undefined,
                });
                let path = dataIndex;
                if (isArray(dataIndex)) {
                  path = join(dataIndex, '.');
                }
                const data = cloneDeep(dataSource);
                set(data, `${rowIndex}.${path}`, editingValue);
                onChange && onChange(data);
              }}
              onChange={this.handleItemChange({ dataIndex, inputType, rowIndex })}
            />
          ) : (
            <div
              style={{ minHeight: 20 }}
              onClick={() => {
                if (this.props.disabled) return
                this.setState({
                  editingRow: rowIndex,
                  editingCol: dataIndex,
                  editingValue: value,
                });
              }}
            >
              {renderValue}
            </div>
          );
        },
      };
    });
  };

  handleItemChange =
    ({ dataIndex, inputType, rowIndex }) =>
      (event) => {
        let value = event;
        switch (inputType) {
          case 'input':
            value = typeof event === 'string' ? event : get(event, 'target.value');
            break;
          case 'date':
          case 'single_date_picker':
            value = formatDate(value);
            break;
          default:
            break;
        }
        this.setState({
          editingValue: value,
        });
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
    const { onChange } = this.props;
    const { selectedRowKeys, dataSource } = this.state;
    const newDataSource = filter(dataSource, (data) => indexOf(selectedRowKeys, data.key) === -1);
    onChange(newDataSource);
    this.setState({
      dataSource: newDataSource,
    });
  };

  render() {
    const { dataSource, selectedRowKeys, } = this.state;
    const { disabled } = this.props;
    const columns = this.formatColumns(get(this.props, 'input_props.tableColumns'));
    const scroll = get(this.props, 'input_props.scroll');
    return (
      <div className={styles["pd-procedure-table"]}>
        <div className={styles["pd-procedure-table__header"]}>
          <Button type="primary" disabled={disabled} ghost onClick={this.handleAdd}>
            新增
          </Button>
          <Button disabled={isEmpty(selectedRowKeys) || disabled} onClick={this.handlePatchDelete}>
            删除
          </Button>
        </div>
        <Table
          className={styles["my-table"]}
          rowSelection={{ selectedRowKeys, onChange: this.handleRowSelectChange }}
          size="small"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={scroll}
        />
      </div>
    );
  }
}
