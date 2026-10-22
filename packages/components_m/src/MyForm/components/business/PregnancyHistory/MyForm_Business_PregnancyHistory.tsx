import { MyIcon, Table_L } from "@lm_fe/components";
import { mchcEvent } from '@lm_fe/env';
import { IMchc_Doctor_Pregnancymh, SMchc_Doctor, TIdTypeCompatible } from '@lm_fe/service';
import { Button, message, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { cloneDeep, forEach, get, map, orderBy, set, size, throttle } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import EditableCell from '../../MyTable/TableEditableCell';
import { getConfig } from './config';
import './index.less';

type IItem = Partial<IMchc_Doctor_Pregnancymh> & { mergeIndex?: number, _children?: IMchc_Doctor_Pregnancymh['children'][0], _key?: number | string }
interface IInnerProp {
  ignoreKeys: string[]
  needNotThisTime: boolean
  tableColumns: IColumn[]
  pregnancyId?: TIdTypeCompatible
  closeAdd?: boolean
}
interface MyTableProps {
  onChange: Function;
  dispatch?: Function;
  value: IItem[];
  disabled?: boolean,
  input_props: IInnerProp;
}
interface IColumn extends ColumnsType<IItem> {
  key: string
  title: string
  width: number
  editor: any
  children?: IColumn[]
}

// 手术产式
const operationTypes = ['cesareanSection', 'vacuumAssisted', 'forceps', 'breechMidwifery'];
const addData: IItem = {
  _key: 'benyun',
  fetalcount: null as any,
}

function getPropsValue<T extends keyof IInnerProp>(k: T, a: any, b: IInnerProp,) {
  return (get(a, k) ?? get(a?.config?.input_props, k) ?? get(b, k)) as IInnerProp[T]
}

export default function MyForm_Business_PregnancyHistory(props: MyTableProps) {
  const __config = getConfig() as IInnerProp

  const { Wrap, config } = window.BF_Wrap2({
    default_conf: {
      title: `组件-孕产史`,
      tableColumns: [__config],

    }
  })
  const conf = get(config, 'tableColumns', [])[0]
  const { value, onChange, dispatch, disabled } = props;

  const __ignoreKeys = getPropsValue('ignoreKeys', conf, __config) ?? []
  const __tableColumns = getPropsValue('tableColumns', conf, __config,) ?? []
  const __needNotThisTime = getPropsValue('needNotThisTime', conf, __config,)
  const __closeAdd = getPropsValue('closeAdd', conf, __config,) || get(props, ['input_props', 'closeAdd'], false)
  const __pregnancyId = getPropsValue('pregnancyId', conf, __config,)

  const ignoreKeys = __ignoreKeys.map((_) => _.startsWith('children') ? _.replace('children', '_children') : _)

  const [tableColumns, set_tableColumns] = useState<IColumn[]>([])
  const [tableColumnsLength, set_tableColumnsLength] = useState(0)
  const [dataSource, set_dataSource] = useState<IItem[]>([])
  const [selectedRowKeys, set_selectedRowKeys] = useState([])
  const [g, setG] = useState<number>()
  const [p, setP] = useState<number>()

  const pregnancyId = useRef<TIdTypeCompatible>()
  pregnancyId.current = __pregnancyId


  const fetchPG = useCallback(
    throttle(function fetchPG() {
      const id = pregnancyId.current
      id && SMchc_Doctor.getOutpatientHeaderInfo(id).then(r => {
        setG(r.g)
        setP(r.p)
      })
    }, 2000),
    [],
  )



  useEffect(() => {
    fetchPG()
    const rm = mchcEvent.on_rm('outpatient', e => {
      if (e.type === '刷新头部') {
        fetchPG()
      }
    })
    return rm
  }, [])


  useEffect(() => {
    const safeValue = value ?? []
    const _value = orderBy(safeValue, ['gravidityindex'], ['asc'])



    const d = splitData(_value)
    set_dataSource(d ?? [])
    set_selectedRowKeys([])

    console.log('value', _value, d)


    return () => {

    }
  }, [value,])
  useEffect(() => {


    /*计算本孕一行占据的宽度*/
    let length = 0;
    forEach(__tableColumns, (item) => {
      if (item.children) {
        length += get(item, 'children.length');
        item.children = item.children.map(c => ({ ...c, key: c.key?.startsWith('children') ? c.key.replace('children', '_children') : c.key }))
      } else {
        length++;
      }
    });
    set_tableColumns(__tableColumns)
    set_tableColumnsLength(length - 1)



    return () => {

    }
  }, [config,])



  function _onChange(data: any) {
    console.log('_onChange', data)
    onChange(JSON.parse(JSON.stringify(data)))
  }

  function splitData(data: IItem[]) {
    const cloneData = cloneDeep(data);
    const splitArr: IItem[] = [];
    if (cloneData) {
      let count = 0;
      cloneData.forEach((item, index) => {
        const len = get(item, 'children.length') ?? 0
        if (len > 0) {
          forEach(item.children, (subItem) => {
            const newItem = cloneDeep(item);
            newItem.mergeIndex = index;
            newItem._children = subItem;
            newItem._key = count;
            splitArr.push(newItem);
            count++;
          });
        } else {
          item.mergeIndex = index;
          item._children = {} as IItem['_children'];
          item._key = count;
          splitArr.push(item);
          count++;
        }
      });
    }

    forEach(splitArr, (item) => {
      forEach(operationTypes, (type) => {
        if (get(item, type) === true) {
          set(item, 'operationType', type);
        }
      });
    });

    /* 加入本孕信息 */
    if (!__needNotThisTime) {
      const newAddData = cloneDeep(addData);
      newAddData.gravidityindex = data.length + 1;
      splitArr.push(newAddData);
    }

    return splitArr;
  };

  // onChange 之前
  function mergeData(data: IItem[]) {
    /* 删去最后一条本孕信息 */
    if (!__needNotThisTime) {
      data.splice(data.length - 1, 1);
    }
    const mergeArr: IItem[] = [];
    let sameIndex = -1;
    for (let i = 0; i < data.length; i++) {
      if (data[i].mergeIndex !== sameIndex) {
        const child = cloneDeep(data[i]);
        sameIndex = child.mergeIndex ?? -1;
        const childArr = child._children ? [child._children] : [];
        mergeArr.push(child);
        mergeArr[mergeArr.length - 1].children = childArr;
      } else {
        const c = data[i]._children
        c && mergeArr[mergeArr.length - 1]?.children?.push(c);
      }
    }

    map(mergeArr, (item) => {
      const len = get(item, 'children.length') ?? 0

      /* 未分娩胎数为零 */
      if (len === 1 && size(item.children?.[0]) === 0) {
        item.children = [];
        item.fetalcount = undefined;
      }

      if (len > 0) {
        item.fetalcount = len;
      }
    });
    return mergeArr;
  };

  function handleEdit(val: any, key: string, index: number) {
    const newValue = cloneDeep(dataSource);
    const fetelData = newValue[index];

    /*互斥项提示
      流产
      naturalAbortion -自然
      medicalAbortion -药物流产
      surgicalAbortion - 手术流产
      currettage - 清宫
      biochemicalAbortion - 生化妊娠
      inducedLabor -- 引产

      产出
      preterm -- 早产
      term -- 足月产
      vaginalDelivery -- 顺产
      cesareanSection -- 剖宫产
      vacuumAssisted -- 吸引产
      forceps -- 钳产
      breechMidwifery -- 臀助产
    */
    let threeCount = 0;
    let fourCount = 0;
    if (fetelData.naturalAbortion === true) threeCount++;
    if (fetelData.surgicalAbortion === true) threeCount++;
    if (fetelData.inducedLabor === true) threeCount++;
    if (fetelData.medicalAbortion === true) threeCount++;
    if (fetelData.currettage === true) threeCount++;
    if (fetelData.biochemicalAbortion === true) threeCount++;

    if (fetelData.preterm === true) fourCount++;
    if (fetelData.term === true) fourCount++;
    if (fetelData.vaginalDelivery === true) fourCount++;
    if (!!fetelData.shouShuChanType) fourCount++;
    if (fetelData.cesareanSection === true) fourCount++;
    if (fetelData.vacuumAssisted === true) fourCount++;
    if (fetelData.forceps === true) fourCount++;
    if (fetelData.breechMidwifery === true) fourCount++;

    if (
      (key === 'naturalAbortion' && val === true && fourCount > 0) ||
      (key === 'surgicalAbortion' && val === true && fourCount > 0) ||
      (key === 'inducedLabor' && val === true && fourCount > 0) ||
      (key === 'medicalAbortion' && val === true && fourCount > 0) ||
      (key === 'currettage' && val === true && fourCount > 0) ||
      (key === 'biochemicalAbortion' && val === true && fourCount > 0)
    ) {
      message.error('早产、足月产、顺产、手术产式中已有数据！', 4);
    }

    if (
      (key === 'preterm' && val === true && threeCount > 0) ||
      (key === 'term' && val === true && threeCount > 0) ||
      (key === 'vaginalDelivery' && val === true && threeCount > 0) ||
      (key === 'shouShuChanType' && val && threeCount > 0) ||
      (key === 'operationType' && val && threeCount > 0)
    ) {
      message.error('自然流产、人工流产、引产中已有数据！', 4);
    }

    if (
      key === 'naturalAbortion' &&
      val === true &&
      (fetelData.surgicalAbortion === true || fetelData.inducedLabor === true)
    ) {
      message.error('人工流产、引产中已有数据！', 4);
    }
    if (
      key === 'surgicalAbortion' &&
      val === true &&
      (fetelData.naturalAbortion === true || fetelData.inducedLabor === true)
    ) {
      message.error('自然流产、引产中已有数据！', 4);
    }
    if (
      key === 'inducedLabor' &&
      val === true &&
      (fetelData.naturalAbortion === true || fetelData.surgicalAbortion === true)
    ) {
      message.error('自然流产、人工流产中已有数据！', 4);
    }

    if (key === 'preterm' && val === true && fetelData.term === true) {
      message.error('足月产已有数据！', 4);
    }
    if (key === 'term' && val === true && fetelData.preterm === true) {
      message.error('早产已有数据！', 4);
    }

    if (key === 'vaginalDelivery' && val === true && fetelData.shouShuChanType) {
      message.error('手术产式已有数据！', 4);
    }
    if (key === 'shouShuChanType' && val && fetelData.vaginalDelivery === true) {
      message.error('顺产已有数据！', 4);
    }

    /*手术产式 值转换*/
    if (key === 'operationType') {
      forEach(operationTypes, (type) => {
        if (type === val) {
          set(fetelData, type, true);
        } else {
          set(fetelData, type, false);
        }
      });
    }

    /*胎数变化*/
    if (key === 'fetalcount') {
      const samePreg = newValue.filter((item: any) => item.mergeIndex === fetelData.mergeIndex);
      const sameCount = samePreg.length;

      console.log('xx --', val, sameCount, samePreg)

      if (!val || val === 0) {
        return;
      } else if (val < 0 || val > 18) {
        message.warning('胎数范围为0到18！');
      } else if (val > sameCount) {
        console.log('xx', val, sameCount, samePreg)
        for (let i = 0; i < val - sameCount; i++) {
          const newFetus = cloneDeep(samePreg[0]);
          newFetus._children = {} as any;
          newValue.splice(index + sameCount + i, 0, newFetus);
        }
      } else if (val < sameCount) {
        console.log('xx 11', val, sameCount, samePreg)

        newValue.splice(index + val, sameCount - val);
      }
    } else {
      set(fetelData, key, val);
    }

    if (dispatch) dispatch('tableEdit', fetelData);
    const d = mergeData(newValue)
    console.log('handleEdit', arguments, d)

    _onChange(d);
  };

  function handleAdd() {

    const newData: IItem = {} as IItem;
    forEach(tableColumns, (item) => {
      if (item.children) {
        const child = item.children;
        forEach(child, (subItem) => {
          if (subItem.key.indexOf('.') === -1) {
            newData[subItem.key] = '';
          } else {
            newData._children = {} as IItem['_children'];
            newData.children = []
          }
        });
      } else {
        newData[item.key] = '';
      }
    });
    console.log('newData', newData)
    _onChange(mergeData([...dataSource, newData]));
  };

  function handleDelete() {
    const newDataSource = cloneDeep(dataSource);
    console.log('handleDelete', selectedRowKeys, dataSource)
    forEach(selectedRowKeys, (key: number | string) => {
      for (let i = 0; i < newDataSource.length; i++) {
        if (key === newDataSource[i]._key) {
          newDataSource.splice(i, 1);
          break;
        }
      }
    });
    forEach(newDataSource, (item, index) => {
      newDataSource[index].gravidityindex = index + 1;
    });
    _onChange(mergeData(newDataSource));
  };

  // handleRowSelectChange = (selectedRowKeys: Array<number | string>, selectedRows: any[]): void => {
  //   setState({ selectedRowKeys });
  // };

  function handleRowClick(row: any, index: any) {
    const newValue = cloneDeep(dataSource);
    forEach(newValue, (item) => (item.rowClassName = ''));
    set(newValue[index], 'rowClassName', 'row-select');
    set_selectedRowKeys([index])
    set_dataSource(newValue)
  };

  function rowClassName(row: any) {
    return row.rowClassName;
  };

  function getRowSpans(arr: Array<any>, key: string) {
    let sameValueLength = 0;
    const rowSpans = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (i === 0) {
        rowSpans[i] = sameValueLength + 1;
        continue;
      }
      if (arr[i][key] === arr[i - 1][key]) {
        rowSpans[i] = 0;
        sameValueLength++;
      } else {
        rowSpans[i] = sameValueLength + 1;
        sameValueLength = 0;
      }
    }
    return rowSpans;
  };

  // 对于二级表单的处理
  function handleTabColumnsFormat(tableColumns: IColumn[], level = 1) {

    const rowSpans = getRowSpans(dataSource, 'mergeIndex');
    const newColums = tableColumns.map((col, colIndx) => {
      if (col.key) {
        return {
          ...col,
          dataIndex: col.key,
          render: (text: string, record: any, index: number) => {
            if (index === dataSource.length - 1 && !__needNotThisTime) {
              return {
                children: (
                  <div>
                    <span>{colIndx === 1 ? '本孕' : text}</span>

                  </div>
                ),
                props: {
                  colSpan: (colIndx === 1 && level === 1) ? tableColumnsLength : (text ? 1 : 0),
                },
              };
            } else {
              return {
                children: (
                  <EditableCell
                    disabled={disabled}
                    value={get(record, col.key)}
                    onChange={(val: any) => handleEdit(val, col.key, index)}
                    editor={col.editor}
                  />
                ),
                props: {
                  rowSpan: ignoreKeys.includes(col.key) ? 1 : rowSpans[index],
                },
              };
            }
          },
        } as IColumn;
      }
      if (col.children) {
        return {
          title: col.title,
          children: handleTabColumnsFormat(col.children, 2),
        } as IColumn;
      }
      return {} as IColumn;
    });

    return newColums;
  };

  let cloneColumns = cloneDeep(tableColumns);
  if (size(tableColumns) > 0) cloneColumns = handleTabColumnsFormat(tableColumns);
  // const rowSelection = {
  //   selectedRowKeys: state.selectedRowKeys,
  //   onChange: handleRowSelectChange,
  // };
  return (
    <Wrap>
      <div className="preg-his-table">
        {__closeAdd ? (
          ''
        ) : (
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

            {
              <span hidden={!g && !p} style={{ fontSize: 18, }}>
                <span style={{ color: '#999' }}>孕产：</span>
                <span style={{ fontWeight: 'bold' }}>{g ?? '--'}/{p ?? '--'}</span>
              </span>
            }

            <Space>
              <Button disabled={disabled} id="add" type="primary" ghost onClick={handleAdd} icon={<MyIcon value="PlusOutlined" />}>
                新增
              </Button>
              <Button disabled={disabled} id="delete" danger icon={<MyIcon value="DeleteOutlined" />} onClick={handleDelete}>
                删除
              </Button>
            </Space>


          </div>
        )}

        <Table_L
          bordered
          scroll={{ x: 1200 }}
          // rowSelection={rowSelection}
          onRow={(record, index) => {
            return {
              onClick: () => handleRowClick(record, index),
            };
          }}
          rowClassName={(row) => rowClassName(row)}
          columns={cloneColumns || []}
          dataSource={dataSource || []}
          childrenColumnName="noChildren"
          rowKey={(record: any) => record._key}
          pagination={false}
        />
      </div>
    </Wrap>
  );
}
// export default MyForm_Business_PregnancyHistory
