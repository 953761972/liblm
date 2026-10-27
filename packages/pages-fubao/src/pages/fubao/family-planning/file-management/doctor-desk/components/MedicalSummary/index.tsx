import React, { useEffect, useMemo, useState } from 'react'
import { Button, DatePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import {
    ExperimentOutlined,
    UserOutlined,
    FileTextOutlined,
    AlertOutlined,
    ClockCircleOutlined,
    // ActivityOutlined,
    // DropletOutlined,
    TagOutlined,
} from '@ant-design/icons'
import './index.less'
import { request } from '@lm_fe/utils'
import { use_provoke } from '@lm_fe/provoke'

// ===================== Types =====================

interface PatientItem {
    specialty: SpecialtyItem[]
    history: HistoryItem
    physical: PhysicalItem
    inspection: InspectionItem[]
    diagnosisCards: VisitItem[]
    visits: VisitItem[]
    missingHistory: string[]
    needExam: string[]
    recheckReminder: string[]
}
interface SpecialtyItem {
    code: string
    label: string
    visitCount: number
    displayText: string
}
interface HistoryItem {
    visitDate: string
    menstrualText: string
    pastHistoryText: string
    pregnancyText: string | null
    menstrualItems: any[]
    pastHistoryItems: any[]
}
interface PhysicalItem {
    visitDate: string
    bmi: string | null
    whr: string | null
    displayText: string
    items: any[]
}
interface InspectionItem {
    code: string
    name: string
    value: string
    unit: string
    reportDate: string
    abnormal: Boolean
    reference: string
    displayText: string
}

interface VisitItem {
    checkId: number
    date: string
    visitType: string
    bmi: string | null
    whr: string | null
    physicalItems: string[]
    abnormalInspections: InspectionItem[]
    diagnosis: string[]
    treatments: string[]
    changed: Boolean
}

const TYPE_FILTERS = [
    { key: '月经病', label: '月经病' /* icon: <UserOutlined />*/ },
    { key: '常规接诊', label: '常规接诊' /*icon: <FileTextOutlined />*/ },
    { key: '早孕检查', label: '早孕检查' /*icon: <FileTextOutlined />*/ },
    { key: '手术治疗', label: '手术治疗' /*icon: <FileTextOutlined />*/ },
]

const PATIENT: PatientItem | any = {
    specialty: [],
    history: {},
    physical: {},
    inspection: [],
    diagnosisCards: [],
    visits: [],
    missingHistory: [],
    needExam: [],
    recheckReminder: [],
}

const MAX_DIAG_CHIPS = 4
const MAX_TREAT_CHIPS = 3

type SortType = 'desc' | 'asc'

// ===================== Helper functions =====================
const formatDate = (s: string) => {
    if (s) {
        const p = s.split('-')
        return `${p[0]}年${parseInt(p[1], 10)}月${parseInt(p[2], 10)}日`
    }
}

const STATUS_COLOR: Record<string, string> = {
    positive: 'var(--color-positive)',
    warning: 'var(--color-warning)',
    normal: 'var(--color-normal)',
}

// ===================== Main Component =====================
const GynPositiveTimeline: React.FC = (props: any) => {
    const { sys_theme } = use_provoke()
    const colorPrimary = use_provoke((s) => s.sys_theme.colorPrimary)
    const isPurple = colorPrimary == '#6107a1'
    console.log('sys_theme', sys_theme)
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
    const [sort, setSort] = useState<SortType>('desc')
    const [patient, set_patient] = useState<PatientItem>(PATIENT)
    const [fromDate, setFromDate] = useState<Dayjs | null>(null)
    const [toDate, setToDate] = useState<Dayjs | null>(null)

    useEffect(() => {
        getMedicalRecordSummary()
    }, [])
    useEffect(() => {
        getMedicalRecordSummary()
    }, [])
    const getMedicalRecordSummary = async () => {
        const { id } = props
        const res = (await request.get(`/api/family/planning/getMedicalRecordSummary?familyPlanningId=${id}`)).data
        const recordSummary: PatientItem = res.data
        set_patient(recordSummary)
    }
    const toggleType = (key: string) => {
        const next = new Set(selectedTypes)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        setSelectedTypes(next)
    }

    const clearDate = () => {
        setFromDate(null)
        setToDate(null)
    }

    const filteredVisits = useMemo(() => {
        return [...patient.visits]
            .sort((a, b) => (sort === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
            .filter((v) => {
                const typeOk = selectedTypes.size === 0 || selectedTypes.has(v.visitType)
                const dateOk =
                    (!fromDate || dayjs(v.date).isAfter(fromDate)) && (!toDate || dayjs(v.date).isBefore(toDate))
                return typeOk && dateOk
            })
    }, [sort, selectedTypes, fromDate, toDate, patient])

    const cappedChips = (items: string[], maxN: number) => {
        const shown = items.slice(0, maxN)
        const rest = items.length - maxN
        return { shown, rest }
    }

    // 智能摘要渲染
    const renderSummary = () => {
        const physical = patient.physical
        const history = patient.history
        const specialtyNodes = patient.specialty.map((t) => {
            return (
                <span className={`${'sumTag'} ${'sumTagAbn'}`} key={t.code}>
                    {t.label}
                    <span className={'sumCount'}>已诊 {t.visitCount} 次</span>
                </span>
            )
        })

        const historyNodes = (
            <span>
                <span className={'mLabel'}>孕产史：</span>
                {history.pregnancyText}
                {history.pastHistoryText}
                {history.menstrualText}
            </span>
        )

        const physicalNodes = (
            <span className={`${'sumMetric'} {'sumMetricAbn}`}>
                <span className={'mLabel'}>BMI:</span>
                <span className={'mVal'}>{physical.bmi}</span>
                <span className={'mRef'}>（参考 18.5-23.9）</span>
                <span className={'mLabel'}>腰臀比:</span>
                <span className={'mVal'}>{physical.whr}</span>
                <span className={'mRef'}>（参考 ＜0.85）</span>
                <span className={'mLabel'}>{physical.displayText}</span>
                <span className={'mDate'}>{formatDate(physical.visitDate)}</span>
            </span>
        )

        const resultNodes = patient.inspection.map((data) => (
            <span className={`${'sumTag'} ${data.abnormal ? 'sumTagAbn' : 'sumTagWarn'}`} key={data.code}>
                {data.name} {data.value}
                {data.unit ? ` ${data.unit}` : ''} · {formatDate(data.reportDate)}
            </span>
        ))

        return (
            <section className={'ptlSummary'}>
                <div className={'ptlCardBand'}>
                    <span className={'bandIcon'}>✦</span>
                    <span className={'bandTitle'}>智能摘要</span>
                </div>
                <div className={'sumRow'}>
                    <div className={'sumLabel'}>
                        <span className={'sumIc'}>
                            <TagOutlined />
                        </span>
                        专案
                    </div>
                    <div className={'sumContent'}>{specialtyNodes}</div>
                </div>
                <div className={'sumRow'}>
                    <div className={'sumLabel'}>
                        <span className={'sumIc'}>
                            <FileTextOutlined />
                        </span>
                        病史
                    </div>
                    <div className={'sumContent'}>{historyNodes}</div>
                </div>
                <div className={'sumRow'}>
                    <div className={'sumLabel'}>
                        <span className={'sumIc'}>
                            <UserOutlined />
                        </span>
                        体格检查
                    </div>
                    <div className={'sumContent'}>{physicalNodes}</div>
                </div>
                <div className={'sumRow'}>
                    <div className={'sumLabel'}>
                        <span className={'sumIc'}>
                            <ExperimentOutlined />
                        </span>
                        辅助检查
                    </div>
                    <div className={'sumContent'}>{resultNodes}</div>
                </div>
            </section>
        )
    }

    // 智能分析
    const renderAnalysis = () => {
        const lvlClsMap: Record<string, string> = { warn: 'anItemLvlWarn', abn: 'anItemLvlAbn', '': 'anItemLvlInfo' }
        const lvlColorMap: Record<string, string> = {
            warn: 'var(--color-warning)',
            abn: 'var(--color-positive)',
            '': 'var(--color-primary)',
        }
        const lvlIconMap: Record<string, React.ReactNode> = {
            warn: <AlertOutlined />,
            abn: <ExperimentOutlined />,
            '': <ClockCircleOutlined />,
        }
        let count = 0
        const missingHistory = patient.missingHistory
        const needExam = patient.needExam
        const recheckReminder = patient.recheckReminder
        missingHistory.length != 0 && count++
        needExam.length != 0 && count++
        recheckReminder.length != 0 && count++
        return (
            <section className={'ptlAnalysis'}>
                <div className={'ptlCardBand'}>
                    <span className={'bandIcon'}>✦</span>
                    <span className={'bandTitle'}>智能分析</span>
                </div>
                <div className={'anList'}>
                    {missingHistory.length != 0 && (
                        <div className={`${'anItem'} ${lvlClsMap['warn']}`}>
                            <span className={'anIc'} style={{ background: lvlColorMap['warn'], color: '#fff' }}>
                                {lvlIconMap['warn']}
                            </span>
                            <div className={'anBody'}>
                                <div className={'anType'}>缺失病史</div>
                                <div className={'anText'}>建议补充{missingHistory.join('、')}</div>
                            </div>
                        </div>
                    )}
                    {needExam.length != 0 && (
                        <div className={`${'anItem'} ${lvlClsMap['abn']}`}>
                            <span className={'anIc'} style={{ background: lvlColorMap['abn'], color: '#fff' }}>
                                {lvlIconMap['abn']}
                            </span>
                            <div className={'anBody'}>
                                <div className={'anType'}>需补充检查</div>
                                <div className={'anText'}>建议完善{needExam.join('、')}</div>
                            </div>
                        </div>
                    )}
                    {recheckReminder.length != 0 && (
                        <div className={`${'anItem'} ${lvlClsMap['']}`}>
                            <span className={'anIc'} style={{ background: lvlColorMap[''], color: '#fff' }}>
                                {lvlIconMap['']}
                            </span>
                            <div className={'anBody'}>
                                <div className={'anType'}>复查提醒</div>
                                <div className={'anText'}>末次就诊未复查{recheckReminder.join('、')}</div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        )
    }

    // 诊断治疗
    const renderDiagHorizontal = () => {
        return (
            <div className={'diagTl'}>
                {patient.diagnosisCards.map((item, idx) => {
                    const v = item
                    const { shown: dxShow, rest: dxRest } = cappedChips(v.diagnosis, MAX_DIAG_CHIPS)
                    const { shown: trShow, rest: trRest } = cappedChips(v.treatments, MAX_TREAT_CHIPS)
                    return (
                        <div className={'diagNode'} key={idx}>
                            <div className={'diagDate'}>{formatDate(v.date)}</div>
                            <div className={'diagBlk'}>
                                <div className={'diagBlkLabel'}>诊断</div>
                                <div className={'diagChips'}>
                                    {dxShow.map((d, i) => (
                                        <span className={'diagChip'} key={i}>
                                            {d}
                                        </span>
                                    ))}
                                    {dxRest > 0 && (
                                        <span className={`${'diagChip'} ${'diagChipMore'}`}>+{dxRest} 项</span>
                                    )}
                                </div>
                            </div>
                            {v.treatments.length > 0 && (
                                <div className={'diagBlk'}>
                                    <div className={'diagBlkLabel'}>治疗</div>
                                    <div className={'diagChips'}>
                                        {trShow.map((t, i) => (
                                            <span className={`${'diagChip'} ${'diagChipTreat'}`} key={i}>
                                                {t}
                                            </span>
                                        ))}
                                        {trRest > 0 && (
                                            <span className={`${'diagChip'} ${'diagChipMore'}`}>+{trRest} 项</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        )
    }

    const renderVisitNode = (v: VisitItem) => {
        console.log('renderVisitNode,warning', v)
        const tokens: React.ReactNode[] = []
        v.abnormalInspections.map((data, index) => {
            let status = data.abnormal ? 'positive' : 'warning'
            tokens.push(
                <span className={`${'tok'}`} key={`${index}`}>
                    <i className={'tdot'} style={{ background: STATUS_COLOR[status] }} />
                    {data.name} {data.value}
                    {data.unit ? ` ${data.unit}` : ''}
                </span>,
            )
        })
        v.physicalItems.map((data, index) => {
            tokens.push(
                <span className={`${'tok'}`} key={`${index}`}>
                    <i className={'tdot'} style={{ background: STATUS_COLOR[''] }} />
                    {data}
                </span>,
            )
        })
        const tokenContent =
            tokens.length == 0 ? <span className={`${'tok'} ${'tokRest'}`}>本次无阳性 / 临界指标</span> : tokens
        return (
            <div className={'tlNode'} key={v.checkId}>
                <span className={'tlDot'} style={{ background: STATUS_COLOR['positive'] }} />
                <div className={'tlCard'}>
                    <div className={'tlHead'}>
                        <span className={'tlDate'}>{formatDate(v.date)}</span>
                        <span className={`${'tlType'} {'tlTypeGyn}`}>{v.visitType}</span>
                    </div>
                    <div className={'tlTokens'}>{tokenContent}</div>

                    <div className={'tlDx'}>
                        <div className={'tlDxRow'}>
                            <span className={'tlDxLabel'}>诊断</span>
                            <div className={'tlDxChips'}>
                                {v.diagnosis.map((d, i) => (
                                    <span className={'tlDxChip'} key={i}>
                                        {d}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={'tlDxRow'}>
                            <span className={'tlDxLabel'}>治疗</span>
                            <div className={'tlDxChips'}>
                                {v.treatments.map((t, i) => (
                                    <span className={`${'tlDxChip'} ${'tlDxChipTreat'}`} key={i}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // const renderSurgeryNode = (s: SurgeryItem, idx: number) => {
    //   return (
    //     <div className={'tlNode'} key={`s‑${idx}`}>
    //       <span className={'tlDot'} style={{ background: "var(--color-quiet)" }} />
    //       <div className={'tlCard'}>
    //         <div className={'tlHead'}>
    //           <span className={'tlDate'}>{formatDate(s.date)}</span>
    //           <span className={'tlType'}>手术治疗</span>
    //         </div>
    //         <div className={'tlTokens'}>
    //           <span className={'tok'}><span className={'tlabel'}>手术名称</span><span className={'tval'}>{s.name}</span></span>
    //           <span className={'tok'}><span className={'tlabel'}>术前诊断</span><span className={'tval'}>{s.preDiagnosis}</span></span>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

    const renderTimelineBody = () => {
        if (filteredVisits.length === 0) {
            return <div className={'emptyWrap'}>当前筛选条件下无匹配记录</div>
        }
        return (
            <>
                {filteredVisits.map(renderVisitNode)}
                {/* {filteredSurgeries.map(renderSurgeryNode)} */}
            </>
        )
    }

    return (
        <div className={`${'gynPtl'} ${isPurple ? 'purple' : ''}`}>
            <div className={'ptlTopGrid'}>
                {renderSummary()}
                {renderAnalysis()}
            </div>

            {/* 诊断治疗 横向时间轴 */}
            {/* <section className={'diagSection'}>
        <div className={'diagHead'}>诊断治疗</div>
        {renderDiagHorizontal()}
      </section> */}
            <section className={'diagSection'} style={{ background: isPurple ? '#F8F4F9' : '' }}>
                <div className={'ptlSummary'}>
                    <div className={'ptlCardBand'}>
                        <span className={'bandIcon'}>✦</span>
                        <span className={'bandTitle'}>诊断治疗</span>
                    </div>
                </div>
                {renderDiagHorizontal()}
            </section>

            <section style={{ background: isPurple ? '#F8F4F9' : '' }}>
                {/* <div className={'courseSubhead'}>诊治经过</div> */}
                <div className={'diagSection'}>
                    <div className={'ptlSummary'}>
                        <div className={'ptlCardBand'}>
                            <span className={'bandIcon'}>✦</span>
                            <span className={'bandTitle'}>诊治经过</span>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className={'ptlToolbar'}>
                    <div className={'ptlChipsWrap'}>
                        {TYPE_FILTERS.map((f) => (
                            <Button
                                key={f.key}
                                type={selectedTypes.has(f.key) ? 'primary' : 'default'}
                                // ghost={!selectedTypes.has(f.key)}
                                // size="small"
                                onClick={() => toggleType(f.key)}
                                icon={f.icon}
                                shape="round"
                            >
                                {f.label}
                            </Button>
                        ))}
                    </div>

                    <div className={'ptlDateRange'}>
                        <span>开始</span>
                        <DatePicker value={fromDate} onChange={(d) => setFromDate(d)} />
                        <span>至</span>
                        <DatePicker value={toDate} onChange={(d) => setToDate(d)} />
                        <Button onClick={clearDate}>清除</Button>
                    </div>

                    <div>
                        <Button type={sort === 'desc' ? 'primary' : 'default'} onClick={() => setSort('desc')}>
                            最近在前
                        </Button>
                        <Button type={sort === 'asc' ? 'primary' : 'default'} onClick={() => setSort('asc')}>
                            最早在前
                        </Button>
                    </div>
                </div>

                {/* 纵向时间轴 */}
                <main className={'ptlTimeline'}>{renderTimelineBody()}</main>
            </section>
        </div>
    )
}

export default GynPositiveTimeline
