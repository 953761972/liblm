import { Page_DocRecord } from "@lm_fe/pages";
import { defineFormConfig, IMchc_FormDescriptions_Field } from "@lm_fe/service";
import React from "react";
import { DoctorEnd_ImageReport } from "src/pages/prenatal-visit/pregnancy/doctor-end/.image-report";
import { DoctorEnd_SurveyReport } from "src/pages/prenatal-visit/pregnancy/doctor-end/.survey-report";
export const 知情同意书_tab = defineFormConfig([
    {
        label: '知情同意书',
        fd_lazy: true,
        children: [
            {
                inputType: 'node',
                inputProps: {
                    node: <Page_DocRecord type='门诊' />
                }
            }
        ]
    },
    {
        label: '影像报告',
        fd_lazy: true,
        children: [
            {
                inputType: 'component',
                name: 'gynecologicalPatient',
                inputProps: {
                    component: ({ value }) =>
                        <DoctorEnd_ImageReport fubao headerInfo={value as any} />
                }
            }

        ]
    },
    {
        label: '检验报告',
        fd_lazy: true,
        children: [
            {
                inputType: 'component',
                name: 'gynecologicalPatient',
                inputProps: {
                    component: ({ value }) => <DoctorEnd_SurveyReport fubao headerInfo={value as any} />
                }
            }
        ]
    },
], { containerType: 'tabs' })