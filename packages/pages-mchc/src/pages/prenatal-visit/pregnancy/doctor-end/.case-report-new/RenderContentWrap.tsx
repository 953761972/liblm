import { rt_ctx } from '@lm_fe/env';
import { BF_Wrap2 } from '@lm_fe/pages';
import { AnyObject } from '@lm_fe/utils';
import React, { useEffect } from 'react';
import { RenderContent } from './RenderContent';
import { IDataItem, IRenderContentProps } from './types';
const ctx = rt_ctx
interface IProps extends IRenderContentProps {
}

export default function RenderContentWrap(props: IProps) {
    const { activeItem, activeItemCache } = props

    const { config, Wrap } = BF_Wrap2({
        default_conf: {
            title: `门诊-个案登记卡-${activeItem.code}`,
            beforeSubmit(values: AnyObject,) {
                return values
            },
            handleBeforePopup(_: IDataItem) {
                const props = ctx.utils.safeGetFromFuncOrData(ctx.props, {})
                const activeItem = ctx.utils.get<IDataItem>(props, 'activeItem', {})!
                const id = ctx.utils.get(activeItem, 'id')

                if (id) {
                    return ctx.request.get<{ data: AnyObject[] }>(`/api/ic/getDetail`, {
                        params: { id: id }
                    }).then(res => res.data)
                }
                const data: IDataItem = ctx.utils.pick(activeItem, ['pregnancyId', 'admissionId', 'code', 'name', 'state', 'modType'])
                if (!activeItem.state) {
                    activeItem.state = 1
                }
                return data
            },
            tableColumns: () => import('./form_config')
        }
    },

        () => {

            return ({ activeItem: activeItemCache.current })
        })



    useEffect(() => {
        return () => { }
    }, [])



    return <Wrap>
        <RenderContent config={config} {...props} />
    </Wrap>
}
