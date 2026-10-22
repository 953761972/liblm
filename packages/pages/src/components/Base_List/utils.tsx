import { IMchc_TableConfig, SMchc_FormDescriptions } from "@lm_fe/service";
import { expect_array, safeGetFromFuncOrData } from "@lm_fe/utils";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { IMyBaseList_ColumnType, MyBaseListProps, TableProps } from "./types";
export { TableProps };
export function formatProps(props: any, config?: IMchc_TableConfig) {
  const _props: MyBaseListProps = { ...props }
  const bf_conf = _props.bf_conf ?? config
  _props.handleBeforePopup = _props.handleBeforePopup ?? bf_conf?.handleBeforePopup ?? (values => values)
  _props.beforeSubmit = _props.beforeSubmit ?? bf_conf?.beforeSubmit ?? (values => values)
  _props.name = _props.name ?? bf_conf?.name
  _props.searchParams = safeGetFromFuncOrData(_props.searchParams ?? bf_conf?.searchParams)
  _props.initialSearchValue = safeGetFromFuncOrData(_props.initialSearchValue ?? bf_conf?.initialSearchValue)
  _props.searchConfig = safeGetFromFuncOrData(_props.searchConfig ?? bf_conf?.searchConfig)
  _props.tableColumns = _props.tableColumns ?? bf_conf?.tableColumns
  _props.showAction = _props.showAction ?? bf_conf?.showAction ?? true
  _props.showAdd = _props.showAdd ?? bf_conf?.showAdd ?? true
  _props.genColumns = _props.genColumns ?? bf_conf?.genColumns ?? undefined
  _props.showExport = _props.showExport ?? bf_conf?.showExport ?? false
  _props.showPrint = _props.showPrint ?? bf_conf?.showPrint ?? false
  _props.disableDoubleClick = _props.disableDoubleClick ?? bf_conf?.disableDoubleClick ?? false
  _props.requestBeforeEdit = _props.requestBeforeEdit ?? bf_conf?.requestBeforeEdit ?? false
  _props.showRowPrintBtn = _props.showRowPrintBtn ?? bf_conf?.showRowPrintBtn ?? false
  _props.needEditInTable = _props.needEditInTable ?? bf_conf?.needEditInTable ?? false
  _props.showRowDelBtn = _props.showRowDelBtn ?? bf_conf?.showRowDelBtn ?? true
  _props.showRowExportBtn = _props.showRowExportBtn ?? bf_conf?.showRowExportBtn ?? false
  _props.showRowEditBtn = _props.showRowEditBtn ?? bf_conf?.showRowEditBtn ?? true
  _props.showCopy = _props.showCopy ?? bf_conf?.showCopy ?? false
  _props.renderBtns = _props.renderBtns ?? bf_conf?.renderBtns
  _props.needChecked = _props.needChecked ?? bf_conf?.needChecked ?? false


  return _props
}





export function get_title<T>(record?: IMyBaseList_ColumnType) {
  const _title = record?.title ?? record?.label ?? record?.name

  return _title
}
export function use_my_baselist<T>(props: MyBaseListProps) {
  const { tableColumns } = props
  const [table_columns, set_table_columns] = useState<IMyBaseList_ColumnType<T>[]>([])

  useEffect(() => {

    // if (isFunction(tableColumns)) {
    //   safe_async_call(tableColumns).then(data => {
    //     if (Array.isArray(data)) {
    //       set_table_columns(data.filter(_ => !isNil(_)))

    //     } else {
    //       set_table_columns(data.default.__lazy_config.filter(_ => !isNil(_)))

    //     }
    //   })
    // } else {
    //   set_table_columns((tableColumns ?? []).filter(_ => !isNil(_)))

    // }
    SMchc_FormDescriptions.extract_form_config(tableColumns)
      .then(conf => {
        set_table_columns(

          expect_array(conf)
            .filter(_ => !isNil(_))
          // .filter(_ => !_.hidden) // 不能在这过滤否则弹窗表单有问题

        )

      })

    return () => {

    }
  }, [tableColumns])


  return { table_columns }
}