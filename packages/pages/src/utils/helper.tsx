// export * from './dynamicScriptCtx'

import { IMchc_Doctor_FirstVisitPresentmhOutpatient } from "@lm_fe/service";
import { calc_edd_by_IVF, calc_edd_by_ntExam, debounce, diff_between, expect_array, formatDate, ICommonOption, identity, safe_json_parse_arr, unmarshal_gestationWeek } from "@lm_fe/utils";

import { mchcModal__ } from "src/modals";
import React from "react";
type TNt = IMchc_Doctor_FirstVisitPresentmhOutpatient['ntExams']
const __conceive_fuck_edd = debounce({ delay: 300 },
    function (conceive: string, res: (v: string) => void, rej: () => void) {
        const item = safe_json_parse_arr<ICommonOption>(conceive)[0]
        if (item.value !== 1) return
        const arr_values = safe_json_parse_arr(item.text)

        const 移植时间 = arr_values[0]
        const 天数 = arr_values[1] ?? 0
        const edd = calc_edd_by_IVF(移植时间, 天数)

        if (移植时间 && 天数 && edd) {
            mchcModal__.open('box', {
                title: '是否需要纠正 预产期-B超',
                onClose(status) {
                    if (status) { res(edd) } else { rej() }
                },
                modal_data: { content: `根据胚胎移植时间，是否调整预产期B超时间为 ${edd}？`, }
            })
        }
    }
)

const __nt_fuck_edd = debounce({ delay: 300 },
    function (item: TNt, sureEdd: string, res: (v: string) => void, rej: () => void) {
        const target = expect_array(item)
            .map(_ => {
                const checkdate = _.checkdate

                const ntEdd = calc_edd_by_ntExam(checkdate, _.gestationalWeek!)
                let diff = Math.abs(diff_between(ntEdd, sureEdd, 'days'));

                return { ntEdd, diff, ..._ }
            })
            .filter(identity)
            .find(_ => {
                return _.diff > 7
            })



        const ntEdd = target?.ntEdd
        if (ntEdd) {
            mchcModal__.open('box', {
                title: '是否需要纠正 预产期-B超',
                async onClose(status) {
                    if (status) { res(ntEdd) } else { rej() }
                },
                modal_data: {
                    content: <>

                        <div>
                            根据 {target.checkdate} NT 检查如孕周数，推测预产期-B超：{formatDate(ntEdd)}
                        </div>
                        <div>
                            与预产期（{formatDate(sureEdd)}）相差 {target.diff} 天
                        </div>
                    </>
                }
            })

        }
    }
)
export function conceive_fuck_edd(conceiveMode__: string) {
    return new Promise<string>((resolve, reject) => {
        __conceive_fuck_edd(conceiveMode__, resolve, reject)
    })
}
export function nt_fuck_edd(item: TNt, sureEdd: string,) {

    return new Promise<string>((resolve, reject) => {
        __nt_fuck_edd(item, sureEdd, resolve, reject)
    })
}

