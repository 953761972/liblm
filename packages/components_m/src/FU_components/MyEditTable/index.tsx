import React, { lazy } from 'react';
import { use_arr_marshal } from '../../utils/useMarshal';
import { TCommonComponent } from '../types';
import { IMyEditTableProps } from './types';


const MyEditTable_Inner = lazy(() => import('./Inner'));


export const MyEditTable: TCommonComponent<IMyEditTableProps, string | any[]> = (props) => {
  return (
    <MyEditTable_Inner {...props} />
  );
}
MyEditTable.DisplayFC = (props) => {
  const {
    value,
    onChange,
    marshal = 1,
  } = props


  const { safe_value = [], } = use_arr_marshal<any>(marshal, value ?? [], onChange)

  return <div>
    {safe_value.length}项
  </div>
}