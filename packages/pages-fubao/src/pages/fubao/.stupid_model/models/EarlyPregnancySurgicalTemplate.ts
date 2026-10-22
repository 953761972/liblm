
import { ModelService } from '../ModelService'


export interface IModel_EarlyPregnancySurgicalTemplate {
    attributes: string
    backgroundColor: string
    deleteFlag: 0
    fatherId: null
    id: number
    pacFollowUp: 0 | 1 //是否PAC跟踪随访（0没有，1有）
    surgicalGrade: number
    operationName: any
    operationType: string

    bloodRoutine: 2
    bmodeUltrasound: 1
    ecg: 2
    hepatitisB: 2
    hiv: 2
    leucorrhea: 2
    nat: 2
    routineUrine: 1
    sixCoagulation: 2
    syphilis: 2


    fontColor: string



    schedulingField: string,

}

export const SModel_EarlyPregnancySurgicalTemplate = new ModelService<IModel_EarlyPregnancySurgicalTemplate>({
    n: 'EarlyPregnancySurgicalTemplate',
    prePath: '/family/planning',
    addictionalParams: { deleteFlag: 0 }
})
