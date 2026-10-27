import { LazyAntd } from "@lm_fe/components";
import { IMchc_LabExamReport_Detail } from "@lm_fe/service";
import { EMPTY_PLACEHOLDER } from "@lm_fe/utils";
import { Pagination, Tag } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { PDFPreview_View } from "src/PDFPreview";
import './index.less';
import { IProps } from "./types";
const { Tree, TreeSelect, Select, Table, Dropdown } = LazyAntd

type TItem = IMchc_LabExamReport_Detail['examItems'][number]
function check_normal(row: TItem): '正常' | '异常' | '-' {
    if (!row.state) return '-'
    if (row.state === '0')
        return '正常'

    return '异常'

}

export default function Inner(props: IProps) {


    const { detailData } = props

    const [reportFile, set_reportFile] = useState<string | null>(null)
    const [reportFilePathArr, set_reportFilePathArr] = useState<string[]>([])
    const [current, setCurrent] = useState(1)


    useEffect(() => {

        const img = get(detailData, 'imgBase64')

        if (img) {
            if (Array.isArray(img)) {

                set_reportFilePathArr(
                    img.map(_ => _.endsWith('.pdf') ? _ : `data:application/pdf;base64, ${_}`)
                )

            } else {

                set_reportFile(`data:application/pdf;base64, ${img}`)

            }
        }
        return () => {

        }
    }, [detailData])








    const curentPath = reportFilePathArr.find((_, idx) => idx === current - 1)
    return (
        <div className="survey-right" style={{ background: '#fff' }}>
            <div className="right-top">
                <div className="right-title">
                    <span className="right-words">{get(detailData, 'reportName') || ''} 检验报告单</span>
                </div>
                <div className="right-doctor">首阅医生：{get(detailData, 'firstReadDoctor') || ''}</div>
            </div>
            <ul className="right-msg">
                <li className="msg-item">检验单号: {get(detailData, 'examNo') || ''}</li>
                <li className="msg-item">送检: {get(detailData, 'requestDoctor') || ''}</li>
                <li className="msg-item">姓名: {get(detailData, 'patientName') || ''}</li>
                <li className="msg-item">性别: {get(detailData, 'patientGender') || ''}</li>
                <li className="msg-item">年龄: {get(detailData, 'patientAge') || ''}</li>
                <li className="msg-item">标本部位: {get(detailData, 'samplePart') || ''}</li>
                <li className="msg-item">报告日期: {get(detailData, 'reportDate') || ''}</li>
                <li className="msg-item">送检日期: {get(detailData, 'requestDate') || ''}</li>
            </ul>
            <div style={{ paddingBottom: 24 }}>
                {
                    reportFile ?
                        (
                            <div className="right-pdf">
                                <img alt="report" src={reportFile} />
                            </div>
                        )
                        : (
                            curentPath
                                ? (
                                    <div
                                        style={{}}
                                    // className="img-container"
                                    >
                                        <div style={{ padding: 12 }}>
                                            {curentPath.endsWith('.pdf')
                                                ? <PDFPreview_View file={`${curentPath}`} />
                                                : <img style={{ maxWidth: '100%' }} src={curentPath} />
                                            }

                                        </div>
                                        <Pagination
                                            current={current}
                                            total={reportFilePathArr.length}
                                            pageSize={1}
                                            onChange={(c) => setCurrent(c)}
                                            style={{ textAlign: 'center' }}
                                        />
                                    </div>
                                )
                                : (
                                    <Table
                                        // rowSelection={{
                                        //     onSelect(row, is_select) {
                                        //         const _active = { ...active }
                                        //         if (is_select) {
                                        //         } else {
                                        //         }
                                        //     }
                                        // }}
                                        bordered
                                        scroll={{ y: 400 }}
                                        // className="prenatal-visit-main-table right-table"
                                        columns={[
                                            { title: '检验项目', dataIndex: 'itemName', key: 'itemName' },
                                            {
                                                title: '结果', dataIndex: 'result', key: 'result', render(value, record, index) {
                                                    const normal_state = check_normal(record)
                                                    const is_异常 = normal_state === '异常'
                                                    let text = value
                                                    if (record.stateStr === '偏高') text = value + '↑'
                                                    if (record.stateStr === '偏低') text = value + '↓'

                                                    return <span style={{ color: is_异常 ? 'red' : 'unset', fontSize: is_异常 ? 18 : 14, fontWeight: is_异常 ? 'bold' : 'unset' }}>{text}</span>
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
                                                    return normal_state === '-' ? EMPTY_PLACEHOLDER : <Tag color={normal_state === '正常' ? 'green' : 'red'}>{text}</Tag>
                                                }
                                            },
                                            { title: '单位', dataIndex: 'unit', key: 'unit' },
                                            { title: '参考值', dataIndex: 'limit', key: 'limit' },
                                        ]}
                                        dataSource={get(detailData, 'examItems') || []}
                                        pagination={false}
                                    // rowClassName={(record, index) => setClassName(record, index)}
                                    />
                                )
                        )
                }
            </div>
        </div >
    );



}
