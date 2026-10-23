


export interface IMchc_QuestionLogic {
    bind: number
    selectOption: number[]
}
export interface IMchc_QuestionOption {
    deleteFlag: number
    fillTemplate: string
    id: number
    inputBoxRequired: number
    optionIndex: number
    optionScore: number
    optionTitle: string
    questionType: number
}
export interface IMchc_QuestionItem {
    deleteFlag: number
    id: number
    logic?: IMchc_QuestionLogic
    logicJson: string
    questionIndex: number
    questionOptionList?: IMchc_QuestionOption[]
    questionTitle: string
    questionType: number
    fullscreen: boolean
    required: number
}
export interface IMchc_QuestionGroup {
    groupTitle: string
    groupIndex: number
    groupDescription: string
    questionIndexList: number[]
    code: string
}
export interface IMchc_Questionnaire {
    createDate: string
    creator: string
    deleteFlag: number
    description: string
    groupVOList?: IMchc_QuestionGroup[]
    id: number
    publisher: null
    questionList?: IMchc_QuestionItem[]
    questionnaireTitle: string
    release: number
    releaseTime: null
    releaseType: number
}
export interface IMchc_QuestionWrite {
    beginTime: string
    endTime: string
    id: number
    outpatientNo: string
    isAnswer: number
    /** 当前问卷的最大总分（历史原因命名，业务含义为「总分」） */
    score?: number
    /** 本次答题实际得分（历史原因命名，业务含义为「得分」） */
    totalScore: number
    createTime: string
    questionnaire: IMchc_Questionnaire
    age: number
    expandField1: string
    expandField2: string
    expandField3: string
    expandField4: string
    fillDate: string
    name: string
    pushType: string
    questionnaireId: number
    questionnaireTitle: string
    residenceAddress: string
    telephone: string
    writeDetailList: {
        questionId: number
        questionResult: string
        optionIndex: string
        outpatientNo?: string
        questionnaireId?: number
        beginTime?: string
        endTime?: string
        id?: number,
        writerId?: number
    }[]
}






export interface IMchc_WriteRecord {
    fillDate: string
    id: number
    outpatientNo: string
    isAnswer: number
    questionnaireId: number
    totalScore: number
}
export function makeGoodQuestionnaire(remoteData: IMchc_Questionnaire) {
    const questionList = remoteData.questionList || []
    const indexList = questionList.map(_ => _.questionIndex)
    const groups = remoteData.groupVOList || []
    remoteData.questionList = questionList.filter(q => groups.some(grp => grp.questionIndexList.includes(q.questionIndex)))
    remoteData.groupVOList = groups.map(grp => ({ ...grp, questionIndexList: grp.questionIndexList.filter(idx => indexList.includes(idx)) }))
    return remoteData
}

