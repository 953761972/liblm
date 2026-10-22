import { format_dataIndex, Table_L } from '@lm_fe/components';
import { mchcLogger } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable, SMchc_FormDescriptions } from '@lm_fe/service';
import { uuid } from '@lm_fe/utils';
import { Button, Space } from 'antd';
import { cloneDeep, identity, indexOf, isArray, isEmpty, isEqual, join, set } from 'lodash';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { MyLazyComponent } from '../../MyLazyComponent';
import { use_arr_marshal } from '../../utils/useMarshal';
import { TCommonComponent } from '../types';
import styles from './index.module.less';
import { IMyEditTableProps } from './types';


const BaseFormComponent = lazy(() => import('../../BaseFormComponent'));

const MyEditTable: TCommonComponent<IMyEditTableProps, string | any[]> = (props) => {
  const { formDescriptions = [], value, showTitle, changeImmediate, disabled, onChange, marshal = 1, scroll, showEdit, showIndex, rowKey = '_key', genRowData, ...others } = props
  const hideAction = props.hideAction || disabled
  const defaultValue = useRef<any[]>([])

  const { safe_value = [], set_safe_value, onChangeSafeValue } = use_arr_marshal<any>(marshal, value ?? defaultValue.current, onChange, 'MyEditTable')
  const columns = useRef<IMchc_FormDescriptions_Field_Nullable[]>([])
  columns.current = formDescriptions ?? []
  const [selectedRowKeys, set_selectedRowKeys] = useState([])
  const [edit_col, set_editCol] = useState<any>()
  const [edit_row, set_editRow] = useState<number>()

  const edit_row_cache = useRef<number>()
  const edit_col_cache = useRef<any>()
  const edit_value_cache = useRef<any>()

  function set_edit_col(n: any) {
    edit_col_cache.current = n
    set_editCol(n)
  }
  function set_edit_row(n?: number) {
    edit_row_cache.current = n
    set_editRow(n)
  }

  const changeCb = (value: any, rowIndex?: any, dataIndex?: string | string[]) => {

    let path = dataIndex;
    if (isArray(dataIndex)) {
      path = join(dataIndex, '.');
    }
    const oldRow = __safe_value_cache.current[rowIndex]
    const data = __safe_value_cache.current[rowIndex] = cloneDeep(oldRow);
    set(data, `${path}`, value);
    console.log('[MyEditTable] bbb changeCb', { value, rowIndex, dataIndex, xxx: __safe_value_cache.current })

    onChangeSafeValue(__safe_value_cache.current);
  }


  const [__safe_value, set__safe_value] = useState<any[]>([])
  const __safe_value_cache = useRef<any[]>([])
  useEffect(() => {
    const arr = safe_value.map(_ => ({ ..._, [rowKey]: _.id ?? _?.[rowKey] ?? uuid() }))
    set__safe_value(arr)
    __safe_value_cache.current = arr
  }, [safe_value])


  function formatColumns(columns: IMchc_FormDescriptions_Field_Nullable[], isParent = true): any[] {
    const cols =
      columns.filter(identity)
        .map((column: any) => {
          const { children = [], align, width, render } = column;
          const inputType = column.inputType;
          const dataIndex = SMchc_FormDescriptions.format_itemName_str(column);
          const title = SMchc_FormDescriptions.get_the_fucking_itemLabel(column);
          const inputProps = column.inputProps
          const editable = !inputProps?.disabled;
          if (!isEmpty(children)) {
            return {
              ...column,
              children: formatColumns(children, false),
            };
          }
          if (!editable || !inputType) {
            return {
              ...column,
              ellipsis: showTitle ? { showTitle: true } : undefined,
              title,
              dataIndex: format_dataIndex(column),
            };
          }
          return {
            ...column,
            align,
            title,
            width,
            dataIndex: format_dataIndex(column),
            render:
              // render ||
              (
                (value: any, rowData: any, rowIndex: number) => {

                  const isEditingThis = (isEqual(edit_col, dataIndex) && edit_row === rowIndex && editable)
                  const isEditing = (isEditingThis || showEdit)
                  return <div title={showTitle ? value : undefined}>
                    {
                      (isEditing) ? (
                        <MyLazyComponent fallback={"..."}>
                          <BaseFormComponent
                            {...inputProps}
                            disabled={disabled}
                            inputProps={inputProps}
                            key={rowIndex}
                            size="small"
                            inputType={inputType}
                            value={isEditingThis ? edit_value_cache.current : value}
                            autoFocus={!showEdit}
                            defaultOpen={!showEdit}
                            // title={showTitle ? value : undefined}
                            onBlur={(event: any) => {

                              console.log('[MyEditTable] bbb onBlur', { editingValue: edit_value_cache.current, changeImmediate })

                              if (!changeImmediate) {
                                changeCb(edit_value_cache.current, edit_row_cache.current, edit_col_cache.current);

                                // mchcLogger.log('blur', { event, target: event.target, editingValue, editingRow, editingCol })
                              }
                              edit_col_cache.current = undefined

                              set_edit_col(undefined)
                              set_edit_row(undefined)
                            }}
                            onChange={(value: any) => {
                              console.log('[MyEditTable] bbb onChange', { value, changeImmediate })
                              if (changeImmediate) {
                                changeCb(value, rowIndex, dataIndex);

                              } else {

                                edit_value_cache.current = value


                                set_edit_col(dataIndex)
                                set_edit_row(rowIndex)

                              }

                            }}
                            config={column}

                          />
                        </MyLazyComponent>
                      ) : (
                        <div
                          style={{ minHeight: 20 }}
                          onClick={() => {
                            if (disabled || !inputType) return



                            edit_value_cache.current = value

                            set_edit_col(dataIndex)
                            set_edit_row(rowIndex)


                          }}
                        >
                          {render ? render(value, rowData, rowIndex) :
                            <MyLazyComponent fallback={"..."}>

                              <BaseFormComponent
                                {...inputProps}
                                inputProps={inputProps}
                                key={rowIndex}
                                size="small"
                                display
                                inputType={inputType}
                                value={value}
                                config={column}

                              />
                            </MyLazyComponent>
                          }
                        </div>
                      )
                    }

                  </div>
                }
              )
          };
        });

    return cols
  };




  function handleAdd() {
    const uid = uuid()
    const userData = genRowData?.(__safe_value)
    const newItem = Object.assign({}, userData, { [rowKey]: uid, })
    const newData = [
      ...__safe_value,
      newItem,
    ]
    onChangeSafeValue(newData)
    mchcLogger.log('add', newData)
  };

  function handleRowSelectChange(_selectedRowKeys: any) {
    set_selectedRowKeys(
      _selectedRowKeys,
    );
  };

  function handlePatchDelete() {
    const newDataSource = __safe_value.filter((data) => indexOf(selectedRowKeys, data[rowKey]) === -1);
    onChangeSafeValue?.(newDataSource);

  };
  function handleCopy() {
    let newDataSource = __safe_value.filter((data) => indexOf(selectedRowKeys, data[rowKey]) !== -1);
    newDataSource = newDataSource
      .map(_ => ({ ..._, [rowKey]: uuid(), id: undefined }))
    onChangeSafeValue?.([...safe_value, ...newDataSource]);

  };



  return (
    <div className={styles["pd-procedure-table"]}>
      <div hidden={hideAction} className={styles["pd-procedure-table__header"]}>
        <Space size="small" style={{ marginBottom: 6 }}>
          <Button type="primary" ghost onClick={handleAdd}>
            新增
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={handleCopy}>
            复制
          </Button>
          <Button disabled={isEmpty(selectedRowKeys)} onClick={handlePatchDelete}>
            删除
          </Button>
        </Space>
      </div>
      <Table_L
        className={styles["my-table"]}
        rowSelection={hideAction ? undefined : { selectedRowKeys, onChange: handleRowSelectChange }}
        rowKey={rowKey}
        bordered
        columns={formatColumns(formDescriptions)}
        dataSource={__safe_value}
        pagination={false}
        scroll={scroll ?? { y: 350 }}
        {...others}
        size="small"

      />
    </div>
  );
}


export default MyEditTable
