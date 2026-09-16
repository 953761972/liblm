import { BaseEditPanelFormFC, handle_form_error, OkButton } from '@lm_fe/components_m';
import { mchcDriver, mchcEnv, mchcEvent, mchcLogger, mchcUtils } from '@lm_fe/env';
import { IMchc_FormDescriptions_Field_Nullable_Arr, IMchc_Nurse_OutpatientDocument, SLocal_History, SLocal_State, SMchc_Nurse, TIdTypeCompatible } from '@lm_fe/service';
import { formatDate, getSearchParamsValue, request } from '@lm_fe/utils';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { archivalInformation_onClose, archivalInformation_onPrint, archivalInformation_onValuesChange } from './utils';
// import { form_config } from './form/form_config';
import { BF_Wrap2, safe_navigate } from '@lm_fe/pages';
import { PartialAll } from '@lm_fe/utils';
import { get, set } from 'lodash';
import { load_form_config_nurse_end, preset_config } from './form_new/form_config';
import { Ws } from './Ws';
import { use_provoke } from '@lm_fe/provoke';

function Pregnancies(props: { id?: TIdTypeCompatible, toAdd?: boolean, toCheck?: boolean }) {
  const { id, toAdd, toCheck } = props
  const { 护士端_审核禁用保存 } = use_provoke(s => s.config)
  const [formData, setFormData] = useState<PartialAll<IMchc_Nurse_OutpatientDocument>>({ pregnancyInfo: { validateDate: formatDate()! } })
  const [form] = Form.useForm()
  const [requiredKeys, setRequiredKeys] = useState<{ [x: string]: boolean }>({})
  const searchId = getSearchParamsValue('id')
  const _id = id ?? searchId
  const [loading, setLoading] = useState(false)
  const isUnCheck = !formData?.recordstate || formData.recordstate === '0';

  const { config, Wrap } = BF_Wrap2({
    default_conf: { tableColumns: load_form_config_nurse_end, title: '孕册管理-编辑' },
  })




  useEffect(() => {
    if (_id) {
      setTimeout(() => {
        SMchc_Nurse.getOutpatientDocument(_id)
          .then(remoteData => {
            if (!remoteData) return
            mchcLogger.log('Pregnancies remote', remoteData)
            const validateDate = remoteData?.pregnancyInfo?.validateDate
            set(remoteData, 'pregnancyInfo.validateDate', validateDate ?? formatDate())

            const idNO = remoteData?.baseInfo?.idNO
            const idType = remoteData?.baseInfo?.idType
            const checkData = mchcUtils.checkIdNo_new(idNO, idType)

            const dob = remoteData?.baseInfo?.dob
            const nationality = remoteData?.baseInfo?.nationality
            const nativeplace = remoteData?.baseInfo?.nativeplace
            const age = remoteData?.baseInfo?.age


            set(remoteData, 'baseInfo.dob', dob ?? checkData?.birth)
            set(remoteData, 'baseInfo.nationality', nationality ?? checkData?.nationality)
            set(remoteData, 'baseInfo.nativeplace', nativeplace ?? checkData?.province)
            set(remoteData, 'baseInfo.age', age ?? checkData?.age)

            // set(remoteData, 'auditorName', (remoteData as any).auditorName ?? SLocal_State.userData?.login)

            setFormData(remoteData)
          })
      }, 1000);
    }

  }, [_id])
  const preset = preset_config()
  useEffect(() => {

    return mchcDriver.on_rm('data', e => {

      if (e.type === 'ReadCard') {
        let res = e.data
        const baseInfo: Partial<IMchc_Nurse_OutpatientDocument['baseInfo']> = {
          name: res.name,
          idNO: res.idNO,
          idType: res.idType,
          dob: res.dob,
          age: res.age,
          nationality: res.nationality,
          nativeplace: res.nativeplace,
          validateDate: formatDate()!,
        }
        setFormData({ baseInfo });
      }

    })

  }, [])
  useEffect(() => {

    form.setFieldsValue(formData)




    return () => {

    }
  }, [formData])



  function onValuesChange(changedValues: any, allValues: any) {
    preset?.handler(changedValues, allValues, form,)
    archivalInformation_onValuesChange(changedValues, allValues, form, obj => setRequiredKeys({ ...requiredKeys, ...obj }))
  }
  function onPrint() {
    if (formData?.id) {
      archivalInformation_onPrint(formData.id)
    }
  }

  async function onFinish(recordstate = formData.recordstate, isAudit = false) {
    // const recordstate = isContinue ? '0' : (isUnCheck ? '1' : formData.recordstate)
    setLoading(true)
    return form.validateFields()
      .then(async v => {
        mchcLogger.log('vvv', { v, formData })
        const fn = formData?.id ? SMchc_Nurse.updateOutpatientDocument : SMchc_Nurse.newOutpatientDocument
        const submit_data = { ...formData, ...v, recordstate, isAudit }
        const remoteData = await fn(submit_data)

        setLoading(false)

        mchcEnv.success('操作成功！')
        if (submit_data.id) {
          mchcEvent.emit('outpatient', { type: '刷新头部', })

          const ok = (isUnCheck && isAudit) ? confirm('是否前往编辑孕册?') : false
          if (ok) {
            safe_navigate(`/prenatal-visit/pregnancy/nurse-end?id=${remoteData.id}`, props, { id: remoteData.id }, true)
          }

        }
        setFormData(remoteData)



      })
      .catch((e) => {
        const first_err = handle_form_error(e, form)
        if (first_err?.text) {
          mchcEnv.warning(first_err.text)

        }
        setLoading(false)
      })

  }
  console.log('initialValues', { config })
  return <>

    <Wrap style={{ overflow: 'auto', height: '100%' }}>

      <BaseEditPanelFormFC
        initialValues={config?.initialValues}
        requiredKeys={requiredKeys} form={form} formDescriptions={config?.tableColumns}
        onValuesChange={onValuesChange}
        renderBtns={() => {
          return <>
            {
              _id ? <OkButton primary size="large" onClick={onPrint}>
                打印
              </OkButton> : null
            }
            <OkButton hidden={护士端_审核禁用保存 && toCheck} loading={loading} primary size="large" onClick={() => onFinish()}>
              保存
            </OkButton>
            <OkButton hidden={!searchId || !toCheck} loading={loading} primary size="large" onClick={() => onFinish('1', true)}>
              审核
            </OkButton>

            <OkButton hidden={!!searchId} loading={loading} primary size="large" onClick={() => onFinish('0').then(() => form.resetFields())}>
              保存并继续添加孕册
            </OkButton>
            <OkButton size="large" onClick={archivalInformation_onClose}>
              关闭
            </OkButton>
          </>
        }}

      />
    </Wrap >
    <Ws />

  </>
}
export default Pregnancies;
