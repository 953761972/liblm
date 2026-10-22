import { IMyButtonProps, MyIcon, MySwitch, OkButton } from '@lm_fe/components_m';
import { IMchc_Questionnaire } from '@lm_fe/service';
import React, { useRef, useState } from 'react';
import { Questionnaire } from './Qn';
import { IQnBtnProps, TSelectCb } from './types';
import { mchcModal__ } from '../../modals';
import { mchcLogger } from '@lm_fe/env';
import { isEmpty } from '@lm_fe/utils';


function Inner({ onChange }: { onChange: (qs: IMchc_Questionnaire[]) => void }) {
    const [arr, setarr] = useState<IMchc_Questionnaire[]>([])
    const [multiple, setmultiple] = useState(false)

    return <div style={{ height: '100%', position: 'relative' }}>
        <MySwitch value={multiple} onChange={v => setmultiple(v)} checkedChildren='多选' unCheckedChildren='单选' style={{ position: 'absolute', left: 24, top: 24 }} />
        <Questionnaire selected={arr}
            onSelect={qs => {

                const selected_idx = arr.findIndex(s => s.id === qs?.id)
                let _arr = [...arr]

                if (selected_idx > -1) {
                    _arr.splice(selected_idx, 1)
                } else {
                    if (multiple) {
                        _arr.push(qs)
                    } else {
                        _arr = [qs]
                    }
                }
                setarr(_arr)


                onChange(_arr)
            }}
        />
    </div>
}

export function QuestionnaireButton(props: IQnBtnProps & IMyButtonProps) {
    const title = props.btn_text ?? '选择问卷'
    const arr = useRef<IMchc_Questionnaire[]>([])

    return <OkButton
        {...props}
        icon={<MyIcon value='SendOutlined' />}
        btn_text={title}
        onClick={() => {
            mchcModal__.open('box', {
                title,
                okText: '发送问卷',
                modal_data: { content: <Inner onChange={data => arr.current = data} /> },
                width: '80vw',
                styles: { body: { height: '80vh' }, },
                onClose(status) {
                    if (status && !isEmpty(arr.current)) props.onOk?.(arr.current)
                },
            })
        }}
    />
}
