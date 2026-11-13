import React, { useState, useEffect } from 'react'
import { Collapse, Form, Table, Button, Tag } from 'antd'
import { assign, map, forEach, get, isString, isArray, isEmpty } from 'lodash'
import {
    IMchc_Admission_HeaderInfoOfInpatientEmr,
    IMchc_Doctor_OutpatientHeaderInfo,
    IMchc_LabExamReport_Detail,
    IMchc_listPatientLabExamReport_Item,
    SMchc_Admission,
} from '@lm_fe/service'
import { request } from '@lm_fe/utils'
import { MyDatePicker } from '@lm_fe/components_m'

import './index.less'

interface VerticalProps {
    headerInfo?: Partial<IMchc_Doctor_OutpatientHeaderInfo>
    headerInfoOfInpatientData?: Partial<IMchc_Admission_HeaderInfoOfInpatientEmr>
    fubao?: boolean
}

function check_normal(row): '正常' | '异常' | '-' {
    if (!row.state) return '-'
    if (row.state === '0') return '正常'

    return '异常'
}

function Vertical(props: VerticalProps) {
    const [form] = Form.useForm()
    const { headerInfoOfInpatientData = {}, headerInfo = {}, fubao } = props
    const combinded = assign({ fubao }, headerInfoOfInpatientData, headerInfo)
    const [reportList, setReportList] = useState([])
    const [defaultActiveKey, setDefaultActiveKey] = useState([])

    useEffect(() => {
        getLabExamReportList()
        return () => {}
    }, [])

    const getLabExamReportList = async (param?: any) => {
        let _list = []
        let list = await SMchc_Admission.listPatientLabExamReport({ params: { ...combinded, param }, ignore_usr: true })
        forEach(list, (item: IMchc_listPatientLabExamReport_Item) => {
            const _examReport = map(item.examReport, (j) => ({ ...j, date: item.date, gesWeek: item.gesWeek }))
            _list = [..._list, ..._examReport]
        })
        // 转化CollapseProps['items']格式
        let _newList = map(_list, (item: IMchc_LabExamReport_Detail) => {
            return {
                key: item.id,
                label: `${item.date} - ${item.title}`,
                children: <ReportDetail {...item} />,
                styles: { body: { padding: '6px 12px' } },
            }
        })
        // console.log('-----7878787   888', _newList, _newList[0, 'key'], get(_newList, [0, "key"]));
        setReportList(_newList)
        setDefaultActiveKey([get(_newList, [0, "key"])])
    }

    const handleSearch = async () => {
        const values = await form.validateFields()
        getLabExamReportList(values)
    }

    /**
     * 处理同步报告的异步函数
     * 该函数通过POST请求发送合并后的数据到服务器，并在成功后刷新报告列表
     */
    const handleSync = async () => {
        request
            .post('/api/syncReport', combinded, { successText: '成功' })
            .then((res) => {
                getLabExamReportList()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleCollapseChange = (keys: string | string[]) => {
        setDefaultActiveKey(keys)
    }

    return (
        <div
            className="prenatal-visit-main_survey"
            style={{ backgroundColor: '#fff', overflowY: 'auto', padding: '0 12px' }}
        >
            <Form form={form} layout="inline" style={{ padding: '6px 0' }}>
                <Form.Item label="检查日期" name="date.start">
                    <MyDatePicker valueType="YYYY-MM-DD" placeholder="请选择时间" />
                </Form.Item>
                <span style={{ paddingRight: 16 }}>~</span>
                <Form.Item label="" name="date.end">
                    <MyDatePicker valueType="YYYY-MM-DD" placeholder="请选择时间" />
                </Form.Item>
                <Form.Item>
                    <Button.Group>
                        <Button type="primary" onClick={handleSearch}>
                            搜索
                        </Button>
                        <Button onClick={handleSync}>同步</Button>
                    </Button.Group>
                </Form.Item>
            </Form>
            <Collapse bordered size="small" activeKey={defaultActiveKey} onChange={handleCollapseChange}  items={reportList}></Collapse>
        </div>
    )
}

function ReportDetail({ id, type, title, ...rest }) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [reportFiles, setReportFiles] = useState([])

    useEffect(() => {
        getLabExamReportDetail()
        return () => {}
    }, [])

    const getLabExamReportDetail = async () => {
        setLoading(true)
        await request
            .get(`/api/getLabExamReport?id=${id}&type=${type}`, { ignore_usr: true })
            .then((res) => {
                setData(res.data)
                getReportFiles(get(res, 'data.imgBase64'))
            })
            .catch((err) => {
                console.log(err)
            })
        setLoading(false)
    }

    const getReportFiles = (img: any) => {
        let result: string | string[] = []
        if (isString(img)) {
            result = [`data:application/pdf;base64, ${img}`]
        }
        if (isArray(img)) {
            result = img.map((_) => (_.endsWith('.pdf') ? _ : `data:application/pdf;base64, ${_}`))
        }
        setReportFiles(result)
    }

    if (loading) {
        return <div style={{ padding: 12, textAlign: 'center' }}>加载中...</div>
    }
    return (
        <div className="report-detail">
            <div className="top">
                <ul className="top-ul">
                    <li className="msg-item">报告名称: {get(data, 'reportName') || title}</li>
                    <li className="msg-item">首阅医生: {get(data, 'firstReadDoctor') || ''}</li>
                </ul>
                <ul className="top-ul">
                    <li className="msg-item">检验单号: {get(data, 'examNo') || ''}</li>
                    <li className="msg-item">送检: {get(data, 'requestDoctor') || ''}</li>
                    <li className="msg-item">姓名: {get(data, 'patientName') || ''}</li>
                    <li className="msg-item">性别: {get(data, 'patientGender') || ''}</li>
                    <li className="msg-item">年龄: {get(data, 'patientAge') || ''}</li>
                    <li className="msg-item">标本部位: {get(data, 'samplePart') || ''}</li>
                    <li className="msg-item">报告日期: {get(data, 'reportDate') || ''}</li>
                    <li className="msg-item">送检日期: {get(data, 'requestDate') || ''}</li>
                </ul>
            </div>
            <div className="content">
                {!isEmpty(reportFiles) ? (
                    map(reportFiles, (file) => {
                        if (file.endsWith('.pdf')) {
                            return <iframe key={file} src={file} style={{ width: '100%', height: '100%' }} />
                        }
                        return <img style={{ maxWidth: '100%' }} src={file} />
                    })
                ) : (
                    <Table
                        bordered
                        size="small"
                        style={{ marginLeft: 24, marginTop: 4, width: 860 }}
                        columns={[
                            { title: '检验项目', dataIndex: 'itemName', key: 'itemName' },
                            {
                                title: '结果',
                                dataIndex: 'result',
                                key: 'result',
                                render(value, record, index) {
                                    const normal_state = check_normal(record)
                                    const is_异常 = normal_state === '异常'
                                    let text = value
                                    if (record.stateStr === '偏高') text = value + ' ↑'
                                    if (record.stateStr === '偏低') text = value + ' ↓'

                                    return (
                                        <span
                                            style={{
                                                color: is_异常 ? 'red' : 'unset',
                                                fontWeight: is_异常 ? 'bold' : 'unset',
                                            }}
                                        >
                                            {text}
                                        </span>
                                    )
                                },
                            },
                            {
                                title: '状态',
                                dataIndex: 'state',
                                key: 'state',
                                width: 64,
                                align: 'center',
                                render: (record: any, row: IMchc_LabExamReport_Detail['examItems'][number]) => {
                                    const normal_state = check_normal(row)
                                    const text = row.stateStr ?? normal_state
                                    // return <div style={{ color: `${isNormal ? 'red' : ''}` }}>{record == 1 ? '异常' : '正常'}</div>
                                    return normal_state === '-' ? (
                                        '-'
                                    ) : (
                                        <Tag color={normal_state === '正常' ? 'green' : 'red'}>{text}</Tag>
                                    )
                                },
                            },
                            { title: '单位', dataIndex: 'unit', key: 'unit' },
                            { title: '参考值', dataIndex: 'limit', key: 'limit' },
                        ]}
                        dataSource={get(data, 'examItems') || []}
                        pagination={false}
                    />
                )}
            </div>
        </div>
    )
}

export default Vertical
