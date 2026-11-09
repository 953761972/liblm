import React from 'react'
import { use_provoke } from '@lm_fe/provoke'

import Horizontal from './horizontal'
import Vertical from './vertical'

export function DoctorEnd_SurveyReport(props) {
    const { 检验报告_界面 } = use_provoke((_) => _.config)

    if (检验报告_界面 === '左列表_右详情') {
        return <Horizontal {...props} />
    }
    if (检验报告_界面 === '上查询_下列表') {
        return <Vertical {...props} />
    }
    return <div>未选UI</div>
}

export const SurveyReport = DoctorEnd_SurveyReport
