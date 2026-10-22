import { lazy } from "react";
import { IModel_EarlyPregnancyCheckSurgeryType } from "../../../.stupid_model";
import { TMorningOrAfternoon } from "../type";
import { Dayjs, EventEmitter } from "@lm_fe/utils";
import { mchcModal__ } from "@lm_fe/pages";
import React from "react";
import { Form } from "antd";
const Form1 = lazy(() => import('./Form1'))

export function open_签到_Modal(
    appointmentDate: Dayjs,
    appointmentMorningOrAfternoon: TMorningOrAfternoon,
    data: Partial<IModel_EarlyPregnancyCheckSurgeryType> = {},
    cb = () => { },
) {
    mchcModal__.open('test', {
        onClose(e) {
            cb()
        },
        title: '签到',
        width: '70vw',
        styles: { body: { height: '80vh', overflow: 'auto' } },

        modal_data: {
            content: <Form1

                data={{
                    ...data,
                    appointmentMorningOrAfternoon,
                    appointmentDate,
                }} />
        }
    })
}