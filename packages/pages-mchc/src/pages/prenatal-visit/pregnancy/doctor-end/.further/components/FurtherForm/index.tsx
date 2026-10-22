import { MyIcon, MyLazyComponent, OkButton, fuck_the_form, handle_form_error, useMyEffectSafe } from '@lm_fe/components_m'
import {
    IMchc_Doctor_Diagnoses,
    IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_Doctor_RvisitInfoOfOutpatient,
    IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit,
    SLocal_Calculator,
    SMchc_Doctor,
    TIdTypeCompatible,
    process_OutpatientDocument_physicalExam_local,
    process_OutpatientDocument_physicalExam_remote
} from '@lm_fe/service'
import { copyText, getFutureDate, getSearchParamsAll, request } from '@lm_fe/utils'
import { Button, Card, Form, FormInstance, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'

import { mchcConfig, mchcEnv, mchcEvent, mchcUtils } from '@lm_fe/env'
import { HighRiskTableEntry, mchcModal__ } from '@lm_fe/pages'
import { use_provoke } from '@lm_fe/provoke'
import { expect_array } from '@lm_fe/utils'
import classNames from 'classnames'
import { use_doctor_sign } from '../../../.utils/use_doctor_sign'
import FormBlock from './form_config/Form'
import styles from './index.module.less'
import moment from 'moment'
// 弹窗枚举
interface IProps {
    addon_btns?: (data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>) => React.ReactNode
    before_submit?: (
        submit: (values: any) => Promise<void>,
        data?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>,
        form?: FormInstance,
    ) => Promise<void>
    headerInfo: IMchc_Doctor_OutpatientHeaderInfo
    visitsData?: IMchc_Doctor_RvisitInfoOfOutpatient
    formData?: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>
    diagnosesList: IMchc_Doctor_Diagnoses[]
    setDiagnosesList?(list: IMchc_Doctor_Diagnoses[]): void
    isAllPregnancies: boolean

    onAddBtnClick(): void

    getLastRecord(): void
    getVisitsData(): Promise<void>

    formChange(b: boolean): void
    handleSubmit(values: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>): Promise<void>
    after_save(values: Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>): Promise<void>
}
function FurtherForm(props: IProps) {
    const [save_disabled, set_save_disabled] = useState(false)
    const [sync_loading, set_sync_loading] = useState(false)
    const { 医生端_开启_危险_复诊同步记录 } = use_provoke(_ => _.config)
    const { getLastRecord } = props
    const { formChange } = props
    const {
        addon_btns,
        before_submit,
        after_save,
        diagnosesList,
        setDiagnosesList,
        formData,
        visitsData,
        getVisitsData,
        isAllPregnancies,
        headerInfo,
        onAddBtnClick,
        handleSubmit,
    } = props
    const { handle_cs_sign, sign_btn_disabled, sign_btn_hidden, sign_btn_text, save_btn_hidden, sign_confirm } = use_doctor_sign('prenatalVisit', formData)

    const [form] = Form.useForm()

    const form_id = formData?.id
    const visitDate = formData?.visitDate
    const preg_id = mchcUtils.single_id(headerInfo)

    // useEffect(() => {
    //   const rm = mchcEvent.on_rm('my_form', e => {
    //     console.log('load', { formData, e })
    //     if (e.type === 'onLoad' && formData) {
    //       formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
    //       form.setFieldsValue(formData)
    //     }
    //   })
    //   return rm
    // }, [formData])
    useEffect(() => {
        if (formData) {
            form.resetFields()
            formData.physicalExam = process_OutpatientDocument_physicalExam_remote(formData.physicalExam)
            let fetusExam = expect_array(formData.fetusExam)
            formData.fetusExam = fetusExam.length ? fetusExam : [{}]

            form.setFieldsValue(formData)
            set_save_disabled(formData.isBanned!)

            // if (mchcConfig.get('医生端_复诊编辑控制')) {

            //   SMchc_Doctor.getVisitEmrEditable(formData.id!)
            //     .then(set_disabled_save)
            //     .catch(() => set_disabled_save(true))
            // }
        }
    }, [formData])

    useMyEffectSafe(props)(() => {
        const rm_form = mchcEvent.on_rm('my_form', async (e) => {
            // mchcEnv.logger.log('event receive', { e, })
            if (e.type === 'onChange') {
                formChange(true)

                const values = e.values
                const value = e.value
                const key = e.name
                // if (key === 'visitDate') {
                //     const a = await SLocal_Calculator.calcGesWeek({ date: value, id: preg_id })
                //     e.setValue?.('gestationalWeek', a.gestationalWeek)
                // }

                // if (key === 'appointmentCycle') {
                //     e.setValue?.('appointmentDate', getFutureDate(value))
                // }

                // if (key === 'physicalExam') {
                //     const physicalExam = values?.physicalExam
                //     let bmi = getBMI(physicalExam?.weight, physicalExam?.height)
                //     form.setFieldsValue({ physicalExam: { bmi } })
                // }
            }

            // if (e.type === 'onFocus') {
            //     if (e.name === 'gestationalWeek') {
            //         mchcModal__.open('modal_form', {
            //             width: '20vw',
            //             bodyStyle: { height: '20vh' },

            //             modal_data: {
            //                 async onSubmit(v) {
            //                     const values = form.getFieldsValue()
            //                     const visitDate = values.visitDate
            //                     const old_pre = values.prescription ?? ''

            //                     const params = { sureEdd: v.edd, date: visitDate, id: preg_id }
            //                     const { gestationalWeek } = await SLocal_Calculator.calcGesWeek(params)
            //                     mchcEvent.emit('outpatient', { type: '刷新头部', })
            //                     let prescription = `${old_pre} ${old_pre ? '/' : ''} 预产期B超修订为 ${v.edd}`
            //                     form.setFieldsValue({ prescription, gestationalWeek })
            //                     return 1
            //                 },
            //                 async getInitialData() {
            //                     return headerInfo
            //                 },
            //                 formDescriptions: [{ label: '预产期-B超', name: 'edd', inputType: 'DatePicker' }],
            //             },
            //         })
            //     }
            // }
        })
        const rm_runone = mchcEvent.on_rm('outpatient', e => {
            if (e.type === '复诊表单走一个') {
                fuck_the_form(e.action, form, e.data, e.keys)
            }
        })
        return () => {
            rm_form();
            rm_runone();
        }
    }, [])


    async function get_form_data() {


        try {
            const values = await form.validateFields()

            values.physicalExam = process_OutpatientDocument_physicalExam_local(values.physicalExam)
            return values as Partial<IMchc_Doctor_RvisitInfoOfOutpatient_Rvisit>
        } catch (error) {
            const first = handle_form_error(error)
            if (first?.text) mchcEnv.warning(first.text)
            return null
        }
    }
    async function on_submit() {
        if (!sign_confirm())
            return
        const data = await get_form_data()
        if (!data) return
        if (before_submit) {
            return before_submit(handleSubmit, formData, form)
        }

        return handleSubmit(data)
    }


    function showpdf() {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    url: '/api/pdf-preview',
                    resource: 'prenatalVisit1',
                    id: form_id,
                    template: '',
                    version: '',
                    note: '',
                },
            },
        })
    }
    function initial_preview() {
        mchcModal__.open('print_modal', {
            modal_data: {
                requestData: {
                    url: '/api/pdf-preview',
                    resource: 'prenatalVisit2',
                    id: mchcUtils.single_id(),
                    template: '',
                    version: '',
                    note: '',
                },
            },
        })
    }

    function nfyy_sign() {
        request
            .get('/api/doctor/updateRvisitRecordOfDoctorSign', { params: { id: form_id }, successText: '签名成功' })
            .then(getVisitsData)
    }
    async function sign() {
        const data = await get_form_data()
        data && handle_cs_sign(data).then(after_save)
    }
    function copy() {
        if (mchcEnv.in(['南医附属'])) {
            request
                .get('/api/doctor/getRvisitRecordCopied', { params: { id: form_id }, successText: '复制成功' })
                .then((r) => {
                    copyText(r.data)
                })
        } else {
            message.warning('暂未开发该功能，敬请期待')
        }
    }

    async function syncDiagAndAdvice() {
        if (!headerInfo?.id) {
            message.warning('请先选择就诊人')
            return
        }
        if (!visitDate) {
            message.warning('请先保存病历')
            return
        }
        if (visitDate != moment().format('YYYY-MM-DD')) {
            message.warning('只能对当天的病历进行同步操作')
            return
        }
        set_sync_loading(true)
        try {
            // 同步诊断
            try {
                const searchParams = getSearchParamsAll()
                const res = await request.get<any[]>('/api/doctor/Diagnosis', {
                    params: { ...getSearchParamsAll(), id: headerInfo?.id, serialNO: searchParams.serialNo },
                })
                const fetchedDiagnoses = res.data ?? []
                if (fetchedDiagnoses.length === 0) {
                    message.info('未获取到诊断数据')
                } else {
                    const existingDiagnosisSet = new Set(diagnosesList.filter(d => d.prenatalVisitId === form_id).map((d) => d.diagnosis))
                    const duplicateDiagnoses = fetchedDiagnoses.filter((d) => existingDiagnosisSet.has(d.diagnosis))
                    const newDiagnoses = fetchedDiagnoses.filter((d) => !existingDiagnosisSet.has(d.diagnosis))
                    if (duplicateDiagnoses.length > 0) {
                        const filteredNames = duplicateDiagnoses.map((d) => d.diagnosis).join('、')
                        message.warning('已过滤' + duplicateDiagnoses.length + '个重复诊断：' + filteredNames)
                    }
                    if (fetchedDiagnoses.length > 0) {
                        const diagnosesToSave = newDiagnoses.map((d) => ({
                            ...d,
                            ...(form_id ? { prenatalVisitId: form_id } : {}),
                            ...(formData?.serialNo ? { serialNo: formData.serialNo } : {}),
                            outEmrId: headerInfo.id,
                        }))
                        const savedDiagnoses = await SMchc_Doctor.new_diagnosis_list(diagnosesToSave)
                        setDiagnosesList?.([...diagnosesList, ...(savedDiagnoses ?? diagnosesToSave)])
                        mchcEnv.success('同步诊断成功，共添加' + newDiagnoses.length + '条诊断')
                        mchcEvent.emit('outpatient', { type: '刷新头部' })
                    } else if (duplicateDiagnoses.length > 0) {
                        message.info('所有诊断均已存在，无需同步')
                    }
                }
            } catch (error) {
                console.error('同步诊断失败', error)
            }

            // 同步医嘱
            try {
                const searchParams = getSearchParamsAll()
                const params = {
                    serialNO: searchParams.serialNO ?? searchParams.serialNo ?? formData?.serialNo,
                    patientNO: searchParams.patientNO,
                    outpatientNO: headerInfo?.outpatientNO ?? searchParams.outpatientNO,
                }
                const res = await request.get<string[]>('/api/doctor/getAdvice', { params })
                const advice = expect_array(res.data) as string[]
                if (advice.length > 0) {
                    const routineExam = form.getFieldValue('routineExam') ?? {}
                    form.setFieldsValue({ routineExam: { ...routineExam, prescription: advice.join(',') } })
                    formChange(true)
                    mchcEnv.success('同步医嘱成功')
                } else {
                    message.info('未获取到医嘱数据')
                }
            } catch (error) {
                console.error('同步医嘱失败', error)
            }
        } finally {
            set_sync_loading(false)
        }
    }

    async function del_visit(id?: TIdTypeCompatible) {
        if (!id) return
        const ok = confirm('确定删除吗？')
        if (ok) {
            await request.delete(`/api/prenatal-visits/${id}`, { successText: '操作成功' })
            getVisitsData()
        }
    }

    const saveBtnTxt = save_disabled ? '无权限保存' : '保存'
    return (
        <Card
            title={form_id ? '编辑产检记录' : '本次产检信息'}
            size="small"
            styles={{ body: { padding: 0, height: 'calc(100% - 37px)', overflowY: 'auto' } }}
            style={{ overflowY: 'auto' }}
            extra={
                <span id="extra" style={{ display: 'inline-block', minWidth: 75, height: 24, marginLeft: 98 }}>
                    {form_id ? (
                        <>
                            <Button
                                icon={<MyIcon value="PlusOutlined" />}
                                type="primary"
                                size="small"
                                onClick={() => {
                                    form.resetFields()
                                    onAddBtnClick()
                                }}
                                style={{ marginRight: 36 }}
                            >
                                新增产检记录
                            </Button>
                        </>
                    ) : null}
                    <OkButton
                        hidden={!医生端_开启_危险_复诊同步记录}
                        icon={<MyIcon value="SyncOutlined" />}
                        type="primary"
                        size="small"
                        onClick={getLastRecord}
                        style={{ marginRight: 36 }}
                    >
                        同步上一次记录
                    </OkButton>
                </span>
            }
        >
            <MyLazyComponent size="middle">
                <FormBlock
                    disableAll={save_disabled}
                    form={form}
                    diagnosesList={diagnosesList ?? []}
                    headerInfo={headerInfo}
                />
                <div style={{ margin: '0 128px 64px 0' }}>
                    <HighRiskTableEntry headerInfo={headerInfo} data={visitsData} />
                </div>
                {!isAllPregnancies && (
                    <Space.Compact
                        className={classNames(
                            styles['return-btns'],
                            mchcConfig.get('医生端_复诊按钮浮动') ? styles['fixed'] : null,
                        )}
                    >
                        {addon_btns?.(formData)}
                        <OkButton hidden={!mchcEnv.is('中大惠亚')} loading={sync_loading} onClick={syncDiagAndAdvice}>
                            同步诊断和医嘱
                        </OkButton>
                        <OkButton
                            primary
                            danger
                            hidden={!form_id}
                            onClick={() => del_visit(form_id)}
                            disabled={save_disabled}
                        >
                            删除
                        </OkButton>
                        <OkButton hidden={!mchcEnv.is('广州市八')} onClick={initial_preview}>
                            首诊预览
                        </OkButton>
                        <OkButton hidden={!form_id} onClick={showpdf}>
                            打印
                        </OkButton>
                        <OkButton hidden={!mchcEnv.is('南医附属') || !form_id} onClick={copy}>
                            复制
                        </OkButton>
                        <OkButton
                            hidden={sign_btn_hidden}
                            primary
                            disabled={save_disabled || sign_btn_disabled}
                            onClick={sign}
                        >
                            {sign_btn_text}
                        </OkButton>

                        <OkButton hidden={!mchcEnv.is('南医附属') || !form_id} onClick={nfyy_sign}>
                            签名
                        </OkButton>
                        <OkButton hidden={save_btn_hidden} primary disabled={save_disabled} onClick={on_submit}>
                            {saveBtnTxt}
                        </OkButton>
                    </Space.Compact>
                )}
            </MyLazyComponent>
        </Card>
    )
}
export default FurtherForm
