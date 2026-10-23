import { useMyEffectSafe } from '@lm_fe/components';
import { MyFormSectionForm } from '@lm_fe/components_m';
import { ISystemConfig, mchcDriver, mchcEnv, mchcLogger } from '@lm_fe/env';
import { use_provoke } from '@lm_fe/provoke';
import { SMchc_Common } from '@lm_fe/service';
import { expect_array, identity, isObject } from '@lm_fe/utils';
import { Button, Form } from 'antd';
import { get, isString } from 'lodash';
import React, { useRef } from 'react';
import './index.less';



function ConfigSystem(props: any) {
  const { config, fetch_sys_config } = use_provoke('config', 'fetch_sys_config',)

  const store = window.mchcStorage

  const { dictionaries } = props;
  const [form] = Form.useForm()
  const [localForm] = Form.useForm()


  const config_cache = useRef<Partial<ISystemConfig>>({})
  useMyEffectSafe(props)(() => {
    const { } = props;
    const data = config
    data.系统环境 = data.系统环境 || mchcEnv.appName
    data.医生端_模块隐藏 = expect_array(data.医生端_模块隐藏).map(_ => {
      if (isString(_)) return _
      if (isObject(_) && isString(get(_, 'value'))) return get(_, 'value')
      return ''
    }).filter(identity)

    data.medicalHide = expect_array(data.medicalHide).map(_ => {
      if (isString(_)) return { value: _, label: _ }
      return _
    })

    form.setFieldsValue(data);
    mchcLogger.log('gg', { form, config })
    localForm.setFieldsValue(data);
    config_cache.current = data

    return () => {
    }
  }, [config])


  async function handleSave() {
    const formData = form.getFieldsValue();
    const data = { ...config_cache.current, ...formData }
    const submit = { id: data.id, note: JSON.stringify(data), }
    // await update_config(submit);
    const config = await SMchc_Common.update_system_config(submit)

    mchcEnv.success('操作成功');
    setTimeout(() => {
      fetch_sys_config()
    }, 300);
  };

  function onDownload() {
    // window.location.href = `${mchcMacro.PUBLIC_PATH}assets/OBDriver.msi`;
    mchcDriver.download()

  };

  function handleLocalSave() {
    const values = localForm.getFieldsValue();
    store.set('localData', values);
    mchcEnv.success('操作成功');
  };



  const versionOptions = get(dictionaries, ['Highrisk.highriskVersion', 'enumerations']);

  return (
    <div style={{ height: '99%' }}>
      <MyFormSectionForm
        style={{ height: '96%', overflowY: 'auto' }}
        targetLabelCol={3}
        formDescriptions={() => import('./form_config')}
        form={form}

      />
      <Button block type="primary" htmlType="submit" onClick={handleSave}>
        保存
      </Button>
    </div>
  );
}
export default ConfigSystem;
