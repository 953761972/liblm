import { BF_Wrap2, IBF_Default } from '@lm_fe/pages';
import React, { useEffect } from 'react';
import { IRenderContentProps, RenderContent } from './RenderContent';
import { AnyObject } from '@lm_fe/utils';
import { rt_ctx } from '@lm_fe/env';
const ctx = rt_ctx
interface IProps extends IRenderContentProps {
    tableColumns: any
    familyPlanningId: any
    active_title: string
}

export default function RenderContentWrap(props: IProps) {
    const { active_key, tableColumns, familyPlanningId, active_title } = props

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: `妇科专病-专科病历-${active_key}`,
            beforeSubmit(_data: AnyObject,) {
                if (!ctx.utils.get(_data, 'familyPlanningId')) {
                    _data.familyPlanningId = ctx.props.familyPlanningId
                }
                if (!ctx.utils.get(_data, 'checkType')) {
                    _data.checkType = ctx.props.name
                }
                _data.progressStatus = 4
                return _data
            },
            handleBeforePopup(_data: AnyObject) {
                const data = _data || {}
                const name = ctx.mchcEnv.user_data.firstName
                const treatment = ctx.utils.get(data, 'earlyPregnancyCheckDiagnosisAndTreatment') || {}
                if (!ctx.utils.get(treatment, 'registrationDate')) treatment['registrationDate'] = ctx.utils.formatDate()
                if (!ctx.utils.get(treatment, 'diagnoseDoctor')) treatment['diagnoseDoctor'] = name
                data.earlyPregnancyCheckDiagnosisAndTreatment = treatment
                return data
            },
            tableColumns
        }
    },

        { familyPlanningId, name: active_title })



    useEffect(() => {
        return () => { }
    }, [])



    return <Wrap>
        <RenderContent config={config} {...props} />
    </Wrap>
}
