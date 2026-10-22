import { calGestationalWeekBySureEdd, formatDate, request } from "@lm_fe/utils";
import dayjs, { Dayjs } from 'dayjs'
import { TIdTypeCompatible } from "src/types";




export const SLocal_Calculator = {

    async lmp_计算_edd_gestationalWeek(_lmp: string) {
        const lmp = formatDate(_lmp)!;

        const value = await SLocal_Calculator.calcEddBasedOnLmp(lmp);

        return {
            edd: value,
            sureEdd: value,
            gestationalWeek: calGestationalWeekBySureEdd(value),
        }
    },
    // 根据末次月经计算预产期B超
    async calcEddBasedOnLmp(lmp: string) {
        const { data } = await request.get<string>(`/api/pregnancyCalc-calcEddByLmp?lmp=${lmp}`);
        return formatDate(data) //2023-11-12
    },



    async calcGesWeek(data: { date: string, sureEdd?: string, id: TIdTypeCompatible }) {
        const r = await request.put<{ gestationalWeek: string }>(`/api/doctor/getGestationalWeek`, data)
        return r.data
    },

}