import { MCHC_TYPE_MAP, MchcTypes } from "@lm_fe/env"
import { IMchc_Pregnancy } from "../../Pregnancy"





export interface IMchc_Doctor_Diagnoses<T extends MchcTypes = 'mchc'> {
    categoryCode: null
    categoryName: null
    createDate: string
    createdBy: string
    deleteDate: null
    deleted: null
    deletedoctor: null
    createdDate: string
    diagnosis: string
    diagnosisCode: string
    doctor: null
    gestationalWeek: string
    highrisk: false
    icdCode: null
    id: number
    lastModifiedBy: string
    lastModifiedDate: string
    note: string
    preNote: string
    pregnancy: IMchc_Pregnancy
    remark: null
    serialNo: T extends MCHC_TYPE_MAP['越秀妇幼'] ? string : never
    sort: number
    // 兼容
    visible: boolean

    outEmrId: number
    clear: boolean
    ignoreState: null

    visitNo: null
    depCode: null
    // new
    prenatalVisitId?: number
    pregnancyId?: number

}
