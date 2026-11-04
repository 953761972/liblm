import React, { useState, useEffect } from 'react'
import { Anchor } from 'antd'
import { isEmpty, map } from 'lodash'
import { AnyObject, isObject, safeGetFromFuncOrData } from '@lm_fe/utils'

interface IMyAnchorConf {
    data: { id: string; title: string }[]
    props?: AnyObject
}

function FormAnchorWrap({ bf_config, children }: { bf_config: any; children: React.ReactNode }) {
    const [form_anchor, set_form_anchor] = useState<IMyAnchorConf>()

    useEffect(() => {
        const anchor = safeGetFromFuncOrData(bf_config?.anchor)

        if (isObject(anchor)) {
            set_form_anchor(anchor as any)
        }

        return () => {}
    }, [bf_config])

    if (!form_anchor || isEmpty(form_anchor)) return <>{children}</>
    return (
        <div
            id="Form-Anchor-Container"
            className="clearfix"
            style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', background: '#fff' }}
        >
            <div
                style={{
                    width: 98,
                    paddingTop: 12,
                    paddingRight: 12,
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 9,
                }}
            >
                <Anchor bounds={-50} getContainer={() => document.getElementById('Form-Anchor-Container')}>
                    {map(form_anchor.data, (item) => {
                        return <Anchor.Link key={item.id} href={`#${item.id}`} title={item.title} />
                    })}
                </Anchor>
            </div>
            <div style={{ height: '100%', paddingLeft: 98 }}>{children}</div>
        </div>
    )
}

export { FormAnchorWrap }
