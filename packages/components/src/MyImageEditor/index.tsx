import React, { lazy, useEffect, useState } from 'react';
import { MyLazyComponent } from '../MyLazyComponent';
import { IMyImageEditorProps, MyImageEditorEvents } from './utils';
import { Switch } from 'antd';
import { mchcEnv } from '@lm_fe/env';
const GynaecologyImageEditorInner = lazy(() => import('./Inner'))

function MyImageEditor__(props: IMyImageEditorProps) {
  const [__checked, set_checked] = useState(!!props.value)
  const [loaded, set_loaded] = useState(false)

  useEffect(() => {
    mchcEnv
      .ds([s => s.lm_libs.fabric_5_2_0['fabric.min.js']])
      .then(() => set_loaded(true))
  }, [])

  if (!loaded) return <div>加载中...</div>
  return <>
    <div style={{ margin: '13px 0 16px 58px' }}>
      <span>电子画板：</span>
      <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={__checked} onChange={set_checked} />
    </div>
    <MyLazyComponent>
      {
        __checked
          ? <GynaecologyImageEditorInner {...props} />
          : null
      }

    </MyLazyComponent>
  </>
}



const MyImageEditor = Object.assign(MyImageEditor__, { events: MyImageEditorEvents })
const GynaecologyImageEditor = MyImageEditor

export { IMyImageEditorProps, MyImageEditorEvents, MyImageEditor, GynaecologyImageEditor }





