import { IGlobalModalProps } from '@lm_fe/components'
import { use_provoke } from '@lm_fe/provoke'
import {
    IMchc_Doctor_OutpatientHeaderInfo,
    SMchc_Doctor,
    TIdTypeCompatible
} from '@lm_fe/service'
import { Modal, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { 高危时间轴 } from './HighriskTimeline'
import styles from './index.module.less'
interface IProps {
    pregnancyId: TIdTypeCompatible
}
export default function HighriskFactor(props: IGlobalModalProps<IProps>) {
    const { modal_data, close, ...others } = props
    const { pregnancyId, } = modal_data

    const { 可选高危等级, 可选传染病 } = use_provoke('可选高危等级', '可选传染病')



    const [headerInfo, setHeaderInfo] = useState<IMchc_Doctor_OutpatientHeaderInfo>()

    useEffect(() => {

        SMchc_Doctor.getOutpatientHeaderInfo(pregnancyId).then(setHeaderInfo)

        return () => { }
    }, [])

    async function onOk() {





        close?.(true)
    }



    function handleClose() {
        close?.()
    }


    return (
        <Modal
            title='高危的时间轴'
            {...others}
            className={styles['highrisk-pop']}
            styles={{
                body: {
                    padding: 0,
                    maxHeight: 700,
                },
            }}
            width={'80vw'}
            onCancel={handleClose}
            onOk={onOk}
        >
            <高危时间轴 id={pregnancyId ?? headerInfo?.id} gradeOptions={可选高危等级} />
        </Modal>
    )
}

// console.dir("mapStateToProps",mapStateToProps);
