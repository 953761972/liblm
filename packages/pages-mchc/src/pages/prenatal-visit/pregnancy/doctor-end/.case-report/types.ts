import { TIdTypeCompatible } from "@lm_fe/service";

export interface ICaseReport {
    id?: TIdTypeCompatible
    caseType?: 'pregnancyId' | 'admissionId'
}
