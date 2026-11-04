import { ICommonOption } from "@lm_fe/env"
import { IMchc_Doctor_Pregnancymh } from "../../Doctor"
import { IMchc_HusbandBaseInfoOfOutpatient, IMchc_PregnancyBaseInfoOfOutpatient } from "../../types"





interface IMchc_Nurse_OutpatientDocument_pregnancyInfo {
    "validateDate": string,
    "checkupNO": "23091101",
    "lmp": null,
    "edd": null,
    "sureEdd": "2024-06-27",
    "sureEddModify": 0,
    "conceiveMode": number,
    "conceiveModeNote": string,
    conceiveMode__: ICommonOption[],
    "preweight": null,
    "preheight": null,
    "bmi": null,
    "menarche": null,
    "menstrualCycle": null,
    "menstrualPeriod": null,
    "menstrualVolume": null,
    "dysmenorrhea": null,
    "dysmenorrhea__": null,
    "dysmenorrheaNote": null,
    "nearRelation": null,
    "maritalAge": null,
    "smoke": null,
    "smoke__": null,
    "smokeNote": null,
    "alcohol": null,
    "alcohol__": null,
    "alcoholNote": null,
    "radioactivity": null,
    "radioactivity__": null,
    "radioactivityNote": null,
    "medicine": null,
    "medicine__": null,
    "medicineNote": null,
    "hazardoussubstances": null,
    "hazardoussubstances__": null,
    "hazardoussubstancesNote": null,
    "hypertension": false,
    "hypertension__": false,
    "hypertensionNote": " ",
    "diabetes": false,
    "diabetes__": false,
    "diabetesNote": " ",
    "cardiacDisease": true,
    "cardiacDisease__": true,
    "cardiacDiseaseNote": " ",
    "operationmh": false,
    "operationmh__": false,
    "operationmhNote": " ",
    "transfusionHistory": false,
    "transfusionHistory__": false,
    "transfusionHistoryNote": " ",
    "fmh": {
        "hypertension": null,
        "hypertensionNote": null,
        "birthdefects": true,
        "birthdefectsNote": "bbbb",
        "heritableDisease": true,
        "heritableDiseaseNote": "cccc",
        "diabetes": true,
        "diabetesNote": "aaaa44",
        "other": null,
        "otherNote": null
    },
    "amh": {
        "drug": boolean,
        "drugNote": "青霉素类,喹啉类,链霉素,庆大霉素,磺胺类,卡那霉素,头孢类,利福平",
        "food": boolean,
        "foodNote": "",
        "other": boolean,
        "otherNote": "",
        "nothing": boolean,
        "unknown": boolean
    },
    "amh___": ICommonOption[]
    "personalBg": null,
    "personalRh": null,
    "partnerBg": null,
    "partnerRh": null,
    "deliveryPoint": null,
    "customerService": null,
    "branchNO": null,
    "checkAmy": null,
    "checkHospital": null,
    "hivResult": null,
    "syphilisResult": null,
    "hbvResult": null,
    "birthCertificate": string | null,
    "hasPerinatalLicense": string | null,
    "perinatalLicenseNumber": string | null,
    "pregnancyCourseAttendance": string | null,
    "followUpSurvey": string | null,
    "followUpSurveyScore": string | null,
    "appointmentConductorSituation": string | null,
    "outpatientResultScan": string | null,
    "inpatientRegistrationDate": string | null,
    "designatedDeliveryHospital": string | null
}

interface IMchc_Nurse_OutpatientDocument_highRiskInfo {

    "highriskGrade": "Ⅴ",
    "highriskNote": "产道异常:生殖道畸形",
    "infectionNote": "乙肝大三阳."
}
export interface IMchc_Nurse_OutpatientDocument_physicalExam {
    MyPressure1__: number[],
    MyPressure2__: number[],
    MyPressure3__: number[],
    "systolic": number,
    "diastolic": number,
    "systolic2": number,
    "diastolic2": number,
    "systolic3": number,
    "diastolic3": number,
    "pulse": number,
    "weight": number,
    "height": number
}
interface IMchc_Nurse_OutpatientDocument_referralInInfo {
    "id": 199,
    "reason": "22",
    "referralDate": "2023-11-10",
    "referralDirection": 1,
    "referralDept": "11",
    "referralDoctor": "11",
    "referralContactNumber": "11",
    "recorder": "admin",
    "organizationId": 8,
    "organizationName": "广东省妇幼保健院"
}


export interface IMchc_Nurse_OutpatientDocument {
    "id": 2921,
    "recordstate": "1" | "0" | "6",
    "baseInfo": IMchc_PregnancyBaseInfoOfOutpatient,
    "partnerInfo": IMchc_HusbandBaseInfoOfOutpatient,
    "pregnancyInfo": IMchc_Nurse_OutpatientDocument_pregnancyInfo,
    "pregnancymh": IMchc_Doctor_Pregnancymh[],
    "highRiskInfo": IMchc_Nurse_OutpatientDocument_highRiskInfo,
    "physicalExam": IMchc_Nurse_OutpatientDocument_physicalExam,
    "referralInInfo": IMchc_Nurse_OutpatientDocument_referralInInfo
}
