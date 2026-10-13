import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import { get } from 'lodash'
import { fubaoRequest as request } from '@lm_fe/utils'
import Table3 from './components/table3';
import Table2 from './components/table2';
import Table1 from './components/table1';
import ss from './images/ss.svg'
import xj from './images/xj.svg'
import ywc from './images/ywc.svg'

import styles from './index.module.less'

enum TabKeys {
    Waiting,
    Finished,
    All,
}

export default function PAC_tracing_management(props: any) {
    const [activeKey, setActiveKey] = useState(TabKeys['Waiting'])
    const [waiting, setWaiting] = useState('--')
    const [finished, setFinished] = useState('--')
    const [all, setAll] = useState('--')

    useEffect(() => {
        getStatisticsData()
        return () => {}
    }, [])

    const getStatisticsData = async () => {
        const [waiting, finished, all] = await Promise.all([
            request.get(
                `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday/page?sort=id,desc&page=0&size=20&deleteFlag.equals=0&followUpSituation.equals=0`,
            ),
            request.get(
                `/api/family/planning/getEarlyPregnancyCheckPacTrackingFileToday/page?sort=id,desc&page=0&size=20&deleteFlag.equals=0&followUpSituation.equals=1`,
            ),
            request.get(
                `/api/family/planning/getEarlyPregnancyCheckPacTrackingFile/page?sort=id,desc&page=0&size=20&deleteFlag.equals=0`,
            ),
        ])
        setWaiting(get(waiting, 'data.data.totalElements', '--'))
        setFinished(get(finished, 'data.data.totalElements', '--'))
        setAll(get(all, 'data.data.totalElements', '--'))
    }

    const handleTabsChange = (key: string) => {
        setActiveKey(key)
    }

    return (
        <div className={styles['tracing-management-container']}>
            <Tabs
                centered
                activeKey={activeKey}
                onChange={handleTabsChange}
                items={[
                    {
                        key: TabKeys['Waiting'],
                        icon: <img src={ss} />,
                        label: (
                            <div>
                                今日待随访
                                <span className={styles['count']}>{waiting}</span> 人
                            </div>
                        ),
                        children: <Table1 />,
                    },
                    {
                        key: TabKeys['Finished'],
                        icon: <img src={ywc} />,
                        label: (
                            <div>
                                今日已随访
                                <span className={styles['count']}>{finished}</span> 人
                            </div>
                        ),
                        children: <Table2 />,
                    },
                    {
                        key: TabKeys['All'],
                        icon: <img src={xj} />,
                        label: (
                            <div>
                                全部用户
                                <span className={styles['count']}>{all}</span> 人
                            </div>
                        ),
                        children: <Table3 />,
                    },
                ]}
            />
        </div>
    )
}
