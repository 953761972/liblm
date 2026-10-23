import { lazy } from "react";
import { IModel_EarlyPregnancyCheckSurgeryType } from "../../../.stupid_model";
import { TMorningOrAfternoon } from "../type";
import { Dayjs, EventEmitter } from "@lm_fe/utils";
import { mchcModal__ } from "@lm_fe/pages";
import React from "react";
import { Form } from "antd";
const Form0 = lazy(() => import('./Form0'))

export function open_预约_Modal(
    appointmentDate: Dayjs,
    appointmentMorningOrAfternoon: TMorningOrAfternoon,
    data: Partial<IModel_EarlyPregnancyCheckSurgeryType> = {},
    cb = () => { },
) {
    mchcModal__.open('test', {
        onClose(e) {
            cb()
        },
        title: '预约',
        width: '70vw',
        styles: { body: { height: '80vh', overflow: 'auto' } },

        modal_data: {
            content: <Form0

                data={{
                    ...data,
                    appointmentMorningOrAfternoon,
                    appointmentDate,
                }} />
        }
    })
}