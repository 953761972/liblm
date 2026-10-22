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
            title: `妇科专病-手术病历-${active_key}`,
            beforeSubmit(_data: AnyObject,) {
                if (!ctx.utils.get(_data, 'familyPlanningId')) {
                    _data.familyPlanningId = ctx.props.familyPlanningId
                }
                _data.progressStatus = 4
                return _data
            },
            handleBeforePopup(_data: AnyObject) {
                const data = _data || {}
                const name = ctx.mchcEnv.user_data.firstName
                if (!ctx.utils.get(data, 'operationName')) data['operationName'] = ctx.props.name
                if (!ctx.utils.get(data, 'surgicalDate')) data['surgicalDate'] = ctx.utils.formatDate()
                if (!ctx.utils.get(data, 'appointmentPeople')) data['appointmentPeople'] = name
                if (!ctx.utils.get(data, 'surgicalDoctor')) data['surgicalDoctor'] = name
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
